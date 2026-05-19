
CREATE TABLE public.library_reading_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT,
  user_name TEXT,
  book_title TEXT NOT NULL,
  last_page INTEGER NOT NULL DEFAULT 1,
  total_pages INTEGER,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, book_title)
);

CREATE INDEX library_reading_history_updated_idx
  ON public.library_reading_history (updated_at DESC);

ALTER TABLE public.library_reading_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admin can view reading history"
ON public.library_reading_history FOR SELECT
USING ((auth.jwt() ->> 'email') = 'jellyjello3377@gmail.com');

CREATE POLICY "Anyone can record reading progress"
ON public.library_reading_history FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update reading progress"
ON public.library_reading_history FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete reading progress"
ON public.library_reading_history FOR DELETE
USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.library_reading_history;
