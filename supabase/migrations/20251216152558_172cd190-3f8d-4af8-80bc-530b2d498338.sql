-- Create table for personal notes that appear with daily messages
CREATE TABLE public.neno_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  day_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  author_email TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.neno_notes ENABLE ROW LEVEL SECURITY;

-- Anyone can view notes
CREATE POLICY "Anyone can view neno notes"
ON public.neno_notes
FOR SELECT
USING (true);

-- Only the specific user can insert notes
CREATE POLICY "Only admin can insert notes"
ON public.neno_notes
FOR INSERT
WITH CHECK (author_email = 'jellyjello3377@gmail.com');

-- Only the specific user can update their notes
CREATE POLICY "Only admin can update notes"
ON public.neno_notes
FOR UPDATE
USING (author_email = 'jellyjello3377@gmail.com');

-- Only the specific user can delete their notes
CREATE POLICY "Only admin can delete notes"
ON public.neno_notes
FOR DELETE
USING (author_email = 'jellyjello3377@gmail.com');