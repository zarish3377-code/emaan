-- Fix 1: Add validation constraints to secret_garden to prevent data corruption
ALTER TABLE public.secret_garden 
ADD CONSTRAINT secret_garden_counts_non_negative 
CHECK (tulip_count >= 0 AND daisy_count >= 0 AND days_cared >= 0);

-- Add constraint to ensure flowers is an array
ALTER TABLE public.secret_garden 
ADD CONSTRAINT secret_garden_flowers_is_array 
CHECK (jsonb_typeof(flowers) = 'array');

-- Fix 2: Update countdown_settings to use generic identifier instead of exposing email
-- First update existing records to use 'admin' instead of email
UPDATE public.countdown_settings SET updated_by = 'admin' WHERE updated_by = 'jellyjello3377@gmail.com';

-- Update neno_daily_messages as well
UPDATE public.neno_daily_messages SET updated_by = 'admin' WHERE updated_by = 'jellyjello3377@gmail.com';

-- Drop old RLS policies that reference email
DROP POLICY IF EXISTS "Only admin can delete countdown settings" ON public.countdown_settings;
DROP POLICY IF EXISTS "Only admin can insert countdown settings" ON public.countdown_settings;
DROP POLICY IF EXISTS "Only admin can update countdown settings" ON public.countdown_settings;

DROP POLICY IF EXISTS "Only admin can delete daily messages" ON public.neno_daily_messages;
DROP POLICY IF EXISTS "Only admin can insert daily messages" ON public.neno_daily_messages;
DROP POLICY IF EXISTS "Only admin can update daily messages" ON public.neno_daily_messages;

-- Create new policies using auth.jwt() email claim instead of stored email
CREATE POLICY "Only admin can delete countdown settings"
ON public.countdown_settings FOR DELETE
USING ((auth.jwt() ->> 'email') = 'jellyjello3377@gmail.com');

CREATE POLICY "Only admin can insert countdown settings"
ON public.countdown_settings FOR INSERT
WITH CHECK ((auth.jwt() ->> 'email') = 'jellyjello3377@gmail.com');

CREATE POLICY "Only admin can update countdown settings"
ON public.countdown_settings FOR UPDATE
USING ((auth.jwt() ->> 'email') = 'jellyjello3377@gmail.com');

CREATE POLICY "Only admin can delete daily messages"
ON public.neno_daily_messages FOR DELETE
USING ((auth.jwt() ->> 'email') = 'jellyjello3377@gmail.com');

CREATE POLICY "Only admin can insert daily messages"
ON public.neno_daily_messages FOR INSERT
WITH CHECK ((auth.jwt() ->> 'email') = 'jellyjello3377@gmail.com');

CREATE POLICY "Only admin can update daily messages"
ON public.neno_daily_messages FOR UPDATE
USING ((auth.jwt() ->> 'email') = 'jellyjello3377@gmail.com');