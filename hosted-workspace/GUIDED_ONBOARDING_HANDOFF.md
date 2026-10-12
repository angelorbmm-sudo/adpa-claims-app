# Guided onboarding - October 12, 2026

`/getting-started` is the signed-in, role-based entry point. Company managers can select an existing company or start a new registration. Company basics require a name, primary industry, at least one service, service area, accuracy review and registration authority. Account email is displayed as identity and is not automatically a public business email. Additional industries and services remain supported. Existing industry setup stays available.

Save progress stores a private R2 draft under the authenticated account and selected company. Incomplete drafts do not register a company, confirm its services, list it publicly or grant claim access. Resume works across devices through the signed-in account. Conditional ETag writes reject concurrent draft overwrites. Company drafts additionally require current accepted manager access and current company version. The UI flags resumed drafts based on older company versions and guards unsaved navigation. Saving is explicit, not automatic.

Confirming basics stores services and area in the existing company record with a version guard. New marketing profiles can prefill the confirmed service area; existing marketing profiles are not overwritten. Duplicate registration by the same manager with the same normalized name returns the existing workspace rather than creating a duplicate. This is an accidental-duplicate safeguard, not legal entity verification or global deduplication.

Company checklist derives industry confirmation, client existence, contract templates, approved job participation and completed marketing basics from actual records. Staff and marketing remain optional until needed. External signatures, email, SMS and calling show Awaiting activation; the checklist does not certify licensing or activate providers.

Policyholder checklist derives invitation acceptance, open published requests and accessible homeowner recovery jobs. It directs the policyholder into the existing claim/recovery workflows. Invitation acceptance and provider hiring remain separate. Staff with no company management permission are guided to request a staff invitation rather than self-register someone else's company.

No identity provider, qualification-verification provider, banking setup or new messaging provider was activated. Existing private Site access is unchanged. Broader company/policyholder access requires separately authorized Site access. Real-user acceptance, mobile/browser visual checks and provider activation remain required before production rollout.
