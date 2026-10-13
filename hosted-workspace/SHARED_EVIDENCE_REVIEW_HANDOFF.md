# Shared Evidence Inbox review — 2026-10-13

Authorized companies can find originals by filename, source, room and physical-item reference. Current shared organization supplies a fallback until their own tags are saved. Review status remains separate for each role; stale or inaccessible source tags do not route evidence. Own explicit Unassigned tags override borrowed classification.

Contents inventory references are unique within their originating role/workspace, regardless of room relocation. This avoids duplicating physical-item references without inspecting another company’s private records or automatically merging items.

Uploads respect all existing unsaved work drafts and navigation protection. Batches stop on authentication, authorization, missing-job or version conflicts, and identify remaining files as not uploaded. Independent file failures continue. Supported extension fallback handles missing phone/browser MIME metadata; CSV/TSV uploads are accepted. Unsupported HEIC remains unsupported.

New originals retain existing private/unreviewed defaults and sharing consent controls. Existing file revocation, source-version and company/job-version guards remain active.

Validation: 413 automated tests passed, including authorized cross-company organization, revoked visibility, stale tag routing, physical tag duplication, MIME fallback and private CSV uploads. TypeScript and production packaging must pass before release.

Limits: browser/phone walkthrough deferred. Audio/video AI examination, native Matterport import, large-file upload and production AI/provider activation remain pending. Shared organization is not another company’s review approval, an inventory quantity, a price or an insurance coverage determination.
