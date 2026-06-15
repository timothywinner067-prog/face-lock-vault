// Frontend-only "vault" persistence layer using localStorage.
// DEMO ONLY — no real cryptography or biometric verification.

export type User = {
  name: string;
  pin: string;
  faceImage: string; // dataURL (reference shot)
  faceHash: string;  // perceptual hash of the reference face
  createdAt: number;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

export type Credential = {
  id: string;
  website: string;
  username: string;
  password: string;
  updatedAt: number;
};

export type SecureRecord = {
  id: string;
  name: string;
  description: string;
  data: string;
  updatedAt: number;
};

export type DocumentItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  uploadedAt: number;
};

export type Activity = {
  id: string;
  action: string;
  at: number;
};

const K = {
  user: "fv.user",
  session: "fv.session",
  notes: "fv.notes",
  creds: "fv.credentials",
  records: "fv.records",
  docs: "fv.documents",
  activity: "fv.activity",
};

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const vault = {
  // ---- user/session
  getUser: (): User | null => read<User | null>(K.user, null),
  setUser: (u: User) => write(K.user, u),
  clearUser: () => isBrowser() && localStorage.removeItem(K.user),

  isAuthed: () => isBrowser() && sessionStorage.getItem(K.session) === "1",
  signIn: () => isBrowser() && sessionStorage.setItem(K.session, "1"),
  signOut: () => isBrowser() && sessionStorage.removeItem(K.session),

  // ---- generic collections
  getNotes: () => read<Note[]>(K.notes, []),
  setNotes: (n: Note[]) => write(K.notes, n),
  getCreds: () => read<Credential[]>(K.creds, []),
  setCreds: (c: Credential[]) => write(K.creds, c),
  getRecords: () => read<SecureRecord[]>(K.records, []),
  setRecords: (r: SecureRecord[]) => write(K.records, r),
  getDocs: () => read<DocumentItem[]>(K.docs, []),
  setDocs: (d: DocumentItem[]) => write(K.docs, d),

  // ---- activity log
  getActivity: () => read<Activity[]>(K.activity, []),
  log: (action: string) => {
    const prev = read<Activity[]>(K.activity, []);
    const next = [{ id: crypto.randomUUID(), action, at: Date.now() }, ...prev].slice(0, 50);
    write(K.activity, next);
  },

  // ---- danger zone
  clearAll: () => {
    if (!isBrowser()) return;
    Object.values(K).forEach((k) => localStorage.removeItem(k));
    sessionStorage.removeItem(K.session);
  },
};

export function uid() {
  return (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)) as string;
}
