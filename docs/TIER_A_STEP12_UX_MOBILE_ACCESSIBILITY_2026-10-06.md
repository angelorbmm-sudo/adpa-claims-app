# ADPA Tier-A Step 12 — Real-User UX, Mobile & Accessibility Review

Audit date: 2026-10-06
Status: COMPLETE — UX FOUNDATION PASS; REAL-USER/WCAG VALIDATION HOLD

Scope: information architecture, learnability, iPhone/mobile use, form semantics, keyboard/screen-reader accessibility, status communication, error prevention, destructive actions, cognitive load, role-based workflows and accessibility readiness.

Method: static source/CSS review of the current React UI plus standards-based review against WCAG 2.2 concepts. This is not a claim that live moderated user testing, VoiceOver testing, browser/device testing or an automated accessibility scan was executed; those require a deployed testable build.

## User groups to validate
- Licensed public adjuster.
- Claims/intake staff.
- Evidence/contents reviewer.
- Read-only/management reviewer.
- Homeowner/client for future limited workflows.
- Mortgage/recovery specialist if that role is introduced.

## Positive findings
- HTML language and responsive viewport are defined.
- Most form controls are associated with visible label wrappers.
- Native button/select/input/textarea elements are widely used, which gives a better accessibility baseline than custom div controls.
- Major screens use headings and descriptive explanatory text.
- Critical regulated states use words such as PASS/HOLD/CLEAR/BLOCKED rather than color alone.
- Disabled controls are used for unavailable actions.
- Demo mode visibly warns against real client data.
- Tables are wrapped for horizontal overflow.
- Evidence upload supports both drag/drop and file-picker interaction.
- Closure/release screens explain blockers instead of silently disabling progression.
- AI screen repeatedly states human-review/shadow-mode limitations.

## Findings

### S12-H01 — 32-module navigation is too dense for routine users
Severity: HIGH usability risk.
The sidebar exposes nearly the entire claims operating system at once. Expert users may learn it, but intake staff and occasional reviewers face high cognitive load, especially on mobile.
Fix: role/stage-based navigation groups such as Intake, Evidence, Valuation, Resolution, Financial, Authority/Close, with Advanced/All Modules available. Preserve direct access for experts.

### S12-H02 — Mobile navigation needs a deliberate pattern
Severity: HIGH.
A long 32-button sidebar cannot simply shrink onto an iPhone. Production needs a tested drawer/section navigator, current-module context and fast return to Claim Dashboard/Work Queue.
Fix: mobile header + accessible navigation drawer; group modules; maintain visible claim identity/status.

### S12-H03 — Save-state feedback is ambiguous
Severity: HIGH.
Some modules save immediately while intake edits remain draft until Save claim. Users can reasonably assume all changes behave the same way.
Fix: one consistent save model. Show Saved/Saving/Unsaved/Error and last saved time; warn before navigation with unsaved draft if applicable.

### S12-H04 — Destructive evidence removal lacks confirmation/recovery
Severity: HIGH.
EvidenceEngine's Remove record immediately removes metadata.
Fix: production disposition workflow from Step 8; at minimum confirmation/undo for nonregulated prototype actions, with reason/authorization for production evidence.

### S12-H05 — Error messaging/focus management is not a complete UX system
Severity: HIGH accessibility/usability.
There is no common validation summary, inline error semantics, aria-live announcement or focus-to-error pattern visible across the app.
Fix: shared form/error components; errors tied to controls via aria-describedby; summary at top; move/focus intelligently after failed submit; polite live region for save/upload results.

### S12-H06 — No tested keyboard/focus standard
Severity: HIGH accessibility.
Native controls help, but there is no visible skip link, explicit focus-visible design standard, drawer/dialog focus management or keyboard acceptance suite.
Fix: skip-to-main link, visible focus indicator, logical DOM/tab order, no keyboard traps, accessible mobile drawer and automated/manual keyboard tests.

### S12-H07 — Status pills/banners need semantic announcements
Severity: HIGH accessibility.
PASS/HOLD text is good, but dynamically changing compliance, upload, closure and AI statuses may not be announced to assistive technology.
Fix: appropriate status/alert live regions for material state changes without excessive announcements.

### S12-H08 — Tables require a mobile/accessible strategy
Severity: HIGH for financial/coverage screens.
Horizontal scrolling prevents clipping but wide editable tables can still be difficult on iPhone and at zoom.
Fix: responsive row/card alternative or focused edit view for mobile; preserve table semantics on desktop; test 320 CSS px and 200% zoom/reflow.

### S12-H09 — Touch-target sizing is not yet proven
Severity: HIGH mobile/accessibility.
Many navigation and record controls are compact. WCAG 2.2 adds a Target Size (Minimum) criterion with exceptions; production should meet or exceed practical touch targets and spacing.
Fix: measure rendered controls; aim for at least 24x24 CSS px minimum criterion compliance and preferably ~44px comfortable primary touch targets.

### S12-H10 — Real-user task testing has not occurred
Severity: HIGH.
Static review cannot prove that Nick/intake/reviewer/PA users understand terminology, routing, package/approval boundaries or how to recover from mistakes.
Fix: moderated task sessions using synthetic claims and observed completion/error/time metrics.

### S12-M01 — Terminology is expert-heavy
Severity: MEDIUM-HIGH.
Terms such as valuation, reconciliation, dispositioned, jurisdiction, evidence standards and routing buckets are appropriate professionally but may confuse new staff/clients.
Fix: contextual help/tooltips/plain-language subtext; do not dilute legally important terms.

### S12-M02 — Claim context can be lost during deep navigation
Severity: MEDIUM-HIGH.
The claim card helps, but long mobile screens need persistent compact context: insured, claim #, state, compliance/critical status and unsaved state.
Fix: sticky compact claim header designed for small screens.

### S12-M03 — Color contrast has not been measured
Severity: MEDIUM-HIGH.
Source review cannot certify computed foreground/background contrast.
Fix: automated axe/Lighthouse plus manual contrast measurement for text, pills, borders, focus and disabled states; target WCAG 2.2 AA.

### S12-M04 — No explicit reduced-motion/high-contrast preference handling
Severity: MEDIUM.
Current UI is not animation-heavy, which is positive, but production design should respect prefers-reduced-motion and forced-colors/high-contrast behavior if motion/custom visuals are introduced.

### S12-M05 — Numeric entry needs financial error prevention
Severity: MEDIUM-HIGH.
Coverage/payment/estimate fields can materially affect claim totals.
Fix: currency formatting/parsing, explicit units, confirmation/review for consequential changes, preserve prior value/audit, and never rely on placeholder text for meaning.

### S12-M06 — Long records need search/filter/collapse
Severity: MEDIUM.
Evidence, contents, communications, AI findings and audit histories will become difficult to scan.
Fix: search/filter/sort, progressive disclosure and meaningful counts while preserving accessibility.

### S12-M07 — Client-facing views should not reuse the full staff UI
Severity: MEDIUM-HIGH.
Future homeowner access should expose only understandable, authorized tasks/status/evidence—not 32 internal modules.
Fix: separate role-specific client experience/API permissions.

## Proposed mobile information architecture
Home/Portfolio
→ Claim
  → Summary & Tasks
  → Intake & Policy
  → Evidence
  → Damages (Dwelling/Contents/ALE/Code)
  → Financial (Payments/Depreciation/Mortgage)
  → Resolution (Issues/Supplements/Communications/Deadlines)
  → Authority (Package/Approvals/Signatures)
  → Close & Audit
Advanced
  → Compliance, Routing, Chronology, AI Preparation, Production Readiness

This is a UX grouping proposal; it does not remove underlying modules.

## Real-user test scripts
1. Intake staff: create a synthetic CA water claim, enter core facts, identify what remains incomplete.
2. Evidence reviewer: add policy/photo/receipt evidence, detect duplicate, mark review status, locate evidence gap.
3. PA: find the three highest-priority Work Queue items and open the correct claim/module.
4. PA: compare carrier vs ADPA amounts and identify unresolved variance without changing settlement authority.
5. Staff: record a payment and determine why reconciliation is blocked.
6. Recovery specialist: identify outstanding depreciation and lender-held funds.
7. PA: assemble package, determine why it becomes stale after a material change.
8. PA/client-authority simulation: verify approval is for the correct package version.
9. Closure: attempt premature close, understand blockers, correct them, close and reopen with reason.
10. New user: recover from a mistaken navigation/edit without losing work.
11. Mobile: complete tasks 1–3 on iPhone-sized viewport with one hand where practical.
12. Accessibility: complete key journey keyboard-only and with VoiceOver/NVDA as applicable.

## Success metrics
- >=90% task completion for trained staff on critical workflows before pilot.
- 100% of regulated release/closure tasks completed without accidental bypass in tests.
- No critical task requires hidden knowledge of module location after onboarding.
- No data loss in navigation/error-recovery tests.
- Critical actions clearly identify claim and consequence.
- Keyboard-only critical path completes without trap.
- Screen-reader critical path exposes labels, headings, state and errors.
- WCAG 2.2 AA automated scan has zero critical/serious unresolved issues, followed by manual validation.
- 200% zoom/reflow and narrow-mobile tests preserve critical information/actions.
- Primary mobile tasks meet approved completion-time/error thresholds after pilot baseline is established.

## Accessibility verification stack
Automated: axe/Lighthouse or equivalent on every major route/state.
Manual keyboard: Tab/Shift+Tab/Enter/Space/Escape and visible focus.
Screen reader: VoiceOver on iPhone/Safari; NVDA/Chrome or equivalent desktop combination.
Visual: 200%/400% zoom where applicable, 320 CSS px reflow, contrast, text spacing, orientation.
Mobile: current supported iPhone Safari plus representative Android/Chrome if ADPA supports it.
Cognitive/error prevention: plain instructions, consistent save model, confirmation for consequential actions, clear recovery.

## Release decision
Internal synthetic desktop demo: PASS WITH CAUTION.
Internal synthetic iPhone pilot: PARTIAL — requires deployed hands-on test.
WCAG 2.2 AA claim: NOT YET TESTED; do not claim conformance.
Homeowner/client-facing production: HOLD.
Staff production UX: HOLD until role-based navigation/save/error/mobile improvements and real-user testing.
Accessibility readiness: HOLD until automated + manual keyboard/screen-reader validation.

## Step 12 conclusion
ADPA already uses many accessibility-friendly native controls and communicates regulated HOLD/PASS states clearly. Its main UX problem is not lack of functionality; it is that the full power of 32 modules is exposed too directly. The Tier-A experience should progressively reveal the right modules for the user's role and current claim stage, make save state unmistakable, and make the critical claim journey equally understandable on iPhone, keyboard and screen reader. Real-user validation—not source review—will determine the final UX/accessibility pass.

STEP 12 COMPLETE.
