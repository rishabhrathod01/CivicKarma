-- ============================================================
-- CivicKarma – Row Level Security Policies
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Enable RLS on every table
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.profiles                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_photos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_log               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_status_history ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- profiles
-- ────────────────────────────────────────────────────────────
-- Anyone authenticated can browse profiles (leaderboard, etc.)
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update only their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insert is handled by the on_auth_user_created trigger (SECURITY DEFINER),
-- so no explicit INSERT policy is needed for end-users.

-- ────────────────────────────────────────────────────────────
-- categories
-- ────────────────────────────────────────────────────────────
CREATE POLICY "categories_select_all"
  ON public.categories FOR SELECT
  USING (true);

-- Only the service role (admin) can write categories
CREATE POLICY "categories_insert_service"
  ON public.categories FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "categories_update_service"
  ON public.categories FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "categories_delete_service"
  ON public.categories FOR DELETE
  USING (auth.role() = 'service_role');

-- ────────────────────────────────────────────────────────────
-- subcategories
-- ────────────────────────────────────────────────────────────
CREATE POLICY "subcategories_select_all"
  ON public.subcategories FOR SELECT
  USING (true);

CREATE POLICY "subcategories_insert_service"
  ON public.subcategories FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "subcategories_update_service"
  ON public.subcategories FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "subcategories_delete_service"
  ON public.subcategories FOR DELETE
  USING (auth.role() = 'service_role');

-- ────────────────────────────────────────────────────────────
-- complaints
-- ────────────────────────────────────────────────────────────
-- Public transparency: anyone can read all complaints
CREATE POLICY "complaints_select_all"
  ON public.complaints FOR SELECT
  USING (true);

-- Authenticated users can create complaints for themselves
CREATE POLICY "complaints_insert_own"
  ON public.complaints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update only their own complaints (limited to description/photos before forwarding)
CREATE POLICY "complaints_update_own"
  ON public.complaints FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- complaint_photos
-- ────────────────────────────────────────────────────────────
CREATE POLICY "complaint_photos_select_all"
  ON public.complaint_photos FOR SELECT
  USING (true);

-- Users can insert photos for their own complaints
CREATE POLICY "complaint_photos_insert_own"
  ON public.complaint_photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.complaints c
      WHERE c.id = complaint_id
        AND c.user_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────
-- points_log
-- ────────────────────────────────────────────────────────────
-- Users can read their own point history
CREATE POLICY "points_log_select_own"
  ON public.points_log FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policy for end-users.
-- Points are inserted only via the SECURITY DEFINER function award_points().

-- ────────────────────────────────────────────────────────────
-- complaint_status_history
-- ────────────────────────────────────────────────────────────
-- Public transparency: anyone can read status history
CREATE POLICY "status_history_select_all"
  ON public.complaint_status_history FOR SELECT
  USING (true);

-- Only service role can insert status changes
CREATE POLICY "status_history_insert_service"
  ON public.complaint_status_history FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
