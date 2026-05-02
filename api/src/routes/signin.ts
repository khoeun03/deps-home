import argon2 from 'argon2';
import type { FastifyInstance } from 'fastify';

import { db } from '../db/index.js';

const signinRoute = async (app: FastifyInstance) => {
  app.post<{
    Body: { username: string; password: string };
  }>('/signin', async (request, reply) => {
    const { username, password } = request.body;

    const identity = await db.query.identities.findFirst({
      where: (fields, { eq }) => eq(fields.handle, username),
    });
    if (!identity) return reply.status(401).send({ error: 'Invalid credentials' });

    const authMethod = await db.query.credentials.findFirst({
      where: (fields, { and, eq }) => and(eq(fields.identityId, identity.id), eq(fields.provider, 'password')),
    });
    if (!authMethod) return reply.status(401).send({ error: 'Invalid credentials' });

    const credential = authMethod.credential as { hash: string };
    const valid = await argon2.verify(credential.hash, password);
    if (!valid) return reply.status(401).send({ error: 'Invalid credentials' });

    request.session.identityId = identity.id;
    await request.session.save();
    return { success: true };
  });
};

export default signinRoute;
