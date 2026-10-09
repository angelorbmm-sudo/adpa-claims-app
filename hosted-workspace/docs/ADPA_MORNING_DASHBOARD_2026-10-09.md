# ADPA morning dashboard — October 9, 2026

Adds a saved-record morning briefing to the existing owner-only hosted workspace: top three recommended actions with browser-local reorder, urgent claim actions, repair funding blockers, separate ADPA fee balances, review queue, and waiting-person follow-ups. Recommendations use rules and documented records. They do not send messages, approve releases, resolve tasks or move money.

Funding is recorded once per distinct funding group with claim evidence and nonoverlap basis. Draws are flagged for review, not automatically summed. Fee balances use explicit agreement-supported fee and collected amounts; no default percentage. Prior committed settlement is documented as excluded from the fee basis, never subtracted twice. Original-file review confirmation, actor audit, revision history, claim versions and owner authentication protect saves. Source changes exclude stale amounts from known totals.

Live email, bank and background AI integration are not connected. Order preferences are local to this browser. Financial records are manually entered and require human validation.

Validation: 63 automated tests passed, TypeScript passed, production build passed. Browser and device visual QA was unavailable in this environment.

Source baseline: hosted Site commit 83c2f7709c132d02292d63a7770fb9b70146817a. Hosted framework is distinct from the recovered GitHub main React/Vite application. Preserve main; backup these hosted changes on a feature branch under hosted-workspace.
