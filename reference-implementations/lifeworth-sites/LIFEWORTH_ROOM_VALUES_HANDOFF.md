# LifeWorth room values — October 23, 2026

Source baseline: 6cea9010458b716d3475c9d9e97a6eeec3bab064 in the existing private Sites ADPA Claims Workspace. This checkout already contains the LifeWorth manual-record foundation described in HOMEBACK_LIFEWORTH_HANDOFF.md. The older Library comparison predates that foundation. Neither the separate GitHub app nor José's application was modified in this increment.

Added room-by-room inventory value summaries to /lifeworth, Inventory & materials. Unit values multiply by quantities. Owner-reviewed and unreviewed entered values remain separate. Missing values are counted separately from explicit zero values. Grouping ignores room-name whitespace and letter case, and calculations are scoped to the selected property. Building materials, contents and business equipment must not automatically be added to reconstruction costs because overlap is possible.

Validation: 750 automated tests passed, including new arithmetic, review-state, missing-price and property-isolation coverage; TypeScript no-emit check passed. Browser preview started, but browser access policy denied observation. No screenshot or device acceptance is claimed.

Full agreed scope remains incomplete. Existing source identifies original LifeWorth file uploads, automated receipt matching, company/household sharing, live retail commerce, subscription/storage billing, managed phone services, vendor adapters and automatic closeout transfers as outstanding. Existing manual plan/log forms do not activate these services. No paid service or new audience was enabled.

## Receipt-to-inventory increment

Added Purchases & receipts with property-scoped links to existing inventory items, receipt/line references, date, supplier, purchased quantity, total paid, optional original-source link and review state. Reviewed and unreviewed spending is calculated independently of replacement valuations. Purchased quantities above inventory quantities prompt review. Duplicate supplier/receipt/line entries within a property are rejected. Linked items cannot be removed or moved to another property until receipt records are removed. Existing inventory values and confirmations are preserved.

This is manual receipt allocation, not automatic OCR, file upload, checkout, refund processing or insurance entitlement. Return/refund notes do not automatically adjust totals. One recorded receipt line links to one item; split allocations are not implemented. Original evidence custody remains in existing authorized file workflows.

## Returns, refunds and review export

Receipt records now support returned quantity, confirmed refund amount and dated supporting reference. Backward-compatible defaults leave existing purchases unchanged. Server validation rejects returns above purchased quantity, refunds above gross paid, missing return/refund evidence and dates before purchase. Summary totals show gross purchases, recorded refunds, reviewed/unreviewed net spending and retained quantities. No money is moved and no original inventory valuation is changed. Return/refund details are aggregate per purchase line, not a transaction-level refund history.

Added selected-property receipt review CSV with inventory links, quantities, gross/refund/net values, review status and evidence references. Spreadsheet formula prefixes are neutralized and quoted/newline content escaped. Original files are not included. Browser/device QA remains unverified due to the browser security policy.

## Reviewed ITEL findings linked to materials

Building-material inventory records can optionally link a reviewed ITEL record from the same property. Linked findings, reviewer, report date and original report reference/link appear beside the material. Server validation rejects cross-property, unreviewed and contents-item links. Referenced reports cannot be deleted, moved to a different property or downgraded until inventory links are removed. Original replacement values remain separate and are not changed by report linking. This is manual reviewed report reuse, not an ITEL API connection or automatic product/coverage determination.
