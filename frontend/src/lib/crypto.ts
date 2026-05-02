import { getPublicKeyAsync, signAsync, utils } from '@noble/ed25519';
import { blake2b } from '@noble/hashes/blake2.js';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';
import canonicalize from 'canonicalize';

const toBase64UrlNoPad = (bytes: Uint8Array): string => {
  const binary = String.fromCodePoint(...bytes);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
};

const fromBase64UrlNoPad = (str: string): Uint8Array => {
  const base64 = str.replaceAll('-', '+').replaceAll('_', '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.codePointAt(i)!;
  }
  return bytes;
};

const hashAuthKey = async (authKey: Uint8Array): Promise<string> => {
  const { default: argon2 } = await import('argon2-wasm-esm');

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const result = await argon2.hash({
    pass: new Uint8Array(authKey),
    salt,
    type: argon2.ArgonType.argon2id,
    time: 2,
    mem: 65536,
    hashLen: 32,
    parallelism: 1,
  });

  return result.encoded;
};

async function createDepsSignature(secretKey: Uint8Array, data: Record<string, unknown>): Promise<string> {
  const jcsString = canonicalize(data);
  if (!jcsString) throw new Error('Failed to canonicalize data');
  const message = new TextEncoder().encode(jcsString);
  const hash = blake2b(message, { dkLen: 64 });

  const signature = await signAsync(hash, secretKey);
  return toBase64UrlNoPad(signature);
}

// KDF

type KdfParams = {
  algorithm: 'argon2id';
  salt: string;
  timeCost: number;
  memoryCost: number;
  parallelism: number;
};

type DerivedKeys = {
  encKey: Uint8Array;
  authKey: Uint8Array;
};

const deriveKeys = async (password: string, kdfParams: KdfParams): Promise<DerivedKeys> => {
  const { default: argon2 } = await import('argon2-wasm-esm');

  const salt = Uint8Array.from(atob(kdfParams.salt), (c) => c.codePointAt(0)!);

  const { hash: masterKey } = await argon2.hash({
    pass: password,
    salt,
    type: argon2.ArgonType.argon2id,
    time: kdfParams.timeCost,
    mem: kdfParams.memoryCost,
    hashLen: 32,
    parallelism: kdfParams.parallelism,
  });

  const enc = new TextEncoder();
  const encKey = hkdf(sha256, masterKey, undefined, enc.encode('eto-enc'), 32);
  const authKey = hkdf(sha256, masterKey, undefined, enc.encode('eto-auth'), 32);

  masterKey.fill(0);

  return { encKey, authKey };
};

const generateKdfParams = (): KdfParams => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return {
    algorithm: 'argon2id',
    salt: btoa(String.fromCodePoint(...salt)),
    timeCost: 3,
    memoryCost: 19456,
    parallelism: 1,
  };
};

// Ed25519

type KeyPair = {
  publicKey: string;
  secretKey: Uint8Array;
};

const generateKeyPair = async (): Promise<KeyPair> => {
  const secretKey = utils.randomSecretKey();
  const publicKeyBytes = await getPublicKeyAsync(secretKey);
  return {
    publicKey: toBase64UrlNoPad(publicKeyBytes),
    secretKey,
  };
};

// AES-256-GCM

type EncryptedBundle = {
  cipher: 'aes-256-gcm';
  nonce: string;
  ciphertext: string;
};

const encryptSecretKey = async (encKey: Uint8Array, secretKey: Uint8Array): Promise<EncryptedBundle> => {
  const aesKey = await crypto.subtle.importKey('raw', new Uint8Array(encKey), 'AES-GCM', false, ['encrypt']);
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, new Uint8Array(secretKey));

  return {
    cipher: 'aes-256-gcm',
    nonce: btoa(String.fromCodePoint(...nonce)),
    ciphertext: btoa(String.fromCodePoint(...new Uint8Array(ciphertext))),
  };
};

export type { DerivedKeys, EncryptedBundle, KdfParams, KeyPair };
export {
  createDepsSignature,
  deriveKeys,
  encryptSecretKey,
  fromBase64UrlNoPad,
  generateKdfParams,
  generateKeyPair,
  hashAuthKey,
  toBase64UrlNoPad,
};
