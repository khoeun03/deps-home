import type { FastifyInstance } from 'fastify';

import { db } from '../db/index.js';

const identityRoute = async (app: FastifyInstance) => {
  app.get<{
    Params: { identity: string };
  }>(
    '/identity/:identity',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            identity: { type: 'string', pattern: '^::[a-zA-Z0-9_-]{43}$' },
          },
        },
      },
    },
    async (request, reply) => {
      const { identity: identifier } = request.params;
      const publicKey = identifier.slice(2);

      const identity = await db.query.identities.findFirst({
        columns: {
          signedIdentity: true,
        },
        where: (fields, { eq }) => eq(fields.publicKey, publicKey),
      });
      if (!identity) return reply.status(404);

      return identity.signedIdentity;
    },
  );
};

export default identityRoute;
