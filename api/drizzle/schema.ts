import { pgTable, unique, uuid, text, varchar, timestamp, foreignKey, jsonb, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const identities = pgTable("identities", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	publicKey: text("public_key").notNull(),
	privateKey: text("private_key").notNull(),
	handle: varchar({ length: 18 }).notNull(),
	bio: text(),
	avatarUrl: text("avatar_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("identities_public_key_key").on(table.publicKey),
	unique("identities_handle_key").on(table.handle),
]);

export const authMethods = pgTable("auth_methods", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	identityId: uuid("identity_id").notNull(),
	provider: varchar({ length: 32 }).notNull(),
	credential: jsonb().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.identityId],
			foreignColumns: [identities.id],
			name: "auth_methods_identity_id_fkey"
		}).onDelete("cascade"),
	unique("auth_methods_identity_id_provider_key").on(table.identityId, table.provider),
]);

export const submissions = pgTable("submissions", {
	id: integer().primaryKey().notNull(),
	identityId: uuid("identity_id").notNull(),
	problemId: text("problem_id").notNull(),
	judgeUrl: text("judge_url").notNull(),
	format: text().notNull(),
	verdict: text(),
	timeMs: integer("time_ms"),
	memoryKb: integer("memory_kb"),
	submittedAt: timestamp("submitted_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	certificate: jsonb(),
}, (table) => [
	foreignKey({
			columns: [table.identityId],
			foreignColumns: [identities.id],
			name: "submissions_identity_id_fkey"
		}),
]);
