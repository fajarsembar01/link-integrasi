const KEY_PINNED = "pns-links:pinned";
const KEY_PREFS  = "pns-links:prefs";
const KEY_DATA   = "pns-links:data";

export type Prefs = {
  compact: boolean;
};

export function getPinned(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY_PINNED) || "{}");
  } catch {
    return {};
  }
}

export function setPinned(map: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_PINNED, JSON.stringify(map));
}

export function isPinned(id: string) {
  return !!getPinned()[id];
}

export function togglePinned(id: string) {
  const map = getPinned();
  map[id] = !map[id];
  setPinned(map);
  return map[id];
}

export function getPrefs(): Prefs {
  if (typeof window === "undefined") return { compact: false };
  try {
    return JSON.parse(localStorage.getItem(KEY_PREFS) || "{\"compact\":false}");
  } catch {
    return { compact: false };
  }
}

export function setPrefs(p: Prefs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_PREFS, JSON.stringify(p));
}

/* ------------ Tambahan: persist daftar link ------------ */
export function getData<T>(fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(KEY_DATA);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setData<T>(data: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_DATA, JSON.stringify(data));
}
