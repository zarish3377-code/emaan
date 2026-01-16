-- Drop the existing authenticated-only insert policy
DROP POLICY IF EXISTS "Authenticated users can insert messages" ON public.global_messages;

-- Create new policy allowing anyone to insert messages
CREATE POLICY "Anyone can insert messages"
ON public.global_messages FOR INSERT
WITH CHECK (true);