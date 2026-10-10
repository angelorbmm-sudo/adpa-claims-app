# ADPA company industry and service onboarding

Implemented `/company-setup`, linked from company dashboards, client intake, shared jobs and marketing. Existing Site audience remains owner-private.

## User flow

1. Register a company or select an existing accepted manager / ADPA-managed company.
2. Select any of the 16 industries and mark one of the selected industries as the main industry. Select multiple services from the 30-item catalogue, including services from other industries. Up to 10 additional service descriptions are allowed.
3. Confirm authority to register and accuracy. New registration saves the classification in the same company insert; existing manager updates use company-version guards and an audit entry.
4. Open the recommended tools and follow the setup sequence: client intake / contract, shared job / homeowner consent, evidence, marketing.
5. Return later to edit services. Changing the main industry does not discard selected services.

Registration, membership acceptance, archive status, claim assignments, evidence permissions and signature-provider setup retain their existing controls. Selected services are self-reported business information, not verified qualifications or permission to work outside a license.

## Source of truth

`lib/company-onboarding.ts` owns industry labels, stable service IDs, validation, recommendations and marketing category mapping. Company JSON contains `onboarding: {primaryIndustry, industries, serviceIds, otherServices, confirmedAt, confirmedBy}`. Existing companies fall back to their previous service category and show setup as unconfirmed until explicitly saved. No database migration is needed.

Registration endpoint remains `/api/shared-jobs` with optional `classification`; old clients retain compatibility. New setup updates use `/api/company-setup`. Accepted managers and ADPA owner may edit; technicians, foreign managers, unaccepted/revoked members and archived companies cannot.

The directory now displays the main industry alongside the existing business name/category. Service lists, staff, clients, license evidence and contact details are not added to its projection. Listing still requires explicit company consent.

## Marketing integration

New marketing drafts seed service names and map the primary industry to one of the existing six trade-template families. Existing marketing profiles and published snapshots are not overwritten. An explicit “Use my industry & selected services” button copies suggestions into an editable draft. Marketing pages currently allow 12 services; the UI states that only the first 12 are copied. All profile review and publication checks remain required. Specialized trade templates for plumbing, HVAC, electrical, environmental testing and other new industries remain a future expansion; these currently use the general restoration family.

## Dashboard limits

Common tools work for every industry: client intake, contracts, documents, communications preparation, shared jobs and marketing. Specialist mitigation / contents dashboards retain their existing assignment models. Mixed-service companies receive coordination recommendations through shared jobs when their legacy company category is incompatible with the specialist dashboard. A classification update does not reinterpret existing company-job scope records or automatically reconfigure specialist assignments. Supporting both specialist scope types for the same company/claim requires a separate job-assignment design; do not change a company's legacy serviceType just to unlock a dashboard.

Deep links preserve selected company context in the relevant workspaces. Recommendations are guidance, not access grants. External email, SMS, e-signing, public page hosting and social publication still require the integrations described in the other handoff guides.

## Validation

Automated coverage includes legacy fallbacks, multiple-service persistence, recommendation routing, marketing seeding, no membership/access changes, strict classification inputs, foreign/unaccepted/revoked/technician denial, stale company versions, rejected foreign origins and atomic classified registration. Existing directory tests were updated for the added industry field while retaining the private-data projection assertions. Browser/mobile visual QA and real multi-account testing remain for activation; no browser verification is claimed.

## Multiple-industry update
Companies can select multiple industries, keep one selected industry as the main industry, and retain their independent service selections. The main industry cannot be unchecked until another selected industry is made main. Server validation rejects empty, duplicate, unknown or main-excluding industry lists. Older single-industry requests default to a one-element list; older stored records receive the same fallback on read without a write. Recommendations consider all selected industries and services. Marketing template family still follows the main industry; published marketing and specialist assignment permissions remain separately controlled. Directory projection remains business name and main category only.
