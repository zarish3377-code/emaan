-- Drop and recreate view with SECURITY INVOKER (default, safer)
DROP VIEW IF EXISTS public.neno_notes_public;

CREATE VIEW public.neno_notes_public 
WITH (security_invoker = true) AS
SELECT id, created_at, day_number, text
FROM public.neno_notes;

-- Grant access to the view
GRANT SELECT ON public.neno_notes_public TO anon, authenticated;

-- Add RLS policy to allow anon to select from base table (for view to work)
CREATE POLICY "Public can read notes via view"
ON public.neno_notes
FOR SELECT
TO anon
USING (true);