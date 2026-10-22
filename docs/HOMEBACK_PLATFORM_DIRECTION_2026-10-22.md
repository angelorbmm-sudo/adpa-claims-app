# HomeBack platform direction: HB1, HB2, and separate ADPA

Owner direction recorded October 22, 2026. Prepared by Susie for Angelo Daniel and José.

## Product decision

HomeBack is the shared technology platform and the HomeBack application contains two user paths: **HB1** and **HB2**. ADPA remains a separate public adjusting firm with its own application experience, using shared HomeBack technology. This supersedes descriptions of HB1, HB2, and ADPA as three independently rebuilt technology stacks.

This document records the target architecture and migration sequence. It does not rename a deployed app, move customer data, establish legal compliance, or implement access controls. Business separation must be reflected in branding, agreements, authorization, operational roles, and data access; naming alone does not establish it.

| Experience | Entry and purpose | Business workflow |
| --- | --- | --- |
| HomeBack / HB1 | Homeowner-first, before a loss | Begin with LifeWorth™; capture rooms, belongings, property materials, supporting records, and reviewed replacement-value information. Preserve the pre-loss baseline for later authorized use. |
| HomeBack / HB2 | Professional-first, after a loss | Contractor or other service provider onboards a homeowner under that provider's own agreement; document loss, inspection, mitigation, contents, repairs, and completion. LifeWorth helps document and reconstruct belongings and property records. |
| ADPA | Separate public adjusting firm and app experience | ADPA representation, firm-specific agreements, policy/claim review, carrier communications, negotiations, and financial review; use shared LifeWorth, evidence, measurement, and inspection services within authorized matters. |

HB1 and HB2 are paths inside HomeBack, selected from authorized user roles and the context of the property/job. A homeowner may have a pre-loss baseline and later participate in a professional's loss job. Do not make HB1/HB2 mutually exclusive global user types or grant professional access solely because a user selects HB2. ADPA membership and authority are separate from either path.

## Shared HomeBack technology

LifeWorth is a flagship shared capability, prominently surfaced in HB1, HB2, and the ADPA experience. Shared implementation candidates include:

- LifeWorth room/property inventory, contents identification, reviewed valuations, and evidence links.
- Camera/video/audio capture, original-media custody, inspection records, and source provenance.
- Apple RoomPlan capture, Android ARCore guided measurement, manual measurements, and versioned scan import.
- Geometry, sketches, material observations, reviewed scope quantities, and estimating adapters.
- Identity primitives, organization membership, server-enforced authorization, audit records, notifications, and document/signature integration infrastructure.

Share the code and services; protect records according to the organization, property/job, participant, and approved purpose. A shared signature engine must still use each service provider's own agreement and signatory authority. Sharing an estimating engine does not give every role permission to perform every ADPA workflow.

## Separation and access requirements

1. ADPA retains its name, firm identity, representation agreements, client relationship, staff roles, and public-adjuster workflow. HomeBack professional onboarding must clearly identify the actual contracting provider.
2. A HomeBack account or contractor agreement does not automatically establish ADPA representation. An ADPA referral is optional and distinct; representation requires the applicable ADPA onboarding and agreement process.
3. A common identity may support several memberships, but every request must authorize the acting organization, role, resource, and action on the server. A workspace switch or UI label is not an authorization boundary.
4. An authorized sharing record must identify sender, recipient organization, property/job or matter, data scope, purpose, approval/authority evidence, timestamps, and revocation behavior. Preserve provenance and distinguish shared snapshots from ongoing access.
5. ADPA-only records and capabilities remain restricted to authorized ADPA participants. Homeowners and contractors receive only access applicable to their relationship and task. Denials must be tested across APIs, files, exports, and background jobs.
6. Preserve original evidence IDs, hashes, capture times, source units, edits, measurement verification, and reviewer identity across authorized transfers. Do not rewrite historical evidence to change its brand.
7. Keep brand and deployment configuration separate from tenant/resource authorization. A HomeBack deployment must not silently assume ADPA authority or access.

These are engineering acceptance requirements, not a finding that any current implementation satisfies legal obligations.

## Inspection and native capture: verified source location

Existing source: `angelorbmm-sudo/adpa-claims-app`, branch `feature/inspection-to-xactimate-2026-10-20`.

- `docs/inspection/README.md` describes the web inspection workflow and the cross-platform follow-up.
- `native/README.md` documents Apple and Android starter source, version 2 polygon scans, manual fallback, and remaining device validation.
- The native README reports 105 passing JavaScript/server tests and a passing web build from prior validation. Those results have not been rerun for this documentation change.
- Native projects are explicitly uncompiled and not field validated. No paid service or scanner purchase was activated. Android capture is guided ARCore measurement and is not represented as automatic room recognition or physical LiDAR.

Treat this inspection technology as a candidate shared HomeBack module. ADPA remains its existing integration point until extraction is implemented and validated. Do not simply rename or delete the ADPA application to achieve this decision.

## José's migration sequence

1. Identify the canonical HomeBack source and deployment, the current ADPA deployment, and the intended release branches. The GitHub account visible during this review lists only `adpa-claims-app` and `-adpa-claims-demo`; HomeBack source has not been located or changed.
2. Review the inspection feature branch independently of `main`; do not assume it has been merged. Inventory existing HomeBack implementations before moving code to avoid replacing José's work.
3. Extract reusable LifeWorth, evidence, scan/geometry, inspection, and integration contracts into shared modules or services. Preserve compatibility with existing ADPA clients and scan formats. Choose package/repository boundaries after inspecting both actual applications.
4. Add HomeBack branding and HB1/HB2 navigation to the HomeBack application. Route by authorized memberships plus property/job context. Keep ADPA branding and public-adjuster workflow in its separate app experience.
5. Connect both applications to shared services through authenticated APIs with organization/resource authorization. Add explicit sharing and ADPA referral/representation flows before exposing cross-business records.
6. Build/sign Apple and Android companions, choose HomeBack-facing product names and unique bundle/application IDs, and retain provenance for legacy ADPA-named exports. Do not break existing version 1/version 2 scan imports merely to change branding.
7. Validate on real compatible iPhone/iPad and Samsung/Pixel devices against field measurements; test permissions, tracking loss, unsupported devices, export/import, and manual fallback. Vendor subscriptions are needed only if the chosen implementation actually requires them.
8. Stage and verify each app, reconcile data identifiers and access, retain backups and a rollback path, then release through the normal deployment process. No bulk client-data migration is authorized or performed by this architecture document.

## Acceptance examples

- HB1 homeowner creates a LifeWorth baseline; an unrelated contractor cannot discover or read it.
- A homeowner authorizes a specific provider on a post-loss job; that provider sees only the permitted records in HB2.
- Contractor onboarding uses the contractor's agreement; an ADPA referral neither signs an ADPA agreement nor grants ADPA claim access by itself.
- After separate ADPA onboarding and authorized sharing, ADPA uses the same inspection/LifeWorth technology in its own workspace; unrelated ADPA personnel and organizations remain denied.
- A multi-role user can enter both HB1 and HB2 when authorized; changing navigation cannot expand API permissions.
- Apple, Android, and manual scans preserve source method and original evidence; imports remain unverified until reviewed. Rebranding does not alter historical measurement provenance.
- Revoked shared access is rejected on subsequent API and file requests under the defined retention policy; prior immutable snapshots and audit history are handled explicitly.

## Status of this change

Architecture and migration handoff only. The ADPA repository name, deployed interfaces, client records, authentication, and native application identifiers are unchanged. Actual HomeBack migration depends on obtaining and inspecting its canonical source.
