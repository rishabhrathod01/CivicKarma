-- ============================================================
-- CivicKarma – Initial Database Schema
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";      -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "cube";           -- n-dimensional cube type
CREATE EXTENSION IF NOT EXISTS "earthdistance";  -- earth_distance functions (depends on cube)

-- ============================================================
-- 1. profiles (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id              uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name            text        NOT NULL,
  phone           text,
  ward            text,
  points          integer     NOT NULL DEFAULT 0,
  total_reports   integer     NOT NULL DEFAULT 0,
  avatar_url      text,
  device_id       text,
  daily_report_count integer  NOT NULL DEFAULT 0,
  last_report_date   date,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Public profile for every authenticated user.';

-- ============================================================
-- 2. categories
-- ============================================================
CREATE TABLE public.categories (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text        NOT NULL,
  name_kn        text        NOT NULL,   -- Kannada translation
  department     text        NOT NULL CHECK (department IN ('bbmp', 'traffic', 'road_infra')),
  icon           text,
  display_order  integer     NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.categories IS 'Top-level complaint categories grouped by department.';

-- ============================================================
-- 3. subcategories
-- ============================================================
CREATE TABLE public.subcategories (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id    uuid        NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name           text        NOT NULL,
  name_kn        text        NOT NULL,
  display_order  integer     NOT NULL DEFAULT 0
);

COMMENT ON TABLE public.subcategories IS 'Subcategories within each category.';

-- ============================================================
-- 4. complaints
-- ============================================================
CREATE TABLE public.complaints (
  id               uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid             NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id      uuid             NOT NULL REFERENCES public.categories(id),
  subcategory_id   uuid             REFERENCES public.subcategories(id),
  description      text             NOT NULL,
  latitude         double precision NOT NULL,
  longitude        double precision NOT NULL,
  address          text,
  status           text             NOT NULL DEFAULT 'submitted'
                                    CHECK (status IN ('submitted', 'forwarded', 'acknowledged', 'resolved', 'rejected')),
  department       text             NOT NULL,
  contractor_info  jsonb,
  points_awarded   integer          NOT NULL DEFAULT 0,
  verified         boolean          NOT NULL DEFAULT false,
  created_at       timestamptz      NOT NULL DEFAULT now(),
  updated_at       timestamptz      NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.complaints IS 'Citizen-filed complaints with geo-location.';

-- Indexes for common query patterns
CREATE INDEX idx_complaints_user_id     ON public.complaints (user_id);
CREATE INDEX idx_complaints_category_id ON public.complaints (category_id);
CREATE INDEX idx_complaints_status      ON public.complaints (status);
CREATE INDEX idx_complaints_created_at  ON public.complaints (created_at DESC);

-- GiST index for geographic proximity queries (earth_distance uses cube under the hood)
CREATE INDEX idx_complaints_geo
  ON public.complaints
  USING gist (ll_to_earth(latitude, longitude));

-- ============================================================
-- 5. complaint_photos
-- ============================================================
CREATE TABLE public.complaint_photos (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id  uuid        NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  photo_url     text        NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.complaint_photos IS 'Photos attached to a complaint.';

-- ============================================================
-- 6. points_log
-- ============================================================
CREATE TABLE public.points_log (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  complaint_id  uuid        REFERENCES public.complaints(id) ON DELETE SET NULL,
  action        text        NOT NULL CHECK (action IN (
                              'valid_report', 'self_cleaned', 'parking_violation',
                              'false_report', 'govt_resolved'
                            )),
  points        integer     NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.points_log IS 'Audit log for every point award / deduction.';

-- ============================================================
-- 7. complaint_status_history
-- ============================================================
CREATE TABLE public.complaint_status_history (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id  uuid        NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  old_status    text,
  new_status    text        NOT NULL,
  changed_by    uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.complaint_status_history IS 'Full audit trail of complaint status transitions.';

-- ============================================================
-- Trigger function: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_complaints
  BEFORE UPDATE ON public.complaints
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Trigger: auto-create profile on auth.users INSERT
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email, 'User')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
