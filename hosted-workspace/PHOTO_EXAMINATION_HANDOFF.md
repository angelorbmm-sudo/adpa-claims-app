# Evidence photo examination — October 13, 2026

## Delivered

- Each available photo in the Evidence Inbox has a Photo findings action. The focused panel displays the authorized original on request, manual findings, pending AI suggestions, corrected human confirmation and source-linked research briefs.
- Findings distinguish building damage, contents, both, or uncertain. They record specifically visible observations, a photo-region locator, legible identity only, uncertainty, missing detail requests and confirmed room/physical-item references.
- AI examination supports one JPEG, PNG or WebP photo up to 12 MB. It uses the existing server-side OpenAI Responses integration, strict structured output, a timeout and ten saved examinations per role/job/hour. No tools or price search run during examination.
- AI suggestions do not change file human-review status, create inventory quantities, automatically merge items, or approve a scope/price. Reviewers correct/remove unsupported findings before confirmation. Original suggestions remain retained; other companies see only corrected confirmed findings under the original file's current sharing permissions.
- Manual findings are available with no AI activation. Confirmation requires checking the original. The research brief retains evidence ID, authorized original URL, reviewer role, locators, associations, unknown identity and missing details; it supplies no measured quantities or prices.
- SHA-256 and byte length are checked before examination/confirmation. Current job, source metadata, actor-company versions and ADPA representation evidence are guarded across external requests. Consent or participation changes discard late AI output. Missing/changed originals cannot be examined or confirmed.

## Jose activation and verification

The production Sites environment was inspected on October 13 and had no configured runtime entries. AI examination is not active. Configure OPENAI_API_KEY as a server-side secret in Sites, optionally OPENAI_MODEL for the approved image-capable model (existing default gpt-4.1), and redeploy. Do not paste or store the key in code. This activation also enables existing AI preparation/pricing paths that consume the same key; verify those integrations with bounded synthetic evidence before wider use.

The exact key is never returned to the browser. The UI's AI readiness flag reports configured presence only; it does not prove billing/model/network health. A selected-photo submission asks explicit consent to transfer that original and its authorized room/item reference context to the service. store:false is set on the request. Do not promise zero provider retention from that flag.

Run real-provider QA with synthetic building and contents photos, incomplete/refusal cases, ambiguous room/item identity, model-label readability and revoked sharing during requests. Live browser QA was unavailable in this managed environment and remains deferred. Automated tests use controlled synthetic responses and do not prove visual accuracy. Enterprise malware scanning and strict provider spend controls remain further production work.

## Boundaries

No video/audio/Matterport examination in this task. No automatic replacement shopping or Xactimate quantities. Confirmed photo findings are a foundation for those next steps. Room and item associations are saved on the finding itself; file-level tags remain separate deliberate records. No existing priced inventory or estimate is modified.

The job retains up to 100 examination records within its 800 KB serialized state limit. The hourly cap counts saved AI runs, not failed or concurrent provider requests; provider-level spend/rate limits must also be configured. API errors remain visible and never mark an original examined. Owner-private Site access is preserved.

## Validation

277 automated tests, TypeScript and production build checked before publication. Includes original integrity, permissions, missing activation, structured-output rejection, per-role confirmation, corrected draft privacy, consent changes during external calls and reference consent.
