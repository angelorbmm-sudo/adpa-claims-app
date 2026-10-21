# ADPA Claims Workspace

Private working repository for the ADPA digital claims-processing application.

## Recovery status

This repository was reconstructed from the saved ADPA Claims Workspace build records after GitHub access was restored on October 5, 2026. It is a clean recovery scaffold and **not represented as a byte-for-byte export of the prior ChatGPT Site source**.

The recovered app implements the working ADPA workflow foundations documented in the project records:

- Claim intake and saved claims
- Claims dashboard
- Documents and evidence with drag-and-drop
- Contents review
- Coverage A / B / C / D plus Ordinance or Law / Code Upgrade
- Policy valuation review (RCV / ACV / mixed / actual-loss-sustained)
- Communications and follow-ups
- Supplements and disputes
- Mortgage loss-draft tracking
- Agreement / packet records
- Receipts and recoverable depreciation
- Claim-package assembly snapshots
- Operational, licensed-PA, and client approval records
- In-person witnessed-signature record
- Recovery follow-up and depreciation tracking
- AI-preparation status and integration placeholders

## Safety / production controls

This recovered build is a private working application, not a production autonomous public adjuster.

- No carrier communications are sent automatically.
- No settlement or compromise is authorized automatically.
- AI outputs must remain source-linked and human reviewed.
- Licensed public-adjuster approval is separate from operational review.
- Client authorization is a separate approval record.
- No API keys or secrets belong in this repository.
- DocuSign, OpenAI, email, identity verification, and provider callbacks remain server-side integration work.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Next integration work for José

1. Confirm the supported authentication / identity architecture.
2. Connect secure server-side OpenAI API usage.
3. Connect DocuSign envelope creation, status validation, completed documents, and audit certificates.
4. Connect email ingestion / approved delivery.
5. Add persistent production database and object storage.
6. Validate access control, backup / restore, audit retention, and release gates.

## HomeBack and ADPA service provider resources

See the [service provider resource guide](docs/service-providers/README.md) for the complete 22-page PDF covering 11 provider roles, LifeWorth integration, processes, required records, handoffs, and proposed development requirements. This is a workflow specification; implementation status must be assessed separately.
