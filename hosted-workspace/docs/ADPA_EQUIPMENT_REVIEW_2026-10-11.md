# ADPA equipment quantity and duration review

Implemented 2026-10-11. Pilot workflow based on Arman's documentation guidance.

## Where to use it
- Water Scope Studio → select a claim → Equipment review.
- Mitigation workspace → Equipment quantity & duration shortcut.
- Company dashboard → open an assigned mitigation job → Equipment review.

## Workflow
1. Add a measured room and upload original field logs and placement evidence.
2. Record daily field visits with moisture/ambient readings and equipment group identifiers.
3. Add one fixed-count equipment deployment period. Record model, rated capacity basis, affected area, materials, layout and quantity justification. Category/class remain reported professional assessments with a named assessor and factual basis.
4. Enter deployment and removal timestamps with explicit timezone offsets. For ongoing equipment, enter a review-through cutoff. Use separate periods when quantities change.
5. Record billed unit-days and explain billing minimums or rounding when billed and elapsed quantities differ. The calculation uses actual elapsed hours times fixed count divided by 24, including DST offsets; it does not assume full days or revise invoices.
6. Link log and placement originals with locators and supporting same-room visits.
7. Resolve review prompts, inspect originals and record an internal source review. Company technicians can enter records; a company manager or ADPA records the company review.
8. Prepare, copy or download the internal text support summary. No message is sent by this action.

## Data safeguards
Records require room/source access and existing version checks. Company source projections hide records after sources are withdrawn and reject overwriting hidden records. Equipment identifiers are scoped by company to avoid collisions such as two companies using AM1. Reviews become stale after linked period, room, visit/correction or original metadata changes. New unlinked visits are not automatically added to the period; link them explicitly during the next review. Overlapping periods, differing event quantities, corrected/out-of-period visits and Pacific calendar dates without linked visits require reconciliation. Missing dates are review prompts, not automatic findings that charges are unsupported.

The company assignment screen can explicitly share equipment periods and their linked visits; each original and room must also be selected. Manager handoff checks current equipment support review. Facts are included in the claim-package mitigation section and package fingerprints. No ledger, coverage decision, settlement authorization or financial approval is changed.

Existing mitigation equipment records can seed a separate draft for the owner. It is a manual copy requiring verification; legacy records remain unchanged and are not synchronized. Xactimate integration is still planned, not activated by this enhancement.

## Validation
193 automated tests pass, including partial-day and DST duration, explicit ongoing cutoff, strict input, source review staleness, company isolation, manager review and source withdrawal. TypeScript check and production build are required before deployment. Browser/phone visual QA was unavailable in this environment. Arman's field usability and professional review remain necessary before broad use.
