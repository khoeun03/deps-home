import type { FastifyReply, FastifyRequest } from 'fastify';

const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.session.identityId) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
};

export { requireAuth };
