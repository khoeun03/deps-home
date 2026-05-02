import { sign, verify } from '@noble/ed25519';
import { blake2b } from '@noble/hashes/blake2.js';
import canonicalize from 'canonicalize';

import { fromBase64UrlNoPad, toBase64UrlNoPad } from './encoding.js';

export async function verifyDepsSignature(
  publicKey: string,
  data: Record<string, unknown>,
  signature: string,
): Promise<boolean> {
  try {
    const pubKeyBytes = fromBase64UrlNoPad(publicKey);
    const signBytes = fromBase64UrlNoPad(signature);

    const jcsString = canonicalize(data);
    if (!jcsString) return false;
    const message = new TextEncoder().encode(jcsString);
    const hash = blake2b(message, { dkLen: 64 });

    return verify(signBytes, hash, pubKeyBytes);
  } catch {
    return false;
  }
}

export async function createDepsSignature(secretKey: Uint8Array, data: Record<string, unknown>): Promise<string> {
  const jcsString = canonicalize(data);
  if (!jcsString) throw new Error('Failed to canonicalize data');
  const message = new TextEncoder().encode(jcsString);
  const hash = blake2b(message, { dkLen: 64 });

  const signature = sign(hash, secretKey);
  return toBase64UrlNoPad(Buffer.from(signature));
}
