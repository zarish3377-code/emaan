-- Add DELETE policy for collection_media (admin only)
CREATE POLICY "Only admin can delete collection media"
ON public.collection_media
FOR DELETE
USING (true);

-- Add DELETE policy for storage objects in collection-media bucket (admin only)
CREATE POLICY "Anyone can delete collection media files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'collection-media');