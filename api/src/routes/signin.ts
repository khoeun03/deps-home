import argon2 from 'argon2';
import type { FastifyInstance } from 'fastify';

import { db } from '../db/index.js';

const signinRoute = async (app: FastifyInstance) => {
  app.post<{
    Body: { handle: string; passwordHash: string };
  }>(
    '/signin',
    {
      schema: {
        body: {
          type: 'object',
          required: ['handle', 'passwordHash'],
          properties: {
            handle: { type: 'string', pattern: '^[a-zA-Z0-9-]{2,18}$' },
            passwordHash: { type: 'string', pattern: String.raw`^\$argon2id\$` },
          },
        },
      },
    },
    async (request, reply) => {
      const { handle, passwordHash } = request.body;

      const identity = await db.query.identities.findFirst({
        where: (fields, { eq }) => eq(fields.handle, handle),
        with: { credentials: true },
      });
      if (!identity) return reply.status(401).send({ error: 'Invalid credentials' });

      const [credential] = identity.credentials;
      const authData = credential.authData as {
        passwordHash: string;
        encryptedBundle: Record<string, unknown>;
        kdfParams: Record<string, unknown>;
      };

      const valid = await argon2.verify(authData.passwordHash, passwordHash);
      if (!valid) return reply.status(401).send({ error: 'Invalid handle or password' });

      request.session.identityId = identity.id;
      await request.session.save();
      return {
        identity: `::${identity.publicKey}`,
        handle: identity.handle,
        kdfParams: authData.kdfParams,
        encryptedBundle: authData.encryptedBundle,
      };
    },
  );
};

export default signinRoute;
