
CREATE TABLE public.library_active_readers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  user_email TEXT,
  user_name TEXT,
  book_title TEXT NOT NULL,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.library_active_readers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admin can view active readers"
ON public.library_active_readers FOR SELECT
USING ((auth.jwt() ->> 'email') = 'jellyjello3377@gmail.com');

CREATE POLICY "Anyone can record a reading session"
ON public.library_active_readers FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update a reading session"
ON public.library_active_readers FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete a reading session"
ON public.library_active_readers FOR DELETE
USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.library_active_readers;
