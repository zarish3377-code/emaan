-- Drop existing update policy
DROP POLICY IF EXISTS "Admin can update any message" ON public.global_messages;

-- Create new policy allowing anyone to update messages
CREATE POLICY "Anyone can update messages"
ON public.global_messages
FOR UPDATE
USING (true)
WITH CHECK (true);