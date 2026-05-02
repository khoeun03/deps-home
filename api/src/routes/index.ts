import type { FastifyInstance } from 'fastify';

import handleRoute from './handle.js';
import identityRoute from './identity.js';
import infoRoute from './info.js';
import logoutRoute from './logout.js';
import profileRoute from './me.js';
import signinRoute from './signin.js';
// import signupRoute from './signup.js';

const appRoutes = async (app: FastifyInstance) => {
  app.register(infoRoute, { prefix: '/_deps/home' });
  app.register(identityRoute, { prefix: '/_deps/home' });
  app.register(handleRoute, { prefix: '/_deps/home' });

  app.register(signinRoute);
  // app.register(signupRoute);
  app.register(logoutRoute);

  app.register(profileRoute);
};

export default appRoutes;
