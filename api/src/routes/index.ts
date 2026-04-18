import type { FastifyInstance } from 'fastify';

import handleRoute from './handle.js';
import identityRoute from './identity.js';
import infoRoute from './info.js';
import registerRoute from './register.js';

export default async (app: FastifyInstance) => {
  app.register(infoRoute, { prefix: '/_deps/home' });
  app.register(identityRoute, { prefix: '/_deps/home' });
  app.register(handleRoute, { prefix: '/_deps/home' });

  app.register(registerRoute);
};
