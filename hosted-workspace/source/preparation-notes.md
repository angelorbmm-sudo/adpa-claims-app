# Supervised claim preparation

The preparation workspace is at `/preparation?id=<claim UUID>` and is linked from the dashboard and saved claim. Save claim edits before opening it.

Record checks work without a model. They flag missing saved profile fields, missing file categories, repeated inventory descriptions, requested amounts above entered limits, and differences between the received-payment ledger and bucket totals. They do not read files or establish benefits. The policy review lead expressly leaves ACV/RCV and depreciation conditions unconfirmed.

The document adapter accepts up to six PDFs, text/email files or supported images totaling 15 MB, reads owner-authorized R2 objects, and sends those files plus a bounded saved-record context to the OpenAI Responses API. Word/spreadsheet files must be exported to PDF. `OPENAI_API_KEY` is a server-only Site secret; optional `OPENAI_MODEL` defaults to `gpt-4.1`. No model key was configured or live model call tested when this module was implemented. Use the OpenAI Developers plugin's approved key setup to activate; never enter a key in the browser or source code.

Runs, original source manifests, input record snapshots, proposals, and review history are durable in the separate D1 `preparation_runs` table. Claims and financial/approval records are never written by this API. Reviews use the authenticated actor, source-check acknowledgment, review notes and optimistic concurrency. New claim versions or changed evidence manifests mark results stale and block confirmation. Running jobs have an atomic per-claim lock, idempotent request IDs, and a five-minute interrupted-job recovery. A failed or incomplete provider result produces no proposals. No automatic cost-incurring retries are performed.

Document quotes and PDF physical page references are model-proposed and visibly require original-file verification. File IDs, known inventory/record references and output shapes are validated server-side. Source text is treated as untrusted evidence. No tools, URLs supplied by the client, claim updates, submissions, release actions or outgoing messages are available to the model. The downloaded text remains an internal draft, including uncertainty, limitations, sources, status and review notes.

The recent-run selector shows 20 runs; older runs are retained in D1 and can be retrieved with the authenticated API using `claimId` and `runId`. Live model permission/billing, real document quality, exact quotation/page accuracy, and coverage conclusions require activation and human validation.

Validation: `npm run test:preparation` exercises migrated SQLite-backed API ownership, origin checks, idempotence, stale results, review notes/actor/concurrency, lock recovery, independent claim preservation and mocked provider success/failure/refusal. It also validates source constraints and record checks. This test does not claim to measure live model extraction quality.
