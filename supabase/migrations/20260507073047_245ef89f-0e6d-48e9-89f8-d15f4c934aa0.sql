
-- 1. Role enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Security definer role checker
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 3. Policies on user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Auto-assign role on signup; first user becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- 5. Backfill: make existing users admin (so app keeps working)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. Tighten write policies on arisan_members (keep view for authenticated)
DROP POLICY IF EXISTS "Authenticated users can insert members" ON public.arisan_members;
DROP POLICY IF EXISTS "Authenticated users can update members" ON public.arisan_members;
DROP POLICY IF EXISTS "Authenticated users can delete members" ON public.arisan_members;

CREATE POLICY "Admins can insert members" ON public.arisan_members
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update members" ON public.arisan_members
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete members" ON public.arisan_members
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 7. Tighten write policies on arisan_draws
DROP POLICY IF EXISTS "Authenticated users can insert draws" ON public.arisan_draws;
DROP POLICY IF EXISTS "Authenticated users can update draws" ON public.arisan_draws;
DROP POLICY IF EXISTS "Authenticated users can delete draws" ON public.arisan_draws;

CREATE POLICY "Admins can insert draws" ON public.arisan_draws
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update draws" ON public.arisan_draws
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete draws" ON public.arisan_draws
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 8. Tighten write policies on arisan_payments
DROP POLICY IF EXISTS "Authenticated users can insert payments" ON public.arisan_payments;
DROP POLICY IF EXISTS "Authenticated users can update payments" ON public.arisan_payments;
DROP POLICY IF EXISTS "Authenticated users can delete payments" ON public.arisan_payments;

CREATE POLICY "Admins can insert payments" ON public.arisan_payments
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update payments" ON public.arisan_payments
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete payments" ON public.arisan_payments
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
