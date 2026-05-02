import argon2 from 'argon2';
import type { FastifyInstance } from 'fastify';

import { db } from '../db/index.js';
import { credentials, identities } from '../db/schema.js';
import { verifyDepsSignature } from '../utils/crypto.js';

const signupRoute = async (app: FastifyInstance) => {
  app.post<{
    Body: {
      handle: string;
      publicKey: string;
      authKeyHash: string;
      signedIdentity: {
        data: Record<string, unknown>;
        sign: string;
      };

      encryptedBundle: {
        cipher: string;
        nonce: string;
        ciphertext: string;
      };
      kdfParams: {
        algorithm: string;
        salt: string;
        timeCost: number;
        memoryCost: number;
        parallelism: number;
      };
    };
  }>(
    '/signup',
    {
      schema: {
        body: {
          type: 'object',
          required: ['handle', 'publicKey', 'authKeyHash', 'encryptedBundle', 'kdfParams'],
          properties: {
            handle: { type: 'string', pattern: '^[a-zA-Z0-9-]{2,18}$' },
            publicKey: { type: 'string', minLength: 43, maxLength: 43 },
            authKeyHash: { type: 'string', minLength: 64, maxLength: 64 },
            signedIdentity: {
              type: 'object',
              required: ['data', 'sign'],
              properties: {
                data: {
                  type: 'object',
                  required: ['nickname', 'signedAt', 'intent'],
                  properties: {
                    nickname: { type: 'string', minLength: 1, maxLength: 64 },
                    signedAt: { type: 'string' },
                    intent: { type: 'string', const: 'deps/identityInfo' },
                  },
                },

                sign: { type: 'string' },
              },
            },

            encryptedBundle: {
              type: 'object',
              required: ['cipher', 'nonce', 'ciphertext'],
              properties: {
                cipher: { type: 'string', enum: ['aes-256-gcm'] },
                nonce: { type: 'string' },
                ciphertext: { type: 'string' },
              },
            },
            kdfParams: {
              type: 'object',
              required: ['algorithm', 'salt', 'timeCost', 'memoryCost', 'parallelism'],
              properties: {
                algorithm: { type: 'string', enum: ['argon2id'] },
                salt: { type: 'string' },
                timeCost: { type: 'integer', minimum: 1 },
                memoryCost: { type: 'integer', minimum: 1024 },
                parallelism: { type: 'integer', minimum: 1 },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { handle, publicKey, authKeyHash, signedIdentity, encryptedBundle, kdfParams } = request.body;

      const isSignValid = await verifyDepsSignature(publicKey, signedIdentity.data, signedIdentity.sign);
      if (!isSignValid) {
        return reply.status(403).send({
          error: 'Invalid identity signature',
        });
      }

      const storedHash = await argon2.hash(authKeyHash, {
        type: argon2.argon2id,
      });

      const result = await db.transaction(async (tx) => {
        const existingHandle = await tx.query.identities.findFirst({
          where: (fields, { eq }) => eq(fields.handle, handle),
        });
        if (existingHandle) return { error: 'Duplicated handle' };

        const existingKey = await tx.query.identities.findFirst({
          where: (fields, { eq }) => eq(fields.publicKey, publicKey),
        });
        if (existingKey) return { error: 'Duplicated public key' };

        const [identity] = await tx
          .insert(identities)
          .values({
            publicKey,
            handle,
            signedIdentity,
          })
          .returning();

        await tx.insert(credentials).values({
          identityId: identity.id,
          credential: {
            authKeyHash: storedHash,
            encryptedBundle,
            kdfParams,
          },
        });

        return { identity };
      });

      if ('error' in result) return reply.status(422).send(result);

      return reply.status(201).send();
    },
  );
};

export default signupRoute;
