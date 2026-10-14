# Company clients and intake review — 2026-10-14

Canonical area 7 completed. Ledger: 42 of 52 canonical areas covered; 10 dedicated reviews remain. Next: area 8 Start the first job.

## Changes

- The client list has stable date/ID cursor pagination beyond its previous silent 200-record cutoff. Load more preserves local entries, deduplicates loaded IDs and keeps company-scoped pages. Stage counts use all company records rather than only the displayed page.
- New intake has its own contact form, separate from the open client's details. Contact edits receive an atomic duplicate check for active email/property identities, with trimmed case-insensitive matching. Cancelled records do not block replacement intake; blank identities remain incomplete rather than implying fuzzy identity verification.
- Email permission requires an email and contact basis. Text opt-in requires an international phone number, text basis and contact basis on both create and contact edit. Incomplete inquiries may still be saved without contact permission.
- Final create/update writes bind exact company owner/version/state. Client updates also bind the original saved client state, so same-version material/access changes cannot overwrite newer facts. Contact changes additionally check matching active clients at the final write.
- Contact, follow-up, schedule and cancellation corrections retain before/after snapshots and actor/time. History is readable in the client workspace. The audit no longer truncates at 300 entries; explicit 1,000-entry history limits and the existing 500 KB saved-state limit preserve earlier records by rejecting additional writes at capacity.
- Unfinished intake/contact/note/task/message/contract/receipt/schedule/assignment/file entries block competing writes and guard navigation, client/company changes and refresh. Confirmations reset after edits. Explicit discard/reload and browser unload warnings are available; overlapping requests are blocked.
- Rejected writes retain entries. Accepted saves/uploads clear accepted entries before reload, and a failed refresh remains reported as saved. Company/client snapshots load together and reject obsolete responses from earlier company requests.

## Validation

664 automated tests passed, including eight new regressions covering more than 200 clients with timestamp ties, company-wide stage counts, consent prerequisites, contact duplicate edits, same-version client/company races, creation access races, retained corrections/history limits, competing drafts and confirmed-save refresh failures. TypeScript passed; production build runs during packaging.

## Pending

Browser/iPhone walkthrough and real multi-user/provider acceptance remain pending because supported browser QA is unavailable. Company email, texting, DocuSign activation and universal inbound logging remain separate work. No real client record, message, signature request or money movement was performed during this code review. The app remains owner-private. Earlier history already discarded by old truncation cannot be recovered from these changes.
