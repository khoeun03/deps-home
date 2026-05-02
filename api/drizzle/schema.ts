import { pgTable, unique, uuid, text, varchar, jsonb, timestamp, foreignKey, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const identities = pgTable("identities", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	publicKey: text("public_key").notNull(),
	handle: varchar({ length: 18 }).notNull(),
	signedIdentity: jsonb("signed_identity").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("identities_public_key_key").on(table.publicKey),
	unique("identities_handle_key").on(table.handle),
]);

export const credentials = pgTable("credentials", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	identityId: uuid("identity_id").notNull(),
	authData: jsonb("auth_data").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.identityId],
			foreignColumns: [identities.id],
			name: "credentials_identity_id_fkey"
		}).onDelete("cascade"),
]);

export const submissions = pgTable("submissions", {
	id: text().primaryKey().notNull(),
	identityId: uuid("identity_id").notNull(),
	problemId: text("problem_id").notNull(),
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
