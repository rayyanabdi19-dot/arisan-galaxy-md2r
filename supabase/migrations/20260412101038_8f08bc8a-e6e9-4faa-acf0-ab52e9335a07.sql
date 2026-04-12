
CREATE TABLE public.arisan_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.arisan_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings" ON public.arisan_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can update settings" ON public.arisan_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert settings" ON public.arisan_settings FOR INSERT TO authenticated WITH CHECK (true);

CREATE TRIGGER update_arisan_settings_updated_at
  BEFORE UPDATE ON public.arisan_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.arisan_settings (key, value) VALUES ('iuran_per_bulan', '500000');
