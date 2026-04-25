import 'dotenv/config';

import cors from '@fastify/cors';
import Fastify from 'fastify';

import serverKeyPlugin from './plugins/server-key.js';
import sessionPlugin from './plugins/session.js';
import appRoutes from './routes/index.js';

const app = Fastify({ logger: true });
await app.register(cors, {
  origin: true,
  credentials: true,
});

await app.register(sessionPlugin);
await app.register(serverKeyPlugin);
await app.register(appRoutes);

await app.listen({ port: 3000, host: '0.0.0.0' });
