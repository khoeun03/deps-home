import type { FastifyInstance } from 'fastify';

import { db } from '../db/index.js';
import { requireAuth } from '../utils/auth.js';
import { fromBase64UrlNoPad } from '../utils/encoding.js';
import { signData } from '../utils/sign.js';

const profileRoute = async (app: FastifyInstance) => {
  app.get('/me', { preHandler: requireAuth }, async (request, reply) => {
    const { identityId } = request.session;

    const identity = await db.query.identities.findFirst({
      columns: {
        publicKey: true,
        privateKey: true,
        handle: true,
        bio: true,
        avatarUrl: true,
      },
      where: (fields, { eq }) => eq(fields.id, identityId!),
    });
    if (!identity) return reply.status(401);

    const data = {
      nickname: identity.handle,
      bio: identity.bio,
      avatarUrl: identity.avatarUrl,
      signedAt: new Date(),
    };

    return signData(data, fromBase64UrlNoPad(identity.privateKey), fromBase64UrlNoPad(identity.publicKey));
  });
};

export default profileRoute;
