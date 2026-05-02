import 'dotenv/config';

import type { FastifyInstance } from 'fastify';

import { db } from '../db/index.js';

const handleRoute = async (app: FastifyInstance) => {
  app.get<{
    Params: { handle: string };
  }>('/handle/:handle', async (request, reply) => {
    const { handle } = request.params;

    const match = new RegExp(/^@([a-zA-Z0-9-]{2,18})::(.+)$/).exec(handle);
    if (!match) return null;

    const [_, username, domain] = match;
    if (domain !== process.env.DEPS_HOME_DOMAIN) {
      return reply.code(404);
    }

    const identity = await db.query.identities.findFirst({
      columns: {
        signedIdentity: true,
      },
      where: (fields, { eq }) => eq(fields.handle, username),
    });
    if (!identity) return reply.status(404);

    return identity.signedIdentity;
  });
};

export default handleRoute;
