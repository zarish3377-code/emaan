// Book definitions in the exact order specified
export interface BookDef {
  title: string;
  fileName: string;
}

export const BOOKS: BookDef[] = [
  { title: "Reflecting on the Names of Allah", fileName: "Reflecting On the Names of Allah.pdf" },
  { title: "Dark Matter", fileName: "Dark_Matter_-_Blake_Crouch.pdf" },
  { title: "The Secret History", fileName: "_The_Secret_History_-_Donna_Tartt.pdf" },
  { title: "Don't Let Her Stay", fileName: "__Dont_let_her_stay_-_Nicola_sanders.pdf" },
  { title: "Sometimes I Lie", fileName: "_Sometimes_I_Lie__The_gripping_debut_psycho_-_Alice_Feeney.pdf" },
  { title: "The Mysterious Affair at Styles", fileName: "_AGATHA_CHRISTIE_Ultimate_Collection_-_Agatha_Christie.pdf" },
  { title: "I Have No Mouth, and I Must Scream", fileName: "_I_Have_No_Mouth_and_I_Must_Scream_-_Harlan_Ellison.pdf" },
  { title: "Talking with Psychopaths and Savages", fileName: "_Talking_With_Psychopaths_and_Savages_Beyond_Evil_-_Christopher_Berry_Dee.pdf" },
  { title: "The Anatomy of Violence", fileName: "_The_Anatomy_of_Violence_-_Adrian_Raine.pdf" },
  { title: "Unnatural Causes", fileName: "_Unnatural_Causes_-_DR_RICHARD_SHEPHERD.pdf" },
  { title: "The True Crime Dictionary", fileName: "_A_Dictionary_of_True_Crime_-_Stephen_Wade.pdf" },
  { title: "In Cold Blood", fileName: "_In_Cold_Blood_-_Truman_Capote.pdf" },
  { title: "Near to the Wild Heart", fileName: "_Near_to_the_Wild_Heart_-_Clarice_Lispector.pdf" },
  { title: "A Breath of Life", fileName: "_A_Breath_of_Life_-_Clarice_Lispector.pdf" },
  { title: "Água Viva", fileName: "_Agua_Viva_-_Clarice_Lispector.pdf" },
  { title: "The Passion According to G.H.", fileName: "_The_Passion_According_to_GH_-_Clarice_Lispector.pdf" },
  { title: "To Kill a Mockingbird", fileName: "_To_kill_a_mocking_bird_-_Haper_Lee.pdf" },
  { title: "A Farewell to Arms", fileName: "_A_Farewell_to_Arms_-_Ernest_Hemingway.pdf" },
  { title: "Lapvona", fileName: "_Lapvona_-_Ottessa_Moshfegh.pdf" },
  { title: "A Clockwork Orange", fileName: "_A_Clockwork_Orange_-_Anthony_Burgess.pdf" },
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

// Bookmark types
export interface Bookmark {
  page: number;
  label: string;
  timestamp: string;
}

// Annotation types
export interface Annotation {
  id: string;
  type: 'highlight' | 'note';
  page: number;
  content: string;
  color?: string;
  position?: { x: number; y: number };
  timestamp: string;
}

export function getBookmarks(title: string): Bookmark[] {
  try {
    const raw = localStorage.getItem(`library_bookmarks_${title}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveBookmarks(title: string, bookmarks: Bookmark[]) {
  localStorage.setItem(`library_bookmarks_${title}`, JSON.stringify(bookmarks));
}

export function getAnnotations(title: string): Annotation[] {
  try {
    const raw = localStorage.getItem(`library_annotations_${title}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveAnnotations(title: string, annotations: Annotation[]) {
  localStorage.setItem(`library_annotations_${title}`, JSON.stringify(annotations));
}
