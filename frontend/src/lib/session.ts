const SECRET_KEY_STORAGE_KEY = 'eto:secretKey';
const IDENTITY_STORAGE_KEY = 'eto:identity';
const HANDLE_STORAGE_KEY = 'eto:handle';

export interface Session {
  identity: string;
  handle: string | null;
  secretKey: string;
}

export function saveSession(session: Session): void {
  sessionStorage.setItem(SECRET_KEY_STORAGE_KEY, session.secretKey);
  sessionStorage.setItem(IDENTITY_STORAGE_KEY, session.identity);
  if (session.handle) {
    sessionStorage.setItem(HANDLE_STORAGE_KEY, session.handle);
  }
}

export function loadSession(): Session | null {
  const secretKey = sessionStorage.getItem(SECRET_KEY_STORAGE_KEY);
  const identity = sessionStorage.getItem(IDENTITY_STORAGE_KEY);

  if (!secretKey || !identity) return null;

  return {
    identity,
    handle: sessionStorage.getItem(HANDLE_STORAGE_KEY),
    secretKey,
  };
}

export function clearSession(): void {
  sessionStorage.removeItem(SECRET_KEY_STORAGE_KEY);
  sessionStorage.removeItem(IDENTITY_STORAGE_KEY);
  sessionStorage.removeItem(HANDLE_STORAGE_KEY);
}
