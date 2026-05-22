// Book definitions in the exact order specified
export interface BookDef {
  title: string;
  fileName: string;
}

export const BOOKS: BookDef[] = [
  // Spiritual & Islamic Reflections
  { title: "Reflecting on the Names of Allah", fileName: "Reflecting On the Names of Allah.pdf" },
  { title: "Secrets of Divine Love", fileName: "_A_Helwa_-_Secrets_of_Divine_Love.pdf" },
  { title: "Fatima: The Flower of Life", fileName: "__Fatima_The_Flower_of_Life_-_Jalal_Moughania.pdf" },
  { title: "A Muslim Woman's Diary", fileName: "_A_muslim_womans_diary_-_Sumaya_Amiri.pdf" },
  { title: "Timeless Seeds of Advice", fileName: "_Timeless_Seeds_of_Advice_-_BB_Abdulla.pdf" },
  { title: "Believing Women in Islam", fileName: "_Believing_Women_in_Islam_-_Asma_Barlas.pdf" },

  // Thriller, Mystery & Suspense
  { title: "Dark Matter", fileName: "Dark_Matter_-_Blake_Crouch.pdf" },
  { title: "The Secret History", fileName: "_The_Secret_History_-_Donna_Tartt.pdf" },
  { title: "Big Little Lies", fileName: "_Big_Little_Lies_-_Liane_Moriarty.pdf" },
  { title: "The Family Upstairs", fileName: "_The_Family_Upstairs_-_Lisa_Jewell.pdf" },
  { title: "No Exit", fileName: "_No_Exit_-_Taylor_Adams.pdf" },
  { title: "Bunny", fileName: "__Bunny_-_Mona_Awad.pdf" },
  { title: "The Eyes Are the Best Part", fileName: "_The_Eyes_Are_the_Best_Part_-_Monika_Kim.pdf" },
  { title: "Don't Let Her Stay", fileName: "__Dont_let_her_stay_-_Nicola_sanders.pdf" },
  { title: "Sometimes I Lie", fileName: "_Sometimes_I_Lie__The_gripping_debut_psycho_-_Alice_Feeney.pdf" },
  { title: "The Mysterious Affair at Styles", fileName: "_AGATHA_CHRISTIE_Ultimate_Collection_-_Agatha_Christie.pdf" },
  { title: "I Have No Mouth, and I Must Scream", fileName: "_I_Have_No_Mouth_and_I_Must_Scream_-_Harlan_Ellison.pdf" },

  // Psychology, Crime & Biography
  { title: "Attached", fileName: "_Attached_-_Dr_Amir_Levine_and_Rachel_SF_Heller.pdf" },
  { title: "Talking with Psychopaths and Savages", fileName: "_Talking_With_Psychopaths_and_Savages_Beyond_Evil_-_Christopher_Berry_Dee.pdf" },
  { title: "The Anatomy of Violence", fileName: "_The_Anatomy_of_Violence_-_Adrian_Raine.pdf" },
  { title: "Unnatural Causes", fileName: "_Unnatural_Causes_-_DR_RICHARD_SHEPHERD.pdf" },
  { title: "Agatha Christie: A Biography", fileName: "_Agatha_Christie_-_Laura_Thompson.pdf" },
  { title: "In Cold Blood", fileName: "_In_Cold_Blood_-_Truman_Capote.pdf" },

  // Philosophy & Self-Transformation
  { title: "Becoming Supernatural", fileName: "_Becoming_Supernatural__How_Common_People_A_-_Dr_Joe_Dispenza.pdf" },
  { title: "Near to the Wild Heart", fileName: "_Near_to_the_Wild_Heart_-_Clarice_Lispector.pdf" },
  { title: "A Breath of Life", fileName: "_A_Breath_of_Life_-_Clarice_Lispector.pdf" },
  { title: "Água Viva", fileName: "_Agua_Viva_-_Clarice_Lispector.pdf" },
  { title: "The Passion According to G.H.", fileName: "_The_Passion_According_to_GH_-_Clarice_Lispector.pdf" },

  // Historical & Literary Drama
  { title: "As Long as the Lemon Trees Grow", fileName: "_As_Long_as_the_Lemon_Trees_Grow_-_Zoulfa_Katouh.pdf" },
  { title: "The House Without Windows", fileName: "_The_house_without_windows_-_Nadia_hashimi.pdf" },
  { title: "To Kill a Mockingbird", fileName: "_To_kill_a_mocking_bird_-_Haper_Lee.pdf" },
  { title: "A Farewell to Arms", fileName: "_A_Farewell_to_Arms_-_Ernest_Hemingway.pdf" },
  { title: "Lapvona", fileName: "_Lapvona_-_Ottessa_Moshfegh.pdf" },
  { title: "A Clockwork Orange", fileName: "_A_Clockwork_Orange_-_Anthony_Burgess.pdf" },
  { title: "Lolita", fileName: "__Lolita_-_Vladimir_nabokov.pdf" },

  // Growth & Perspective
  { title: "Oona Out of Order", fileName: "Oona_Out_of_Order_-_Margarita_Montimore.pdf" },
  { title: "Meet Me in Another Life", fileName: "Meet_Me_in_Another_Life_-_Catriona_Silvey.pdf" },
  { title: "Invisible Man", fileName: "_The_invisible_man_-_Ralph_Ellison.pdf" },
  { title: "The Color Purple", fileName: "_The_Color_Purple_-_Alice_Walker.pdf" },
  { title: "The Importance of Being Earnest", fileName: "_The_Importance_of_Being_Earnest_and_Other_-_Oscar_Wilde.pdf" },
];

export const SUPABASE_BOOKS_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/books`;

export function getBookUrl(fileName: string): string {
  return `${SUPABASE_BOOKS_URL}/${encodeURIComponent(fileName)}`;
}

// ── Per-user identity ──────────────────────────────────────────────
const ADMIN_EMAIL = 'jellyjello3377@gmail.com';

export function getLibraryUserId(): string {
  // Try to get auth user from supabase session stored in localStorage
  const sbKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
  if (sbKey) {
    try {
      const session = JSON.parse(localStorage.getItem(sbKey) || '');
      if (session?.user?.id) return session.user.id;
    } catch {}
  }
  // Fallback: generate anonymous UUID
  let id = localStorage.getItem('library_userId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('library_userId', id);
  }
  return id;
}

export function getLibraryUserEmail(): string | null {
  const sbKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
  if (sbKey) {
    try {
      const session = JSON.parse(localStorage.getItem(sbKey) || '');
      return session?.user?.email || null;
    } catch {}
  }
  return null;
}

export function isLibraryAdmin(): boolean {
  return getLibraryUserEmail() === ADMIN_EMAIL;
}

// ── Bookmark types ─────────────────────────────────────────────────
export interface Bookmark {
  page: number;
  label: string;
  timestamp: string;
  userId?: string;
}

// ── Annotation types ───────────────────────────────────────────────
export interface Annotation {
  id: string;
  type: 'highlight' | 'note';
  page: number;
  content: string;
  color?: string;
  position?: { x: number; y: number };
  /** Optional inline card position override (percent of page). */
  cardOffset?: { x: number; y: number };
  /** Inline card size in px (within clamps). */
  cardSize?: { w: number; h: number };
  /** Optional freehand whiteboard drawing as PNG data URL. */
  drawing?: string;
  /** Marker flower style for the page indicator. */
  marker?: 'tulip' | 'daisy';
  timestamp: string;
  userId?: string;
}

// ── Storage helpers (per-user namespaced) ──────────────────────────
function userBookmarksKey(userId: string, title: string) {
  return `library_bookmarks_${userId}_${title}`;
}

function userAnnotationsKey(userId: string, title: string) {
  return `library_annotations_${userId}_${title}`;
}

/** Get bookmarks for a specific user (or all users if admin). */
export function getBookmarks(title: string): Bookmark[] {
  const userId = getLibraryUserId();
  const admin = isLibraryAdmin();

  if (admin) {
    // Collect from all users
    return getAllUserData<Bookmark>('library_bookmarks_', title);
  }

  try {
    const raw = localStorage.getItem(userBookmarksKey(userId, title));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveBookmarks(title: string, bookmarks: Bookmark[]) {
  const userId = getLibraryUserId();
  if (!userId) { console.error("No user ID — cannot save bookmarks"); return; }
  // Tag each bookmark with userId
  const tagged = bookmarks.map(b => ({ ...b, userId }));
  localStorage.setItem(userBookmarksKey(userId, title), JSON.stringify(tagged));
}

export function getAnnotations(title: string): Annotation[] {
  const userId = getLibraryUserId();
  const admin = isLibraryAdmin();

  if (admin) {
    return getAllUserData<Annotation>('library_annotations_', title);
  }

  try {
    const raw = localStorage.getItem(userAnnotationsKey(userId, title));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveAnnotations(title: string, annotations: Annotation[]) {
  const userId = getLibraryUserId();
  if (!userId) { console.error("No user ID — cannot save annotations"); return; }
  const tagged = annotations.map(a => ({ ...a, userId }));
  localStorage.setItem(userAnnotationsKey(userId, title), JSON.stringify(tagged));
}

/** Scan all localStorage keys matching a prefix pattern to aggregate data from all users (admin only). */
function getAllUserData<T extends { userId?: string }>(prefix: string, title: string): T[] {
  const all: T[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix) && key.endsWith(`_${title}`)) {
      try {
        const items: T[] = JSON.parse(localStorage.getItem(key) || '[]');
        all.push(...items);
      } catch {}
    }
  }
  return all;
}

// ── Migration: move old un-namespaced data to current user ────────
(function migrateOldData() {
  const userId = getLibraryUserId();
  BOOKS.forEach(book => {
    const oldBmKey = `library_bookmarks_${book.title}`;
    const oldAnKey = `library_annotations_${book.title}`;
    const newBmKey = userBookmarksKey(userId, book.title);
    const newAnKey = userAnnotationsKey(userId, book.title);

    // Only migrate if new key doesn't exist yet and old key does
    if (!localStorage.getItem(newBmKey) && localStorage.getItem(oldBmKey)) {
      localStorage.setItem(newBmKey, localStorage.getItem(oldBmKey)!);
      localStorage.removeItem(oldBmKey);
    }
    if (!localStorage.getItem(newAnKey) && localStorage.getItem(oldAnKey)) {
      localStorage.setItem(newAnKey, localStorage.getItem(oldAnKey)!);
      localStorage.removeItem(oldAnKey);
    }
  });
})();
