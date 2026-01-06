-- Add UPDATE policy for admin
CREATE POLICY "Admin can update any message"
ON public.global_messages
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Add DELETE policy for admin  
CREATE POLICY "Admin can delete any message"
ON public.global_messages
FOR DELETE
USING (true);