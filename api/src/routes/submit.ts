import type { FastifyInstance } from 'fastify';

import { db } from '../db/index.js';
import { submissions } from '../db/schema.js';
import type { SubmitResponse } from '../types/deps.js';
import { requireAuth } from '../utils/auth.js';
import { fromBase64UrlNoPad } from '../utils/encoding.js';
import { signData } from '../utils/sign.js';
import { normalizeUrl } from '../utils/url.js';

const submitRoute = async (app: FastifyInstance) => {
  app.post<{
    Body: {
      problemId: string;
      format: string;
      files: Record<string, { language: string; content: string }>;
    };
  }>('/submit', { preHandler: requireAuth }, async (request, reply) => {
    const { identityId } = request.session;

    const identity = await db.query.identities.findFirst({
      columns: {
        id: true,
        publicKey: true,
        privateKey: true,
      },
      where: (fields, { eq }) => eq(fields.id, identityId!),
    });
    if (!identity) return reply.status(401);

    const { problemId, format, files } = request.body;
    const judgeUrl = normalizeUrl(problemId.split('::').at(-1) ?? '');

    const data = {
      format,
      files,
      signedAt: new Date(),
      intent: 'deps/problemSubmit',
    };
    const signed = signData(data, fromBase64UrlNoPad(identity.privateKey), fromBase64UrlNoPad(identity.publicKey));

    const res = await fetch(`${judgeUrl}/_deps/judge/problems/${problemId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signed),
    });

    console.log(res);

    const body = await res.json();

    if (res.ok) {
      await db.insert(submissions).values({
        id: (body as SubmitResponse).submissionId,
        identityId: identity.id,
        problemId,
        format,
        submittedAt: new Date(),
      });
    }

    return reply.status(res.status).send(body);
  });
};

export default submitRoute;
