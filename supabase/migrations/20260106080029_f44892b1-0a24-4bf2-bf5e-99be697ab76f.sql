-- Create table for message reactions
CREATE TABLE public.message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.global_messages(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  sender_id TEXT NOT NULL DEFAULT 'anonymous',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, emoji, sender_id)
);

-- Enable RLS
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- Anyone can view reactions
CREATE POLICY "Anyone can view reactions"
ON public.message_reactions
FOR SELECT
USING (true);

-- Anyone can add reactions
CREATE POLICY "Anyone can add reactions"
ON public.message_reactions
FOR INSERT
WITH CHECK (true);

-- Anyone can delete their own reactions
CREATE POLICY "Anyone can delete reactions"
ON public.message_reactions
FOR DELETE
USING (true);

-- Enable realtime for reactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;