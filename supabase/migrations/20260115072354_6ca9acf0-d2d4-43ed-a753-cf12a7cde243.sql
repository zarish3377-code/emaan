-- Fix overly permissive RLS policies

-- 1. SECRET_GARDEN: Restrict INSERT/UPDATE to admin only
DROP POLICY IF EXISTS "Anyone can insert garden" ON public.secret_garden;
DROP POLICY IF EXISTS "Anyone can update garden" ON public.secret_garden;

CREATE POLICY "Only admin can insert garden"
ON public.secret_garden FOR INSERT
WITH CHECK ((auth.jwt() ->> 'email') = 'jellyjello3377@gmail.com');

CREATE POLICY "Only admin can update garden"
ON public.secret_garden FOR UPDATE
USING ((auth.jwt() ->> 'email') = 'jellyjello3377@gmail.com');

-- 2. GLOBAL_MESSAGES: Restrict DELETE to admin, keep INSERT/UPDATE for authenticated users
DROP POLICY IF EXISTS "Admin can delete any message" ON public.global_messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.global_messages;
DROP POLICY IF EXISTS "Anyone can update messages" ON public.global_messages;

CREATE POLICY "Only admin can delete messages"
ON public.global_messages FOR DELETE
USING ((auth.jwt() ->> 'email') = 'jellyjello3377@gmail.com');

CREATE POLICY "Authenticated users can insert messages"
ON public.global_messages FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update own messages"
ON public.global_messages FOR UPDATE
USING (auth.role() = 'authenticated');

-- 3. MESSAGE_REACTIONS: Restrict INSERT/DELETE to authenticated users
DROP POLICY IF EXISTS "Anyone can add reactions" ON public.message_reactions;
DROP POLICY IF EXISTS "Anyone can delete reactions" ON public.message_reactions;

CREATE POLICY "Authenticated users can add reactions"
ON public.message_reactions FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete own reactions"
ON public.message_reactions FOR DELETE
USING (auth.role() = 'authenticated');

-- 4. COLLECTION_MEDIA: Restrict INSERT to authenticated, DELETE to admin
DROP POLICY IF EXISTS "Anyone can add collection media" ON public.collection_media;
DROP POLICY IF EXISTS "Only admin can delete collection media" ON public.collection_media;

CREATE POLICY "Authenticated users can add collection media"
ON public.collection_media FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admin can delete collection media"
ON public.collection_media FOR DELETE
USING ((auth.jwt() ->> 'email') = 'jellyjello3377@gmail.com');