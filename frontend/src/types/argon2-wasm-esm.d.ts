declare module 'argon2-wasm-esm' {
  enum ArgonType {
    argon2d = 0,
    argon2i = 1,
    argon2id = 2,
  }

  interface HashResult {
    hash: Uint8Array;
    hashHex: string;
    encoded: string;
  }

  interface HashOptions {
    pass: string | Uint8Array;
    salt: string | Uint8Array;
    time?: number;
    mem?: number;
    hashLen?: number;
    parallelism?: number;
    type?: ArgonType;
    distPath?: string;
    secret?: Uint8Array;
    ad?: Uint8Array;
  }

  interface VerifyOptions {
    pass: string | Uint8Array;
    encoded: string;
    secret?: Uint8Array;
    ad?: Uint8Array;
    type?: ArgonType;
  }

  interface Argon2 {
    ArgonType: typeof ArgonType;
    hash(options: HashOptions): Promise<HashResult>;
    verify(options: VerifyOptions): Promise<void>;
  }

  const argon2: Argon2;
  export default argon2;
}
