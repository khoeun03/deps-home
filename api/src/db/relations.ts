import { relations } from 'drizzle-orm/relations';

import { authMethods, identities, submissions } from './schema.js';

export const authMethodsRelations = relations(authMethods, ({ one }) => ({
  identity: one(identities, {
    fields: [authMethods.identityId],
    references: [identities.id],
  }),
}));

export const identitiesRelations = relations(identities, ({ many }) => ({
  authMethods: many(authMethods),
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  identity: one(identities, {
    fields: [submissions.identityId],
    references: [identities.id],
  }),
}));
