-- Create storage bucket for collection media
INSERT INTO storage.buckets (id, name, public)
VALUES ('collection-media', 'collection-media', true);

-- Create RLS policies for storage
CREATE POLICY "Anyone can view collection media"
ON storage.objects FOR SELECT
USING (bucket_id = 'collection-media');

CREATE POLICY "Anyone can upload collection media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'collection-media');

-- Create table for media metadata
CREATE TABLE public.collection_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('audio', 'video', 'image')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collection_media ENABLE ROW LEVEL SECURITY;

-- Everyone can view media
CREATE POLICY "Anyone can view collection media"
ON public.collection_media FOR SELECT
USING (true);

-- Anyone can add media
CREATE POLICY "Anyone can add collection media"
ON public.collection_media FOR INSERT
WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.collection_media;