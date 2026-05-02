import { signAsync, verifyAsync } from '@noble/ed25519';
import { blake2b } from '@noble/hashes/blake2.js';
import canonicalize from 'canonicalize';

const fromBase64UrlNoPad = (str: string): Buffer => {
  return Buffer.from(str, 'base64url');
};

const toBase64UrlNoPad = (buf: Buffer): string => {
  return buf.toString('base64url').replace(/=+$/, '');
};

async function verifyDepsSignature(
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

    return await verifyAsync(signBytes, hash, pubKeyBytes);
  } catch {
    return false;
  }
}

async function createDepsSignature(secretKey: Uint8Array, data: Record<string, unknown>): Promise<string> {
  const jcsString = canonicalize(data);
  if (!jcsString) throw new Error('Failed to canonicalize data');
  const message = new TextEncoder().encode(jcsString);
  const hash = blake2b(message, { dkLen: 64 });

  const signature = await signAsync(hash, secretKey);
  return toBase64UrlNoPad(Buffer.from(signature));
}

export { createDepsSignature, fromBase64UrlNoPad, toBase64UrlNoPad, verifyDepsSignature };
