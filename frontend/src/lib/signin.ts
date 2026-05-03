import { decryptSecretKey, deriveEncKey, type EncryptedBundle, hashPassword, type KdfParams } from './crypto';
import { saveSession } from './session';

type LoginParams = {
  handle: string;
  password: string;
};

const API_URL = import.meta.env.VITE_API_URL!;

const performLogin = async ({ handle, password }: LoginParams) => {
  const passwordHash = await hashPassword(handle, password);

  const res = await fetch(`${API_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, passwordHash }),
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.reason ?? 'Login failed');
  }

  const {
    identity,
    handle: userHandle,
    kdfParams,
    encryptedBundle,
  } = (await res.json()) as {
    identity: string;
    handle: string;
    kdfParams: KdfParams;
    encryptedBundle: EncryptedBundle;
  };

  const encKey = await deriveEncKey(password, kdfParams);
  const secretKey = await decryptSecretKey(encKey, encryptedBundle);
  encKey.fill(0);

  const secretKeyBase64 = btoa(String.fromCodePoint(...secretKey));
  secretKey.fill(0);

  saveSession({
    identity,
    handle: userHandle,
    secretKey: secretKeyBase64,
  });
};

export type { LoginParams };
export { performLogin };
