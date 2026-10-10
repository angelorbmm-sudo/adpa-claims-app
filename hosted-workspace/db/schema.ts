// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
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
export const companyClients=sqliteTable('company_clients',{
 id:text('id').primaryKey(),companyId:text('company_id').notNull().references(()=>companies.id),state:text('state').notNull(),version:integer('version').notNull().default(1),created:text('created').notNull(),updated:text('updated').notNull(),
},t=>[index('company_clients_company_updated').on(t.companyId,t.updated)]);
export const companyAssets=sqliteTable('company_assets',{
 id:text('id').primaryKey(),companyId:text('company_id').notNull().references(()=>companies.id),clientId:text('client_id'),kind:text('kind').notNull(),title:text('title').notNull(),revision:text('revision').notNull(),filename:text('filename').notNull(),mime:text('mime').notNull(),size:integer('size').notNull(),objectKey:text('object_key').notNull(),digest:text('digest').notNull(),created:text('created').notNull(),
},t=>[index('company_assets_company_created').on(t.companyId,t.created)]);
export const sharedJobs=sqliteTable('shared_jobs',{
 id:text('id').primaryKey(),creatorCompanyId:text('creator_company_id').notNull().references(()=>companies.id),originClientId:text('origin_client_id').notNull().references(()=>companyClients.id),homeownerEmail:text('homeowner_email').notNull(),name:text('name').notNull(),address:text('address').notNull(),state:text('state').notNull(),version:integer('version').notNull().default(1),created:text('created').notNull(),updated:text('updated').notNull(),
},t=>[index('shared_jobs_homeowner_updated').on(t.homeownerEmail,t.updated),uniqueIndex('shared_jobs_origin_client').on(t.creatorCompanyId,t.originClientId)]);
export const sharedJobCompanies=sqliteTable('shared_job_companies',{
 id:text('id').primaryKey(),jobId:text('job_id').notNull().references(()=>sharedJobs.id),companyId:text('company_id').notNull().references(()=>companies.id),
},t=>[index('shared_job_companies_company_job').on(t.companyId,t.jobId)]);
export const companyMarketing=sqliteTable('company_marketing',{
 companyId:text('company_id').primaryKey().references(()=>companies.id),state:text('state').notNull(),version:integer('version').notNull().default(1),updated:text('updated').notNull(),
});
export const marketingInquiries=sqliteTable('marketing_inquiries',{
 id:text('id').primaryKey(),companyId:text('company_id').notNull().references(()=>companies.id),actorId:text('actor_id').notNull(),state:text('state').notNull(),version:integer('version').notNull().default(1),created:text('created').notNull(),updated:text('updated').notNull(),
},t=>[index('marketing_inquiries_company_created').on(t.companyId,t.created),index('marketing_inquiries_actor_created').on(t.actorId,t.created)]);
