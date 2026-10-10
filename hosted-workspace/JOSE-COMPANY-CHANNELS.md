# Jose: activate ADPA company email, text and e-signature

## What is built

Open `/company-clients` from either company dashboard. The shared workspace supports company-manager intake, contact permission, notes, follow-ups, owned PDF contract templates with immutable revisions, client photos/video/audio/documents, downloads, saved email/SMS drafts, explicit reviewed outbound sending, provider status refresh, signed-contract retention, scheduling and transition to an assigned job.

This is an app-side implementation with provider adapters. Real outbound delivery, live signing and device/browser validation have not been tested. No customer messages or signing invitations were sent during development. The Site remains owner private. Company invitations and employee acceptance do not grant Site access.

Connected ChatGPT Gmail and DocuSign accounts belong to Angelo's assistant session. They are not automatically installed as server credentials for every company. Hosted ChatGPT connector eligibility was not exposed in this environment, so this implementation uses explicit company-scoped service API configuration and never borrows personal connection tokens.

## 1. Company setup and access

1. ADPA creates the mitigation or contents company and its named manager invitation in `/company` or `/contents-company`.
2. Grant the approved staff Site access separately. The manager accepts their invitation with the exact email account, then invites technicians and assigns accepted staff to jobs.
3. Managers and ADPA can access new client intake and templates. Technicians use only assigned job dashboards. Revocation is checked server-side for each client/file request.
4. Copy the company ID from the company API/UI context. It keys that company's channels; never reuse another company's sender or provider account without its authorization.

## 2. Company email: Resend

1. Establish the company's Resend account and verify its sending domain.
2. Configure an authorized sender address and monitored reply-to mailbox.
3. Use a restricted sending API key in secure server runtime settings. Do not put keys in GitHub, client JavaScript, company records or uploaded files.
4. Outbound email supports plain-text content and up to six attachments, capped at 15 MB combined. Drafts have frozen recipients; changed contact details require a new draft.
5. Provider acceptance does not mean delivery. Refresh the latest message's provider status. Incoming replies stay in the reply-to mailbox; inbox synchronization and inbound attachments are not implemented in this release.
6. The Resend ChatGPT plugin is optional for helping Angelo administer the service. Connecting it does not itself configure the ADPA server.

## 3. Company texting: Twilio

1. Establish the authorized business account and dedicated sender(s) through a Messaging Service. Complete the provider's required registration for the intended region/use case.
2. Configure Advanced Opt-Out and keep provider STOP suppression enabled. The app requires recorded client opt-in and a basis, and adds company identification plus STOP instructions.
3. Store account SID, service SID and auth token in secure runtime settings for that company.
4. Test delivery, STOP blocking, wrong numbers, undelivered/failed messages and client opt-out changes. Incoming replies and automatic opt-out synchronization are not yet implemented; monitor the company provider account and record opt-out in the app. Provider suppression remains essential.
5. This release sends SMS without media attachments. Send documents by email instead. Automated reminders and campaigns are not enabled.

## 4. Company contracts and DocuSign

1. Use the company's own reviewed PDF service agreement. Upload each new revision as a new immutable template, maximum 20 MB. Do not substitute an ADPA representation agreement for a vendor's service authorization.
2. Establish the company's DocuSign API integration and authorize its account. Use production account/base URI returned by the provider after API go-live; the adapter permits the supported DocuSign regional/demo HTTPS hosts only.
3. The current adapter consumes a bearer access token from secure runtime configuration. Jose must implement and verify a renewable OAuth/token lifecycle before production use; this release does not refresh expired tokens automatically. Use a sandbox token only for initial adapter testing.
4. Configure the account ID, base URI and token for the correct company. Do not copy the assistant session's token or another company's signing identity.
5. This release supports one client signer and an explicitly selected PDF page/X/Y signature tab. Review a sandbox envelope's rendered placement before using each template. Multiple signers, countersignatures, amendments and automatic envelope void/replacement are later work. Handle those cases in the provider and reconcile with ADPA rather than bypassing the workflow.
6. Send requires an explicit manager click and confirmation of full terms, exact template revision, signer identity/email, contact permission and signature placement.
7. Refresh verifies provider metadata matching company, client and request ID, checks the signer email, and requires status completed plus both valid signed PDF and completion certificate before unlocking scheduling. The app freezes the contract recipient and service scope; contact opt-out remains editable.
8. Signed service authorization does not establish ADPA representation, coverage, professional approval or settlement authority. Starting the job also requires an existing company-assigned ADPA claim with the same recorded property address.

## 5. Secure runtime configuration

Use the supported Sites runtime-secret configuration mechanism to supply `ADPA_COMPANY_CHANNELS_JSON`. It is an object keyed by company ID. Provide only channels that are actually configured for that company. Never expose this value in frontend code, source, screenshots, logs or an email.

Illustrative structure only; values below are placeholders, not working credentials:

```json
{
  "<company-id>": {
    "email": {"apiKey": "<Resend sending key>", "from": "dispatch@company.example", "replyTo": "office@company.example"},
    "sms": {"accountSid": "<Twilio AC SID>", "authToken": "<Twilio auth token>", "messagingServiceSid": "<Twilio MG SID>"},
    "signature": {"accountId": "<DocuSign account UUID>", "accessToken": "<securely supplied OAuth access token>", "baseUri": "https://na3.docusign.net"}
  }
}
```

The app reports configuration presence, not proven provider health. No keys are returned by its APIs. Partial/malformed configuration is not activated. Set/update secrets without rebuilding them into a client bundle. If a company account/token changes, reconcile requests against the original provider account before accepting completion.

## 6. Test and activate in order

1. Review browser/device layout and uploads as Angelo, a company manager and a technician. Browser QA was unavailable during development.
2. Test cross-company and cross-client file isolation, revoked users and stale versions. GET/Refresh of local records must never send anything.
3. Use synthetic clients and only specifically authorized test recipients. Confirm drafts save without activated channels and send controls remain blocked.
4. Activate one company's email, then SMS, then DocuSign sandbox signing; test provider errors and timeout/unknown outcomes before enabling production accounts.
5. Reserved attempts block duplicate sending. Do not automatically replay timeouts. Check the provider account and enter the matching receipt ID through reconciliation. A stuck Sending attempt can be reconciled after one minute; ordinary uncertain attempts cannot be overwritten by a fresh send.
6. Test email accepted versus delivered, SMS STOP, changed recipients, sent-contract identity freeze, opt-out after contract send, wrong envelope/client metadata, declined/voided status, invalid/missing PDFs and expired signing tokens.
7. Complete one authorized test envelope, refresh it, download both originals, schedule a job, verify address matching and start only the already-assigned job workflow.
8. Record the exact production readiness evidence for each company. Do not say a channel is live based solely on these automated fixtures or installed ChatGPT plugins.

## Validation and source

136 automated tests cover existing claim workflows plus manager isolation, client scope, consent, drafts, explicit dispatch, duplicate protection, uncertain outcomes, provider receipts, signature completion, signed originals, opt-out and assignment gates. TypeScript and production build are also required. Provider behavior tests use synthetic local mocks and prove no live email, SMS or signing delivery.

Key files: `lib/company-clients.ts`, `lib/company-delivery.ts`, `app/api/company-clients/route.ts`, `app/api/company-assets/route.ts`, `app/company-clients/workspace.tsx`, and migration `drizzle/0007_tricky_lizard.sql`. No existing migration was rewritten. The original GitHub main application is unchanged; cumulative hosted code is backed up under `hosted-workspace/` on a feature branch extending `ac7c100f07f88749500e95d987b0256d3d7c5d55`.

Official implementation references: https://resend.com/docs/api-reference/emails/send-email ; https://www.twilio.com/docs/messaging/api/message-resource ; https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopes/create/ ; https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopedocuments/get/ . Verify current provider onboarding and regional requirements before activating.
