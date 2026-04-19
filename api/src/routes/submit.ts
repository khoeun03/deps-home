import type { FastifyInstance } from 'fastify';

import { db } from '../db/index.js';
import { requireAuth } from '../utils/auth.js';
import { fromBase64UrlNoPad } from '../utils/encoding.js';
import { signData } from '../utils/sign.js';

export default async (app: FastifyInstance) => {
  app.post<{
    Body: {
      endpoint: string;
      language: string;
      code: string;
    };
  }>('/submit', { preHandler: requireAuth }, async (request, reply) => {
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

    const { endpoint, language, code } = request.body;

    const data = {
      files: [
        {
          language,
          content: code,
        },
      ],
      signedAt: new Date(),
    };
    const signed = signData(data, fromBase64UrlNoPad(identity.privateKey), fromBase64UrlNoPad(identity.publicKey));

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signed),
    });

    return reply.status(res.status).send(res.body);
  });
};
