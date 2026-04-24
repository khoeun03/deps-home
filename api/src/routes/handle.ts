import 'dotenv/config';

import type { FastifyInstance } from 'fastify';

import { db } from '../db/index.js';
import { fromBase64UrlNoPad } from '../utils/encoding.js';
import { signData } from '../utils/sign.js';

export default async (app: FastifyInstance) => {
  app.get<{
    Params: { handle: string };
  }>('/handle/:handle', async (request, reply) => {
    const { handle } = request.params;

    const match = handle.match(/^@([a-zA-Z0-9-]{2,18})::(.+)$/);
    if (!match) return null;

    const [_, username, domain] = match;
    if (domain !== process.env.DEPS_HOME_DOMAIN) {
      return reply.code(404);
    }

    const identity = await db.query.identities.findFirst({
      columns: {
        publicKey: true,
        privateKey: true,
        handle: true,
        bio: true,
        avatarUrl: true,
      },
      where: (fields, { eq }) => eq(fields.handle, username),
    });
    if (!identity) return reply.status(404);

    const data = {
      nickname: identity.handle,
      bio: identity.bio,
      avatarUrl: identity.avatarUrl,
      signedAt: new Date(),
    };

    return signData(data, fromBase64UrlNoPad(identity.privateKey), fromBase64UrlNoPad(identity.publicKey));
  });
};
