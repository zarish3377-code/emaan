// Tracks the currently-open book per user so admin can see who is reading what.
import { supabase } from "@/integrations/supabase/client";
import { getLibraryUserId, getLibraryUserEmail } from "./libraryData";

export interface ActiveReader {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  book_title: string;
  opened_at: string;
  last_seen_at: string;
}

export async function recordReadingStart(bookTitle: string) {
  const user_id = getLibraryUserId();
  const user_email = getLibraryUserEmail();
  const { data: { user } } = await supabase.auth.getUser();
  const user_name = (user?.user_metadata?.full_name as string | undefined)
    ?? (user?.user_metadata?.name as string | undefined)
    ?? user_email
    ?? 'Anonymous';
  const now = new Date().toISOString();
  // Upsert by user_id (unique)
  await supabase
    .from('library_active_readers')
    .upsert({
      user_id,
      user_email,
      user_name,
      book_title: bookTitle,
      opened_at: now,
      last_seen_at: now,
    }, { onConflict: 'user_id' });
}

export async function heartbeatReading(bookTitle: string) {
  const user_id = getLibraryUserId();
  await supabase
    .from('library_active_readers')
    .update({ last_seen_at: new Date().toISOString(), book_title: bookTitle })
    .eq('user_id', user_id);
}

export async function recordReadingStop() {
  const user_id = getLibraryUserId();
  await supabase
    .from('library_active_readers')
    .delete()
    .eq('user_id', user_id);
}

/** Admin-only fetch. Returns sessions seen within the last 2 minutes. */
export async function fetchActiveReaders(): Promise<ActiveReader[]> {
  const since = new Date(Date.now() - 2 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('library_active_readers')
    .select('*')
    .gte('last_seen_at', since)
    .order('last_seen_at', { ascending: false });
  if (error) { console.warn('fetchActiveReaders error', error); return []; }
  return (data || []) as ActiveReader[];
}
