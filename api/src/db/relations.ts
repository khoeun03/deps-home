import { relations } from 'drizzle-orm/relations';

import { credentials, identities, submissions } from './schema.js';

export const credentialsRelations = relations(credentials, ({ one }) => ({
  identity: one(identities, {
    fields: [credentials.identityId],
    references: [identities.id],
  }),
}));

export const identitiesRelations = relations(identities, ({ many }) => ({
  credentials: many(credentials),
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  identity: one(identities, {
    fields: [submissions.identityId],
    references: [identities.id],
  }),
}));
