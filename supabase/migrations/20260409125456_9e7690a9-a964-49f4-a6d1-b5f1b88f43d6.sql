
-- Create members table
CREATE TABLE public.arisan_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  member_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.arisan_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.arisan_members(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL DEFAULT 500000,
  month TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'transfer',
  status TEXT NOT NULL DEFAULT 'lunas',
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create draws table (tracks who has won - no duplicates allowed)
CREATE TABLE public.arisan_draws (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.arisan_members(id) ON DELETE CASCADE,
  round INT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 7500000,
  draw_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(member_id)
);

-- Enable RLS
ALTER TABLE public.arisan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arisan_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arisan_draws ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to CRUD
CREATE POLICY "Authenticated users can view members" ON public.arisan_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert members" ON public.arisan_members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update members" ON public.arisan_members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete members" ON public.arisan_members FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view payments" ON public.arisan_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert payments" ON public.arisan_payments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update payments" ON public.arisan_payments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete payments" ON public.arisan_payments FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view draws" ON public.arisan_draws FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert draws" ON public.arisan_draws FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update draws" ON public.arisan_draws FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete draws" ON public.arisan_draws FOR DELETE TO authenticated USING (true);

-- Also allow anonymous access for now (no auth yet)
CREATE POLICY "Anyone can view members" ON public.arisan_members FOR SELECT TO anon USING (true);
CREATE POLICY "Anyone can insert members" ON public.arisan_members FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anyone can update members" ON public.arisan_members FOR UPDATE TO anon USING (true);
CREATE POLICY "Anyone can delete members" ON public.arisan_members FOR DELETE TO anon USING (true);

CREATE POLICY "Anyone can view payments" ON public.arisan_payments FOR SELECT TO anon USING (true);
CREATE POLICY "Anyone can insert payments" ON public.arisan_payments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anyone can update payments" ON public.arisan_payments FOR UPDATE TO anon USING (true);
CREATE POLICY "Anyone can delete payments" ON public.arisan_payments FOR DELETE TO anon USING (true);

CREATE POLICY "Anyone can view draws" ON public.arisan_draws FOR SELECT TO anon USING (true);
CREATE POLICY "Anyone can insert draws" ON public.arisan_draws FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anyone can update draws" ON public.arisan_draws FOR UPDATE TO anon USING (true);
CREATE POLICY "Anyone can delete draws" ON public.arisan_draws FOR DELETE TO anon USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_arisan_members_updated_at
  BEFORE UPDATE ON public.arisan_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
