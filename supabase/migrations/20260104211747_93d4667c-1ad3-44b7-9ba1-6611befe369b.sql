-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for storing next meetup date
CREATE TABLE public.countdown_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  next_meetup_date TIMESTAMP WITH TIME ZONE NOT NULL,
  meetup_title TEXT NOT NULL DEFAULT 'Our Next Date',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.countdown_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view the countdown
CREATE POLICY "Anyone can view countdown settings"
ON public.countdown_settings
FOR SELECT
USING (true);

-- Only admin can insert/update/delete
CREATE POLICY "Only admin can insert countdown settings"
ON public.countdown_settings
FOR INSERT
WITH CHECK (updated_by = 'jellyjello3377@gmail.com');

CREATE POLICY "Only admin can update countdown settings"
ON public.countdown_settings
FOR UPDATE
USING (updated_by = 'jellyjello3377@gmail.com');

CREATE POLICY "Only admin can delete countdown settings"
ON public.countdown_settings
FOR DELETE
USING (updated_by = 'jellyjello3377@gmail.com');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_countdown_settings_updated_at
BEFORE UPDATE ON public.countdown_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();