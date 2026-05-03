import { getPublicKeyAsync, signAsync, utils } from '@noble/ed25519';
import { blake2b } from '@noble/hashes/blake2.js';
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

async function createDepsSignature(secretKey: Uint8Array, data: Record<string, unknown>): Promise<string> {
  const jcsString = canonicalize(data);
  if (!jcsString) throw new Error('Failed to canonicalize data');
  const message = new TextEncoder().encode(jcsString);
  const hash = blake2b(message, { dkLen: 64 });

  const signature = await signAsync(hash, secretKey);
  return toBase64UrlNoPad(signature);
}

const deriveAuthSalt = (handle: string): Uint8Array => {
  const normalized = handle.toLowerCase();
  return sha256(new TextEncoder().encode(`eto:auth:${normalized}`)).slice(0, 16);
};

const hashPassword = async (handle: string, password: string): Promise<string> => {
  const { default: argon2 } = await import('argon2-wasm-esm');

  const salt = deriveAuthSalt(handle);
  const result = await argon2.hash({
    pass: password,
    salt,
    type: 2, // Argon2id
    time: 2,
    mem: 65536,
    hashLen: 32,
    parallelism: 1,
  });

  return result.encoded;
};

// KDF

type KdfParams = {
  algorithm: 'argon2id';
  salt: string;
  timeCost: number;
  memoryCost: number;
  parallelism: number;
};

const deriveEncKey = async (password: string, kdfParams: KdfParams): Promise<Uint8Array> => {
  const { default: argon2 } = await import('argon2-wasm-esm');

  const salt = Uint8Array.from(atob(kdfParams.salt), (c) => c.codePointAt(0)!);

  const { hash: encKey } = await argon2.hash({
    pass: password,
    salt,
    type: argon2.ArgonType.argon2id,
    time: kdfParams.timeCost,
    mem: kdfParams.memoryCost,
    hashLen: 32,
    parallelism: kdfParams.parallelism,
  });

  return encKey;
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

const decryptSecretKey = async (encKey: Uint8Array, bundle: EncryptedBundle): Promise<Uint8Array> => {
  const aesKey = await crypto.subtle.importKey('raw', new Uint8Array(encKey), 'AES-GCM', false, ['decrypt']);
  const nonce = Uint8Array.from(atob(bundle.nonce), (c) => c.charCodeAt(0));
  const ciphertext = Uint8Array.from(atob(bundle.ciphertext), (c) => c.charCodeAt(0));
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, aesKey, new Uint8Array(ciphertext));
  return new Uint8Array(plaintext);
};

export type { EncryptedBundle, KdfParams, KeyPair };
export {
  createDepsSignature,
  decryptSecretKey,
  deriveEncKey,
  encryptSecretKey,
  fromBase64UrlNoPad,
  generateKdfParams,
  generateKeyPair,
  hashPassword,
  toBase64UrlNoPad,
};
