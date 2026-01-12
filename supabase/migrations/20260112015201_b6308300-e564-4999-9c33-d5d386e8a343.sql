-- Add color column to global_messages table
ALTER TABLE public.global_messages 
ADD COLUMN color TEXT DEFAULT NULL;

-- Allow anyone to update message colors (for admin color changes)
-- The existing UPDATE policy already allows this