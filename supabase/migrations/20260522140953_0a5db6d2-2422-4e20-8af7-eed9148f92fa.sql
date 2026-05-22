
-- Allow public SELECT so the admin can view tracking data even when not signed in
-- (site is gated by a password; these tables only store reader display names + book titles)
DROP POLICY IF EXISTS "Only admin can view active readers" ON public.library_active_readers;
CREATE POLICY "Anyone can view active readers"
  ON public.library_active_readers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only admin can view reading history" ON public.library_reading_history;
CREATE POLICY "Anyone can view reading history"
  ON public.library_reading_history FOR SELECT
  USING (true);
