import argon2 from 'argon2';
import { generateKeyPairSync } from 'crypto';
import type { FastifyInstance } from 'fastify';

import { db } from '../db/index.js';
import { authMethods, identities } from '../db/schema.js';
import { toBase64UrlNoPad } from '../utils/encoding.js';

export default async (app: FastifyInstance) => {
  app.post<{
    Body: {
      username: string;
      password: string;
    };
  }>(
    '/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', pattern: '^[a-zA-Z0-9-]{2,18}$' },
            password: { type: 'string', minLength: 6, maxLength: 128 },
          },
        },
      },
    },
    async (request, reply) => {
      const { username, password } = request.body;

      const identity = await db.transaction(async (tx) => {
        const existingIdentity = await tx.query.identities.findFirst({
          where: (fields, { eq }) => eq(fields.handle, username),
        });
        if (existingIdentity) return null;

        const { privateKey, publicKey } = generateKeyPairSync('ed25519', {
          publicKeyEncoding: { type: 'spki', format: 'der' },
          privateKeyEncoding: { type: 'pkcs8', format: 'der' },
        });

        const [identity] = await tx
          .insert(identities)
          .values({
            publicKey: toBase64UrlNoPad(publicKey),
            privateKey: toBase64UrlNoPad(privateKey),
            handle: username,
          })
          .returning();

        const hashed = await argon2.hash(password);
        await tx.insert(authMethods).values({
          identityId: identity.id,
          provider: 'password',
          credential: { hash: hashed },
        });

        return identity;
      });

      if (!identity) {
        return reply.status(422).send({
          fields: {
            username: 'Duplicated username',
          },
        });
      }

      // TODO: Returns JWT Token
      return { success: true };
    },
  );
};
