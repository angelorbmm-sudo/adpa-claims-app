export const DEADLINE_RULES = {
  CA: [
    { key: "claim_ack", label: "Acknowledge notice of claim", days: 15, unit: "calendar", authority: "10 CCR 2695.5(e)(1)", verifiedOn: "2026-10-06", effectiveFrom: null, effectiveThrough: null },
    { key: "claimant_communication", label: "Complete response to claimant communication", days: 15, unit: "calendar", authority: "10 CCR 2695.5(b)", verifiedOn: "2026-10-06", effectiveFrom: null, effectiveThrough: null },
    { key: "proof_decision", label: "Accept or deny after proof of claim", days: 40, unit: "calendar", authority: "10 CCR 2695.7(b)", verifiedOn: "2026-10-06", effectiveFrom: null, effectiveThrough: null },
    { key: "extension_notice", label: "Continuing investigation notice", days: 30, unit: "calendar", authority: "10 CCR 2695.7(c)(1)", verifiedOn: "2026-10-06", effectiveFrom: null, effectiveThrough: null },
    { key: "accepted_payment", label: "Payment after claim accepted", days: 30, unit: "calendar", authority: "10 CCR 2695.7(h)", verifiedOn: "2026-10-06", effectiveFrom: null, effectiveThrough: null }
  ],
  NV: [
    { key: "claim_ack", label: "Acknowledge notice of claim", days: 20, unit: "working", authority: "NAC 686A.665(1)", verifiedOn: "2026-10-06", effectiveFrom: null, effectiveThrough: null },
    { key: "claimant_communication", label: "Reply to pertinent claimant communication", days: 20, unit: "working", authority: "NAC 686A.665(3)", verifiedOn: "2026-10-06", effectiveFrom: null, effectiveThrough: null },
    { key: "investigation_begin", label: "Begin claim investigation", days: 20, unit: "working", authority: "NAC 686A.670(1)", verifiedOn: "2026-10-06", effectiveFrom: null, effectiveThrough: null },
    { key: "investigation_complete", label: "Complete investigation unless not reasonably possible", days: 30, unit: "calendar", authority: "NAC 686A.670(2)", verifiedOn: "2026-10-06", effectiveFrom: null, effectiveThrough: null },
    { key: "proof_decision", label: "Accept or deny after properly executed proof of loss", days: 30, unit: "working", authority: "NAC 686A.675(1)", verifiedOn: "2026-10-06", effectiveFrom: null, effectiveThrough: null },
    { key: "extension_notice", label: "Initial additional-time notice after proof of loss", days: 30, unit: "working", authority: "NAC 686A.675(3)", verifiedOn: "2026-10-06", effectiveFrom: null, effectiveThrough: null },
    { key: "accepted_payment", label: "Payment after claim accepted", days: 30, unit: "calendar", authority: "NAC 686A.675(1)", verifiedOn: "2026-10-06", effectiveFrom: null, effectiveThrough: null },
    { key: "undisputed_payment", label: "Undisputed portion payment", days: 0, unit: "prompt", authority: "NAC 686A.675(7)", verifiedOn: "2026-10-06", effectiveFrom: null, effectiveThrough: null }
  ]
};

export function addCalendarDays(date, days) {
  const d = new Date(date + "T12:00:00");
  d.setDate(d.getDate() + Number(days || 0));
  return d.toISOString().slice(0, 10);
}

export function addWorkingDays(date, days) {
  const d = new Date(date + "T12:00:00");
  let remaining = Number(days || 0);
  while (remaining > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) remaining -= 1;
  }
  return d.toISOString().slice(0, 10);
}

export function calculateDueDate(startDate, rule) {
  if (!startDate || !rule || rule.unit === "prompt") return "";
  return rule.unit === "working" ? addWorkingDays(startDate, rule.days) : addCalendarDays(startDate, rule.days);
}

export function reminderDate(dueDate, leadDays = 2) {
  if (!dueDate) return "";
  const d = new Date(dueDate + "T12:00:00");
  d.setDate(d.getDate() - Number(leadDays || 2));
  return d.toISOString().slice(0, 10);
}

export function daysFromToday(date) {
  if (!date) return null;
  return Math.ceil((new Date(date + "T23:59:59").getTime() - Date.now()) / 86400000);
}

export function ruleFor(state, key) {
  return (DEADLINE_RULES[state] || []).find(r => r.key === key);
}
