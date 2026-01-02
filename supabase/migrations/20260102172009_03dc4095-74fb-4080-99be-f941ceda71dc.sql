-- Create a secure view that excludes the author_email column
CREATE OR REPLACE VIEW public.neno_notes_public AS
SELECT id, created_at, day_number, text
FROM public.neno_notes;

-- Grant access to the view
GRANT SELECT ON public.neno_notes_public TO anon, authenticated;

-- Update RLS policy on base table to restrict SELECT to admin only
DROP POLICY IF EXISTS "Anyone can view neno notes" ON public.neno_notes;

CREATE POLICY "Only admin can view neno notes directly"
ON public.neno_notes
FOR SELECT
TO authenticated
USING (author_email = 'jellyjello3377@gmail.com');