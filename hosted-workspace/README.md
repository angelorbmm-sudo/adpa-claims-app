# ADPA Claims Workspace

Private responsive web application for creating and reopening claims, manually entering contents, keeping four coverage accounts, and tracking communications and reply drafts.

## Current behavior

- Signed-in, owner-scoped claim records in D1. Interactive claim/file reads and writes check user identity.
- A separate service import endpoint requires a server-held secret in addition to the private Sites boundary. It creates only owner-assigned claims, uses stable import IDs, and never overwrites existing edits. The temporary import secret is removed after loading the test file.
- Explicit Save claim persists inventory, coverage amounts, communication logs, follow-ups, and reply drafts.
- Version checks reject stale updates instead of silently overwriting a newer copy.
- Create claims from the saved-claims page. Add/update records using the form action, then Save claim before leaving.
- Supported viewport layouts cover mobile and desktop browsers. Physical-device testing remains outstanding.
- Categorized evidence files are stored privately in R2 with ownership metadata in D1. Files open/download from authenticated routes; content hashes deduplicate exact copies. Images and MP4 review copies display in the claim workspace. Uploads save immediately, up to 30 MB per file.
- Imported email body exports retain source links and dates. Communication history, proposed estimate values, client-reported unpriced contents, and unresolved questions remain separate.
- AI extraction, pricing research, claim preparation, and the approval engine are not connected yet.
- Email, SMS, HomeBack, and ESX connections are not live. Draft approval never sends correspondence.
- Owner-only publication; no collaborator has been invited. Angelo intends José to be the only future collaborator.

## Development

Use the pinned package manager and lockfile. Run the Sites dependency setup and build workflows. Schema lives in `db/schema.ts`; append migrations with `db:generate`. Hosted D1/R2 resources and sign-in are managed by Sites. Service imports use the optional secret ADPA_IMPORT_KEY; keep it out of source and browser code, and remove it when the import is complete.

`source/workspace-template.html` preserves the initial prototype. `scripts/port-workspace.py` adds server persistence and produces `app/workspace-html.ts`. The claim-list page uses React and the bundled interface primitives; the existing claim editor is preserved as a responsive HTML working surface.

Keep client files and credentials outside this code repository. Live claims need further operational and security review before broader production use. The current server tests verify storage, ownership checks, version conflicts, and origin checks; they do not establish public-adjuster regulatory compliance.
