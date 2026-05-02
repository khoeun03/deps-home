import argon2 from 'argon2';
import type { FastifyInstance } from 'fastify';

import { db } from '../db/index.js';

const signinRoute = async (app: FastifyInstance) => {
  app.post<{
    Body: { handle: string; password: string };
  }>('/signin', async (request, reply) => {
    const { handle, password } = request.body;

    const identity = await db.query.identities.findFirst({
      where: (fields, { eq }) => eq(fields.handle, handle),
    });
    if (!identity) return reply.status(401).send({ error: 'Invalid credentials' });

    const credential = await db.query.credentials.findFirst({
      where: (fields, { eq }) => eq(fields.identityId, identity.id),
    });
    if (!credential) return reply.status(401).send({ error: 'Invalid credentials' });

    const authData = credential.authData as { hash: string };
    const valid = await argon2.verify(authData.hash, password);
    if (!valid) return reply.status(401).send({ error: 'Invalid credentials' });

    request.session.identityId = identity.id;
    await request.session.save();
    return { success: true };
  });
};

export default signinRoute;
