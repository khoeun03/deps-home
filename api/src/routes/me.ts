import type { FastifyInstance } from 'fastify';

import { db } from '../db/index.js';
import { requireAuth } from '../utils/auth.js';

const profileRoute = async (app: FastifyInstance) => {
  app.get('/me', { preHandler: requireAuth }, async (request, reply) => {
    const { identityId } = request.session;

    const identity = await db.query.identities.findFirst({
      columns: {
        signedidentity: true,
      },
      where: (fields, { eq }) => eq(fields.id, identityId!),
    });
    if (!identity) return reply.status(401);

    return identity.signedidentity;
  });
};

export default profileRoute;
