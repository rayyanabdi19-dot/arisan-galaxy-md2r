
-- arisan_members: drop anon policies
DROP POLICY IF EXISTS "Anyone can view members" ON public.arisan_members;
DROP POLICY IF EXISTS "Anyone can insert members" ON public.arisan_members;
DROP POLICY IF EXISTS "Anyone can update members" ON public.arisan_members;
DROP POLICY IF EXISTS "Anyone can delete members" ON public.arisan_members;

-- arisan_payments: drop anon policies
DROP POLICY IF EXISTS "Anyone can view payments" ON public.arisan_payments;
DROP POLICY IF EXISTS "Anyone can insert payments" ON public.arisan_payments;
DROP POLICY IF EXISTS "Anyone can update payments" ON public.arisan_payments;
DROP POLICY IF EXISTS "Anyone can delete payments" ON public.arisan_payments;

-- arisan_draws: drop anon policies
DROP POLICY IF EXISTS "Anyone can view draws" ON public.arisan_draws;
DROP POLICY IF EXISTS "Anyone can insert draws" ON public.arisan_draws;
DROP POLICY IF EXISTS "Anyone can update draws" ON public.arisan_draws;
DROP POLICY IF EXISTS "Anyone can delete draws" ON public.arisan_draws;
