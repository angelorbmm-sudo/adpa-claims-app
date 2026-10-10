// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const claims = sqliteTable('claims', {
 id:text('id').primaryKey(),owner:text('owner').notNull(),name:text('name').notNull(),address:text('address').notNull(),state:text('state').notNull(),version:integer('version').notNull().default(1),created:text('created').notNull(),updated:text('updated').notNull(),
}, t=>[index('claims_owner_updated').on(t.owner,t.updated)]);
export const evidence=sqliteTable('evidence',{
 id:text('id').primaryKey(),claimId:text('claim_id').notNull().references(()=>claims.id),owner:text('owner').notNull(),filename:text('filename').notNull(),mime:text('mime').notNull(),size:integer('size').notNull(),category:text('category').notNull(),note:text('note').notNull(),sources:text('sources').notNull(),objectKey:text('object_key').notNull(),created:text('created').notNull(),
},t=>[index('idx_evidence_claim_owner').on(t.claimId,t.owner)]);
export const agreementTemplates=sqliteTable('agreement_templates',{
 id:text('id').primaryKey(),owner:text('owner').notNull(),title:text('title').notNull(),revision:text('revision').notNull(),kind:text('kind').notNull(),filename:text('filename').notNull(),mime:text('mime').notNull().default('application/pdf'),size:integer('size').notNull(),objectKey:text('object_key').notNull(),created:text('created').notNull(),
},t=>[index('agreement_templates_owner_created').on(t.owner,t.created)]);
export const preparationRuns=sqliteTable('preparation_runs',{
 id:text('id').primaryKey(),claimId:text('claim_id').notNull().references(()=>claims.id),owner:text('owner').notNull(),mode:text('mode').notNull(),status:text('status').notNull(),fingerprint:text('fingerprint').notNull(),snapshot:text('snapshot').notNull(),result:text('result').notNull().default('{}'),reviews:text('reviews').notNull().default('[]'),version:integer('version').notNull().default(1),created:text('created').notNull(),updated:text('updated').notNull(),error:text('error').notNull().default(''),
},t=>[index('preparation_claim_owner_created').on(t.claimId,t.owner,t.created)]);
export const claimPackages=sqliteTable('claim_packages',{
 id:text('id').primaryKey(),claimId:text('claim_id').notNull().references(()=>claims.id),owner:text('owner').notNull(),title:text('title').notNull(),created:text('created').notNull(),actor:text('actor').notNull(),fingerprint:text('fingerprint').notNull(),snapshot:text('snapshot').notNull(),
},t=>[index('packages_claim_owner_created').on(t.claimId,t.owner,t.created)]);
export const companies=sqliteTable('companies',{
 id:text('id').primaryKey(),owner:text('owner').notNull(),name:text('name').notNull(),state:text('state').notNull(),version:integer('version').notNull().default(1),created:text('created').notNull(),updated:text('updated').notNull(),
},t=>[index('companies_owner_updated').on(t.owner,t.updated)]);
