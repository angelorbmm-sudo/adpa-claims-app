# Assembled-package approval bridge

Saved packages can create a Claim submission review record through the existing authority API. The user must explicitly disclose the proposed action, amounts, payment basis, deductible, depreciation, fees, net effect, open rights and release consequences. Controls and original authority evidence remain prerequisites.

Server-resolved `assembled:<UUID>` source records are owner/claim scoped. They bind the exact immutable snapshot SHA-256, original source claim version and package ID into the existing terms hash and witnessed-signature document snapshot. No duplicate evidence upload or new signature system is created. The existing client signature link opens the exact saved report.

Assembly freshness compares canonical material claim state and evidence, excluding authority audit records and row-version-only changes. All material changes still mark assembly and connected approvals stale. Legacy assembly fingerprints from the previous algorithm are conservatively outdated and require reassembly. New assembled submissions supersede earlier assembled submission approvals; approvals are not copied. Remote signature, identity, licensing/representation verification and step-up integrations remain unavailable, so release is always blocked. No access grants, outbound invitations or provider credentials are created.

Remote verification needs an approved identity/e-signing provider/account integration and platform-supported signer access. Existing owner sign-in does not prove a remote client's identity. In-person signing remains a witnessed attestation, not a claim of independently verified remote identity.

## Review update — October 14, 2026

Connections now require the exact opened assembly snapshot hash and saved source fingerprint. Current package attachments are checked against their saved metadata and byte digests; their leases are rechecked before an authority write. Missing/changed originals block connection and subsequent review. The final SQL guard also binds exact claim state/name/address. Safe assembly choices omit private object information. Disclosure drafts survive denied saves and status refreshes; parent navigation and overlapping actions are guarded. A confirmed connection remains reported as saved when the following refresh fails. Independent signer/provider verification and release remain unavailable.
