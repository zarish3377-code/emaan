-- Create table for custom daily messages (overrides defaults)
CREATE TABLE public.neno_daily_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_number INTEGER NOT NULL UNIQUE,
  message TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.neno_daily_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can view messages
CREATE POLICY "Anyone can view daily messages"
ON public.neno_daily_messages
FOR SELECT
USING (true);

-- Only admin can insert
CREATE POLICY "Only admin can insert daily messages"
ON public.neno_daily_messages
FOR INSERT
WITH CHECK (updated_by = 'jellyjello3377@gmail.com');

-- Only admin can update
CREATE POLICY "Only admin can update daily messages"
ON public.neno_daily_messages
FOR UPDATE
USING (updated_by = 'jellyjello3377@gmail.com');

-- Only admin can delete
CREATE POLICY "Only admin can delete daily messages"
ON public.neno_daily_messages
FOR DELETE
USING (updated_by = 'jellyjello3377@gmail.com');