UPDATE storage.buckets SET public = true WHERE id = 'books';

CREATE POLICY "Public read access for books" ON storage.objects
FOR SELECT USING (bucket_id = 'books');