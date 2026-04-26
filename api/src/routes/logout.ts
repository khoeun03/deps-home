import type { FastifyInstance } from "fastify";
import { requireAuth } from "../utils/auth.js";

const logoutRoute = async (app: FastifyInstance) => {
  app.post('/logout', { preHandler: requireAuth }, async (request, reply) => {
    await request.session.destroy();
    return reply.status(204).send();
  })
};

export default logoutRoute;