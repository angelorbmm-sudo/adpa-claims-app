# ADPA CA/NV Compliance Matrix — 2026-10-06

| State | Stage | Requirement / control | Authority | AI allowed | Human gate |
|---|---|---|---|---|---|
| CA | Intake | Confirm jurisdiction, loss date, disaster status | Operational + applicable law | Classify | PA verifies |
| CA | License | Applicable PA license before regulated PA activity | Ins. Code §15000 et seq. | Check recorded status | License verification |
| CA | Contract | Commissioner-approved written contract, duplicate originals | §15027(a) | Populate approved fields only | PA/client signatures |
| CA | Disclosure | Separate disclosure before contract signing | §15027(v) | Present fixed template | Delivery evidence |
| CA | Fee | State compensation/base; insured initials; no impermissible collection terms | §15027(b)-(c) | Validate fields | PA/client verification |
| CA | Cancellation | 3 business days ordinary; 5 calendar days qualifying catastrophic disaster | §15027(f), (y) | Calculate provisional date | Holiday/disaster verification |
| CA | Representation notice | Notify insurer/adjuster/attorney no later than 3 business days after cancellation expires | §15027(w) | Draft/remind | Controlled send |
| CA | Solicitation | No solicitation during loss occurrence; 6 p.m.–8 a.m. restriction; catastrophe rule | §15027(d)-(e), §15027.1 | Block/flag | PA verifies exception |
| CA | Claim communications | Complete response clock generally 15 calendar days | 10 CCR §2695.5(b) | Clock/remind | Verify applicability |
| CA | Claim notice | Ack/forms/investigation clocks generally 15 calendar days | 10 CCR §2695.5(e) | Clock/remind | Verify applicability |
| CA | Proof of claim | Accept/deny generally within 40 calendar days | 10 CCR §2695.7(b) | Clock/remind | Verify proof trigger/exceptions |
| CA | Continuing investigation | Written 30-calendar-day continuation notices | 10 CCR §2695.7(c)(1) | Detect missed interval | PA review |
| CA | Payment | Accepted claim generally paid within 30 calendar days | 10 CCR §2695.7(h) | Reconcile/clock | Verify exceptions |
| CA | Investigation | Thorough, fair, objective; reasonably necessary information | 10 CCR §2695.7(d) | Flag evidence requests | PA judgment |
| CA | Property RCV | First-party property replacement-cost standards | 10 CCR §2695.9 | Compare scope/LKQ | PA approves |
| CA | Disaster | Apply loss-date/effective-date emergency/disaster rules | CIC + CDI current guide/orders | Retrieve/flag | PA/counsel where needed |
| NV | License | Applicable adjuster license required | NRS 684A.040 | Check recorded status | License verification |
| NV | Role | Public adjuster represents solely insured's financial interests | NRS 684A.030 | Conflict flag | PA review |
| NV | Conduct | Honest/fair, prompt/knowledgeable, objective; no legal advice | NRS 684A.165 | Draft/flag | PA/counsel boundary |
| NV | Privacy | Comply with privacy/information-security law | NRS 684A.165 | Enforce access rules | Security/compliance |
| NV | Records | Retain adjustment/compensation records at least 3 years after closure | NRS 684A.180 | Retention automation | Legal hold override |
| NV | Communications | Pertinent claimant response generally within 20 working days | NAC 686A.665 | Clock/remind | Verify working-day calendar |
| NV | Investigation | Begin investigation within 20 working days | NAC 686A.670 | Clock/remind | Verify applicability |
| NV | Proof of loss | Acceptance/denial/additional-time framework | NAC 686A.675 | Clock/remind | Verify trigger/exceptions |
| NV | Settlement conduct | Prompt/fair/equitable standards and reasoned denial/offer | NRS 686A.310 | Issue analysis | PA; counsel for legal conclusions |
| Both | Evidence | Source-linked proof for material positions | Best practice + policy duties | Organize/compare | Human verifies |
| Both | Negotiation | Issue-by-issue reconciliation and documented escalation | Best practice | Draft/recommend | Licensed PA approves |
| Both | Release | Compliance + operational + licensed + client gates | ADPA control | Block/route | Required approvers |
| Both | Closure | Reconcile money, unresolved issues, retention, legal hold | State rules + policy | Checklist | PA closes |

## Rule-engine requirements
Every encoded rule should ultimately carry: jurisdiction, authority, source URL, trigger, deadline unit, exceptions, effective_from, effective_through, disaster applicability, policy-type applicability, calculation method, reviewer requirement, audit evidence, and last_verified_at.

Do not treat a deadline calculation as a legal conclusion until its trigger and exceptions are verified.
