import {
  createDepsSignature,
  deriveKeys,
  encryptSecretKey,
  generateKdfParams,
  generateKeyPair,
  hashAuthKey,
} from './crypto';

type SignUpParams = {
  handle: string;
  password: string;
};

type SignUpPayload = {
  handle: string;
  publicKey: string;
  authKeyHash: string;
  signedIdentity: {
    data: Record<string, unknown>;
    sign: string;
  };
  encryptedBundle: {
    cipher: 'aes-256-gcm';
    nonce: string;
    ciphertext: string;
  };
  kdfParams: {
    algorithm: 'argon2id';
    salt: string;
    timeCost: number;
    memoryCost: number;
    parallelism: number;
  };
};

const prepareSignUp = async ({ handle, password }: SignUpParams): Promise<SignUpPayload> => {
  const { publicKey, secretKey } = await generateKeyPair();

  const kdfParams = generateKdfParams();
  const { encKey, authKey } = await deriveKeys(password, kdfParams);

  const encryptedBundle = await encryptSecretKey(encKey, secretKey);

  const identityData: Record<string, unknown> = {
    nickname: handle,
    signedAt: new Date().toISOString(),
    intent: 'deps/identityInfo',
  };
  const signature = await createDepsSignature(secretKey, identityData);

  const authKeyHash = await hashAuthKey(authKey);

  secretKey.fill(0);
  encKey.fill(0);
  authKey.fill(0);

  return {
    handle,
    publicKey,
    authKeyHash,
    signedIdentity: {
      data: identityData,
      sign: signature,
    },
    encryptedBundle,
    kdfParams,
  };
};

export type { SignUpParams, SignUpPayload };
export { prepareSignUp };
