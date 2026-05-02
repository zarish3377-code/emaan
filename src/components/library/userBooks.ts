// IndexedDB-backed store for user-uploaded PDFs.
// PDFs persist across reloads. URLs are blob: URLs created on demand.

const DB_NAME = 'lil-library-user-books';
const DB_VERSION = 1;
const STORE = 'books';

export interface UserBookMeta {
  id: string;
  title: string;
  fileName: string;
  addedAt: string;
  size: number;
}

export interface UserBookRecord extends UserBookMeta {
  blob: Blob;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function listUserBooks(): Promise<UserBookMeta[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const all = (req.result as UserBookRecord[]) || [];
      resolve(
        all
          .map(({ id, title, fileName, addedAt, size }) => ({
            id, title, fileName, addedAt, size,
          }))
          .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1))
      );
    };
    req.onerror = () => reject(req.error);
  });
}

export async function addUserBook(file: File, title?: string): Promise<UserBookMeta> {
  const db = await openDB();
  const id = `ub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const cleanTitle =
    (title || file.name.replace(/\.pdf$/i, '')).trim() || 'Untitled';
  const record: UserBookRecord = {
    id,
    title: cleanTitle,
    fileName: file.name,
    addedAt: new Date().toISOString(),
    size: file.size,
    blob: file,
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  const { blob, ...meta } = record;
  return meta;
}

export async function getUserBookBlobUrl(id: string): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => {
      const rec = req.result as UserBookRecord | undefined;
      if (!rec) return resolve(null);
      resolve(URL.createObjectURL(rec.blob));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteUserBook(id: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
