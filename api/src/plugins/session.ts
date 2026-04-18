import cookie from '@fastify/cookie';
import session from '@fastify/session';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface Session {
    identityId?: string;
  }
}

export default fp(async (app) => {
  await app.register(cookie);
  await app.register(session, {
    secret: process.env.SESSION_SECRET!,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  });
});
