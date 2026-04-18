import type { FastifyInstance } from 'fastify';

import { db } from '../db/index.js';
import { fromBase64UrlNoPad } from '../utils/encoding.js';
import { signData } from '../utils/sign.js';

export default async (app: FastifyInstance) => {
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
          publicKey: true,
          privateKey: true,
          handle: true,
          bio: true,
          avatarUrl: true,
        },
        where: (fields, { eq }) => eq(fields.publicKey, publicKey),
      });
      if (!identity) return reply.status(404);

      const data = {
        nickname: identity.handle,
        bio: identity.bio,
        avatarUrl: identity.avatarUrl,
        signedAt: new Date(),
      };

      return signData(data, fromBase64UrlNoPad(identity.privateKey), fromBase64UrlNoPad(identity.publicKey));
    },
  );
};
