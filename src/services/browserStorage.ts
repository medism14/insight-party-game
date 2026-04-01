const STORAGE_VERSION = 1;

interface StoredEnvelope<T> {
  version: number;
  savedAt: number;
  data: T;
}

function isEnvelope<T>(value: unknown): value is StoredEnvelope<T> {
  return typeof value === 'object' && value !== null && 'data' in value && 'version' in value;
}

export function readPersistentValue<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as unknown;

    if (isEnvelope<T>(parsed)) {
      return parsed.data;
    }

    // Legacy format support: older app versions stored raw JSON directly.
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writePersistentValue<T>(key: string, value: T): void {
  const payload: StoredEnvelope<T> = {
    version: STORAGE_VERSION,
    savedAt: Date.now(),
    data: value,
  };

  localStorage.setItem(key, JSON.stringify(payload));
}

export function readPersistentString(key: string): string | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (isEnvelope<string | null>(parsed)) {
      return parsed.data;
    }

    return typeof parsed === 'string' ? parsed : raw;
  } catch {
    return localStorage.getItem(key);
  }
}

export function writePersistentString(key: string, value: string): void {
  writePersistentValue(key, value);
}

export function removePersistentValue(key: string): void {
  localStorage.removeItem(key);
}
