import type { FastifyInstance } from 'fastify';

import { toBase64UrlNoPad } from '../utils/encoding.js';

const infoRoute = async (app: FastifyInstance) => {
  app.get('/info', async () => {
    return { key: toBase64UrlNoPad(app.serverKey.publicKey) };
  });
};

export default infoRoute;
