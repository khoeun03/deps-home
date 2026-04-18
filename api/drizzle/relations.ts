import { relations } from "drizzle-orm/relations";
import { identities, authMethods, solveCertificates } from "./schema";

export const authMethodsRelations = relations(authMethods, ({one}) => ({
	identity: one(identities, {
		fields: [authMethods.identityId],
		references: [identities.id]
	}),
}));

export const identitiesRelations = relations(identities, ({many}) => ({
	authMethods: many(authMethods),
	solveCertificates: many(solveCertificates),
}));

export const solveCertificatesRelations = relations(solveCertificates, ({one}) => ({
	identity: one(identities, {
		fields: [solveCertificates.identityId],
		references: [identities.id]
	}),
}));