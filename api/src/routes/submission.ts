import { and, eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';

import { db } from '../db/index.js';
import { submissions } from '../db/schema.js';
import { requireAuth } from '../utils/auth.js';
import { normalizeUrl } from '../utils/url.js';

const submissionRoute = async (app: FastifyInstance) => {
  app.get<{
    Querystring: {
      problemId?: string;
      identity?: string;
      offset?: number;
      limit?: number;
    };
  }>(
    '/submissions',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            problemId: { type: 'string' },
            identity: { type: 'string', pattern: '^::[a-zA-Z0-9_-]{43}$' },
            offset: { type: 'integer', minimum: 0, default: 0 },
            limit: { type: 'integer', minimum: 1, maximum: 100, default: 100 },
          },
        },
      },
    },
    async (request, reply) => {
      const { problemId, identity: identifier, offset, limit } = request.query;

      const publicKey = identifier?.slice(2);
      const identity =
        publicKey &&
        (await db.query.identities.findFirst({
          columns: {
            id: true,
          },
          where: (fields, { eq }) => eq(fields.publicKey, publicKey),
        }));
      if (identifier && !identity) return reply.status(404);

      const conditions = [];
      if (problemId) conditions.push(eq(submissions.problemId, problemId));
      if (identity) conditions.push(eq(submissions.identityId, identity.id));

      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const data = await db.query.submissions.findMany({
        where,
        offset,
        limit,
        orderBy: (fields, { desc }) => desc(fields.submittedAt),
      });
      const totalCount = await db.$count(submissions, where);

      return {
        data,
        totalCount,
      };
    },
  );

  app.post<{
    Params: { submissionId: string };
  }>('/submissions/:submissionId/refresh', { preHandler: requireAuth }, async (request, reply) => {
    const { submissionId } = request.params;

    const submission = await db.query.submissions.findFirst({
      where: (fields, { eq }) => eq(fields.id, submissionId),
    });
    if (!submission) return reply.status(404).send();
    if (submission.identityId !== request.session.identityId) return reply.status(403).send();

    // TODO: Make extraction of judgeUrl to util
    const judgeUrl = normalizeUrl(submission.problemId.split('::').at(-1) ?? '');
    const res = await fetch(`${judgeUrl}/_deps/judge/submissions/${submissionId}`);
    if (!res.ok) return reply.status(502).send();

    const result = (await res.json()) as {
      verdict?: string;
    };

    console.log(result);

    await db.update(submissions).set({
      verdict: result.verdict,
    });

    return reply.status(204).send();
  });
};

export default submissionRoute;
