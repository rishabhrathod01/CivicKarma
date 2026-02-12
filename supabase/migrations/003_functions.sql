-- ============================================================
-- CivicKarma – PostgreSQL Functions
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. check_duplicate_report
--    Returns TRUE if a similar complaint already exists within
--    `p_radius_meters` and `p_hours` of the given location.
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.check_duplicate_report(
  p_lat            double precision,
  p_lng            double precision,
  p_category_id    uuid,
  p_radius_meters  integer DEFAULT 50,
  p_hours          integer DEFAULT 2
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.complaints c
    WHERE c.category_id = p_category_id
      AND c.status NOT IN ('resolved', 'rejected')
      AND c.created_at >= (now() - make_interval(hours => p_hours))
      -- earth_distance returns metres between two earth-surface points
      AND earth_distance(
            ll_to_earth(c.latitude, c.longitude),
            ll_to_earth(p_lat, p_lng)
          ) <= p_radius_meters
  ) INTO v_exists;

  RETURN v_exists;
END;
$$;

COMMENT ON FUNCTION public.check_duplicate_report IS
  'Returns true when a non-resolved complaint of the same category exists within the given radius and time window.';

-- ────────────────────────────────────────────────────────────
-- 2. award_points
--    Awards (or deducts) points for a given action.
--    Returns the number of points awarded.
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.award_points(
  p_user_id      uuid,
  p_complaint_id uuid,
  p_action       text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_points integer;
BEGIN
  -- Determine points based on action type
  v_points := CASE p_action
    WHEN 'valid_report'       THEN 10
    WHEN 'self_cleaned'       THEN 30
    WHEN 'parking_violation'  THEN 15
    WHEN 'false_report'       THEN -20
    WHEN 'govt_resolved'      THEN 5
    ELSE 0
  END;

  -- Guard against unknown actions
  IF v_points = 0 THEN
    RAISE EXCEPTION 'Unknown action type: %', p_action;
  END IF;

  -- Insert audit log entry
  INSERT INTO public.points_log (user_id, complaint_id, action, points)
  VALUES (p_user_id, p_complaint_id, p_action, v_points);

  -- Update user totals
  UPDATE public.profiles
  SET points = points + v_points
  WHERE id = p_user_id;

  RETURN v_points;
END;
$$;

COMMENT ON FUNCTION public.award_points IS
  'Awards points for a given action, logs it, and updates the user profile. SECURITY DEFINER to bypass RLS on points_log.';

-- ────────────────────────────────────────────────────────────
-- 3. get_leaderboard
--    Returns the top users ranked by points.
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_leaderboard(
  p_limit  integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  user_id       uuid,
  name          text,
  avatar_url    text,
  points        integer,
  total_reports integer,
  rank          bigint
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id            AS user_id,
    p.name,
    p.avatar_url,
    p.points,
    p.total_reports,
    RANK() OVER (ORDER BY p.points DESC) AS rank
  FROM public.profiles p
  WHERE p.points > 0
  ORDER BY p.points DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

COMMENT ON FUNCTION public.get_leaderboard IS
  'Returns a ranked leaderboard of users ordered by points descending.';

-- ────────────────────────────────────────────────────────────
-- 4. check_daily_limit
--    Returns TRUE if the user can still submit reports today.
--    Automatically resets the daily counter if the date rolled over.
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.check_daily_limit(
  p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
  v_last  date;
BEGIN
  SELECT daily_report_count, last_report_date
  INTO v_count, v_last
  FROM public.profiles
  WHERE id = p_user_id;

  -- If the last report was on a different day, reset the counter
  IF v_last IS NULL OR v_last < CURRENT_DATE THEN
    UPDATE public.profiles
    SET daily_report_count = 0,
        last_report_date   = CURRENT_DATE
    WHERE id = p_user_id;

    RETURN true;  -- counter is now 0, user can report
  END IF;

  -- Allow up to 5 reports per day
  RETURN v_count < 5;
END;
$$;

COMMENT ON FUNCTION public.check_daily_limit IS
  'Returns true if the user has filed fewer than 5 reports today. Resets the counter on a new day.';

-- ────────────────────────────────────────────────────────────
-- 5. increment_report_count
--    Bumps daily_report_count and total_reports after a
--    successful complaint submission.
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.increment_report_count(
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET daily_report_count = daily_report_count + 1,
      total_reports      = total_reports + 1,
      last_report_date   = CURRENT_DATE
  WHERE id = p_user_id;
END;
$$;

COMMENT ON FUNCTION public.increment_report_count IS
  'Increments daily and total report counts after a successful complaint submission.';
