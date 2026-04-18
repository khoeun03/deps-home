import { sql } from 'drizzle-orm';
import {
  check,
  doublePrecision,
  foreignKey,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const identities = pgTable(
  'identities',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    publicKey: text('public_key').notNull(),
    privateKey: text('private_key').notNull(),
    nickname: varchar({ length: 64 }).notNull(),
    bio: text(),
    avatarUrl: text('avatar_url'),
    handle: varchar({ length: 18 }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  },
  (table) => [
    unique('identities_public_key_key').on(table.publicKey),
    unique('identities_handle_key').on(table.handle),
  ],
);

export const authMethods = pgTable(
  'auth_methods',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    identityId: uuid('identity_id').notNull(),
    provider: varchar({ length: 32 }).notNull(),
    credential: jsonb().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.identityId],
      foreignColumns: [identities.id],
      name: 'auth_methods_identity_id_fkey',
    }).onDelete('cascade'),
    unique('auth_methods_identity_id_provider_key').on(table.identityId, table.provider),
  ],
);

export const solveCertificates = pgTable(
  'solve_certificates',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    identityId: uuid('identity_id').notNull(),
    serverDomain: varchar('server_domain', { length: 255 }).notNull(),
    serverKey: text('server_key').notNull(),
    problemId: varchar('problem_id', { length: 32 }).notNull(),
    score: doublePrecision().notNull(),
    signedAt: timestamp('signed_at', { withTimezone: true, mode: 'string' }).notNull(),
    rawCertificate: jsonb('raw_certificate').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.identityId],
      foreignColumns: [identities.id],
      name: 'solve_certificates_identity_id_fkey',
    }).onDelete('cascade'),
    unique('solve_certificates_identity_id_server_domain_problem_id_key').on(
      table.identityId,
      table.serverDomain,
      table.problemId,
    ),
    check('solve_certificates_score_check', sql`(score >= (0)::double precision) AND (score <= (1)::double precision)`),
  ],
);
