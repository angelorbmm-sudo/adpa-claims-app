# ADPA Tier-A Step 11 — Performance & Scale Review

Audit date: 2026-10-06
Status: COMPLETE — SCALE MODEL DEFINED; PRODUCTION LOAD PASS REQUIRES STAGING INFRASTRUCTURE

Scope: browser/UI computational growth, local persistence, API/database query patterns, connection pooling, claim JSON size, audit growth, evidence metadata, portfolio/work-queue aggregation, migration throughput and future 1,000-claims/month operating target.

Method: static performance/complexity review of current code and architecture. No claim is made that production load testing occurred; a representative deployed API/PostgreSQL/object-storage environment does not yet exist.

## Workload model to design for
Planning target: approximately 1,000 new claims/month with concurrent active claims spanning multiple months.
Representative synthetic heavy claim for testing:
- 2,000 contents line items;
- 1,000 evidence metadata records with original bytes stored outside claim JSON;
- 250 communications;
- 100 payments/receipts/recovery records;
- 100 deadlines/issues/supplements/critical events combined;
- 20 package/approval/signature versions;
- substantial audit history.
Portfolio tests should include 10,000 claims and a growth test above that level. These are engineering test shapes, not current ADPA usage claims.

## Positive findings
- PostgreSQL Pool exists with max 10 connections, providing a bounded starting point.
- Organization and updated-at indexes exist on claims.
- Claim-document claim index and audit claim/org indexes exist.
- Tenant-scoped claim reads use indexed organization_id.
- Evidence original bytes are not embedded in current claim JSON.
- React uses memoization in some evidence/workflow calculations.
- Migration is capped at 500 claims/request.
- API JSON body limit is 2 MB, preventing unlimited single-request bodies.
- Static demo and API architecture can be scaled independently later.

## Findings

### S11-C01 — GET /api/claims returns every full claim JSON document
Severity: CRITICAL before a large production portfolio.
The list endpoint selects data_json for every claim in the organization with no pagination, field projection, cursor or server-side filter. At thousands of claims this transfers and parses the entire portfolio, including large nested arrays.
Fix: paginated/cursor claim summaries with selected fields and server-side filters/sorts. Full claim JSON only on individual claim retrieval.

### S11-H01 — Browser localStorage serializes the whole workspace on saves
Severity: HIGH.
saveWorkspace JSON.stringify(value) writes the complete workspace. As claims/contents/history grow, each save becomes O(total workspace size), blocks the main browser thread and risks quota failure.
Fix: backend authority; local state only current claim/drafts/cache. Never scale production through one localStorage blob.

### S11-H02 — PortfolioDashboard repeatedly scans nested arrays across every claim
Severity: HIGH at scale.
Portfolio metrics compute requested/received/open issues/late clocks/holds/depreciation by iterating the full in-memory claim collection and nested records on render.
Fix: server-side portfolio summary/query or maintained aggregates; frontend receives compact metrics and paginated rows.

### S11-H03 — Work Queue is computed client-side from the full claim graph
Severity: HIGH at scale.
Exception generation must inspect multiple nested collections for every claim. This is reasonable for a prototype but expensive for a large portfolio and duplicates server-domain logic.
Fix: server-generated/indexed work items or materialized exception state with deterministic recomputation and audit.

### S11-H04 — Whole-claim JSON updates amplify write and audit cost
Severity: HIGH.
A small edit PUTs the complete claim and audit stores full before_json and after_json snapshots. Large contents/evidence/history can turn a tiny field edit into large DB writes, WAL, backups and audit storage.
Fix: action/resource-specific APIs; normalize high-churn collections; audit concise diffs plus immutable references/hashes where sufficient.

### S11-H05 — Claim JSON and request limit can conflict with heavy claims
Severity: HIGH.
Express accepts only 2 MB JSON, while a heavy claim with thousands of contents/evidence/history records can exceed that because the current update model submits the whole claim.
Fix: keep the protective request limit, but stop whole-claim mutation; paginate/subresource large collections and benchmark payload budgets.

### S11-H06 — Audit query has a fixed 500-row cap but no pagination
Severity: HIGH operational/history issue.
Large claims can exceed 500 events; older events become inaccessible through the API.
Fix: cursor pagination by created_at + id, tenant+claim index aligned to query.

### S11-H07 — Audit storage will grow rapidly due to full snapshots
Severity: HIGH.
Before/after copies of large claim JSON multiply storage and backup costs.
Fix: immutable event/diff strategy with selected snapshots/checkpoints; retain evidentiary/audit requirements without duplicating entire claims per edit.

### S11-H08 — Database connection pool is unmeasured
Severity: HIGH before production scale.
max:10 may be correct or incorrect depending on API replicas, DB capacity and workload. No connection/query timeout or saturation metric exists.
Fix: load test, size pool across replicas against DB connection budget, configure timeouts and monitor queue/saturation.

### S11-H09 — No caching/conditional-fetch strategy
Severity: HIGH for repeated portfolio/detail reads.
No ETag/If-None-Match, last-version conditional read, query cache or frontend server-state cache exists.
Fix: introduce only after canonical API design; version/ETag claim reads are natural because claim.version already exists.

### S11-H10 — Evidence hashing loads each file into browser memory
Severity: HIGH for large videos/files.
file.arrayBuffer() reads the complete file before crypto.subtle.digest. Multiple large evidence files can create memory pressure and poor mobile responsiveness.
Fix: production direct-to-object-storage multipart/resumable upload; server/object integrity verification; size limits. Browser hash only for appropriately sized files or use a streaming-capable design.

### S11-M01 — Duplicate evidence detection is O(n²) in rendering
Severity: MEDIUM-HIGH.
docs.filter combined with arr.findIndex scans the list repeatedly.
Fix: one-pass hash frequency map/useMemo.

### S11-M02 — Several UI list views render all rows
Severity: MEDIUM-HIGH.
Large contents, evidence, communications and other arrays need pagination/virtualization to remain responsive on iPhone/desktop.
Fix: virtualized/paginated tables with search/filter and stable keys.

### S11-M03 — Sorting/aggregation happens repeatedly in the browser
Severity: MEDIUM.
Lifecycle, dashboard and queue calculations repeatedly derive state from arrays.
Fix: canonical selectors with memoization for current claim; server aggregation for cross-claim portfolio.

### S11-M04 — Claims indexes need production-query redesign
Severity: MEDIUM-HIGH.
Existing indexes are a good foundation, but future queries will need organization + status/updated/jurisdiction/assignee/due-date patterns. Much operational state currently lives inside JSONB.
Fix: define real query workload first; promote frequently filtered/sorted fields to indexed relational columns/materialized views. Avoid speculative indexing.

### S11-M05 — Migration transaction size needs benchmarking
Severity: MEDIUM.
500 whole claims in one transaction can be large and hold resources.
Fix: controlled idempotent batches/checkpoints after staging benchmark, with reconciliation.

### S11-M06 — No performance telemetry
Severity: MEDIUM-HIGH.
No p50/p95/p99 API latency, DB query timing, payload size, browser Web Vitals, queue depth, memory or error-rate metrics exist.
Fix: add observability before pilot so performance regressions are measurable.

### S11-M07 — Package assembly/hash can become expensive for very large claims
Severity: MEDIUM.
Large snapshots require serialization/hash work and should not run unnecessarily on every UI change.
Fix: package generation is an explicit server-side/versioned action; hash canonical manifest/reference structure rather than embedding unnecessary large derived data.

## Performance budgets to validate
These are initial Tier-A targets to approve/measure, not current measured results:
- Portfolio summary API p95 <= 500 ms under expected concurrency.
- Claim summary page p95 API <= 500 ms; full claim initial API <= 1 s for heavy claim.
- Common mutation p95 <= 750 ms excluding external vendor work.
- Work Queue first useful view <= 2 s on supported mobile/network profile.
- Main interactive screens avoid >200 ms main-thread tasks during ordinary edits.
- Pagination defaults 50 or fewer portfolio/work items; configurable bounded maximum.
- No ordinary JSON mutation payload > 512 KB target; large resources use subresource/batch APIs.
- Evidence bytes never proxy through claim JSON.
- Error rate <1% under planned peak synthetic load, excluding deliberate validation/authorization failures.
- DB pool saturation should not remain at capacity; alert before exhaustion.
- No material memory growth during repeated navigation/upload metadata operations.

## Load-test stages
Stage A — domain microbenchmarks: reconciliation/package/deadline selectors with heavy synthetic claims.
Stage B — API integration: single-user claim CRUD, list pagination, audit pagination.
Stage C — DB load: 10k synthetic claims, realistic nested/high-churn child records, indexed queries.
Stage D — concurrency: ramp virtual users through portfolio/list/detail/update/work-queue patterns.
Stage E — evidence: multipart/resumable synthetic uploads with size/type mix once storage exists.
Stage F — soak: multi-hour sustained workload to expose connection/memory/resource leaks.
Stage G — spike: catastrophe-style burst intake significantly above normal rate.
Stage H — failure-under-load: DB/storage/IdP latency and partial outage while traffic continues.

## Catastrophe surge scenario
Because public adjusting can receive burst demand after a regional catastrophe, capacity planning should not use only average monthly volume. Test a surge such as hundreds of new intakes over hours, concurrent evidence uploads and many staff opening the same regional portfolio. The exact production target should be chosen from business forecasts and then measured, not guessed.

## Acceptance criteria
- Pagination prevents portfolio response size from growing linearly without bound.
- 10k synthetic claims remain queryable within approved budgets.
- Heavy claim with 2k contents does not freeze supported mobile UI.
- Concurrent edits produce correct 409/version behavior, not silent lost updates.
- DB pool stays within approved saturation/latency thresholds.
- Audit history remains pageable beyond 500 events.
- Evidence uploads do not exhaust browser/API memory.
- Work Queue/portfolio metrics match canonical reconciliation under load.
- Soak test shows no material memory/connection leak.
- Spike test degrades predictably and recovers without data loss.
- Backups/recovery continue to meet Step 10 targets at realistic data volume.
- Security/tenant isolation remain correct under load.

## Release decision
Synthetic demo/small portfolio: PASS WITH CAUTION.
1,000-claims/month production target: NOT YET TESTED.
Large-portfolio production: HOLD until API pagination/backend authority and load tests.
Catastrophe surge readiness: HOLD until measured spike/evidence tests.
Performance readiness becomes PASS only from production-like staging measurements.

## Step 11 conclusion
ADPA's current architecture is appropriate for building and demonstrating the workflow, but the browser-centric whole-workspace/whole-claim model is not the architecture to carry a large production portfolio. The most important scale transition is to make PostgreSQL/API authoritative, return paginated claim summaries, split high-volume child resources from whole-claim JSON, and move portfolio/work-queue aggregation server-side. After those changes, production-like load tests can establish real capacity rather than relying on estimates.

STEP 11 COMPLETE.
