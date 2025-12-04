-- Create global_messages table for worldwide message board
CREATE TABLE public.global_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL DEFAULT 'General',
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.global_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read all messages (public access)
CREATE POLICY "Anyone can view all messages" 
ON public.global_messages 
FOR SELECT 
USING (true);

-- Allow anyone to insert messages (public access)
CREATE POLICY "Anyone can insert messages" 
ON public.global_messages 
FOR INSERT 
WITH CHECK (true);

-- Enable realtime for instant updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_messages;