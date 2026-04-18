import type { FastifyInstance } from 'fastify';

import infoRoute from './info.js';
import registerRoute from './register.js';

export default async (app: FastifyInstance) => {
  app.register(infoRoute, { prefix: '/_deps/home' });

  app.register(registerRoute);
};
