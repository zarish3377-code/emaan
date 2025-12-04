-- Add sender_id column to track anonymous users
ALTER TABLE public.global_messages 
ADD COLUMN sender_id TEXT NOT NULL DEFAULT 'anonymous';