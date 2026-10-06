const META = { verifiedOn:"2026-10-06", effectiveFrom:null, effectiveThrough:null };
export const DEADLINE_RULES = {
  CA: [
    { key:"claim_ack", label:"Acknowledge notice of claim", days:15, unit:"calendar", authority:"10 CCR 2695.5(e)(1)", source:"California DOI Fair Claims Settlement Practices Regulations", ...META },
    { key:"claim_forms", label:"Provide necessary claim forms, instructions and assistance", days:15, unit:"calendar", authority:"10 CCR 2695.5(e)(2)", source:"California DOI Fair Claims Settlement Practices Regulations", ...META },
    { key:"investigation_begin", label:"Begin claim investigation", days:15, unit:"calendar", authority:"10 CCR 2695.5(e)(3)", source:"California DOI Fair Claims Settlement Practices Regulations", ...META },
    { key:"claimant_communication", label:"Complete response to pertinent claimant communication", days:15, unit:"calendar", authority:"10 CCR 2695.5(b)", source:"California DOI Fair Claims Settlement Practices Regulations", ...META },
    { key:"proof_decision", label:"Accept or deny after proof of claim", days:40, unit:"calendar", authority:"10 CCR 2695.7(b)", source:"California DOI Fair Claims Settlement Practices Regulations", ...META },
    { key:"extension_notice", label:"Continuing investigation notice", days:30, unit:"calendar", authority:"10 CCR 2695.7(c)(1)", source:"California DOI Fair Claims Settlement Practices Regulations", ...META },
    { key:"accepted_payment", label:"Payment after claim accepted", days:30, unit:"calendar", authority:"10 CCR 2695.7(h)", source:"California DOI Fair Claims Settlement Practices Regulations", ...META }
  ],
  NV: [
    { key:"claim_ack", label:"Acknowledge notice of claim", days:20, unit:"working", authority:"NAC 686A.665(1)", source:"Nevada Administrative Code Chapter 686A", ...META },
    { key:"claim_forms", label:"Provide necessary claim forms, instructions and reasonable assistance", days:20, unit:"working", authority:"NAC 686A.665(4)", source:"Nevada Administrative Code Chapter 686A", ...META },
    { key:"claimant_communication", label:"Reply to pertinent claimant communication", days:20, unit:"working", authority:"NAC 686A.665(3)", source:"Nevada Administrative Code Chapter 686A", ...META },
    { key:"investigation_begin", label:"Begin claim investigation / provide required-item notice", days:20, unit:"working", authority:"NAC 686A.670(1)", source:"Nevada Administrative Code Chapter 686A", ...META },
    { key:"investigation_complete", label:"Complete investigation unless not reasonably possible", days:30, unit:"calendar", authority:"NAC 686A.670(2)", source:"Nevada Administrative Code Chapter 686A", ...META },
    { key:"proof_decision", label:"Accept or deny after properly executed proof of loss", days:30, unit:"working", authority:"NAC 686A.675(1)", source:"Nevada Administrative Code Chapter 686A", ...META },
    { key:"extension_notice", label:"Initial additional-time notice after proof of loss", days:30, unit:"working", authority:"NAC 686A.675(3)", source:"Nevada Administrative Code Chapter 686A", ...META },
    { key:"extension_continuing", label:"Continuing incomplete-investigation notice", days:30, unit:"calendar", authority:"NAC 686A.675(3)", source:"Nevada Administrative Code Chapter 686A", ...META },
    { key:"accepted_payment", label:"Payment after claim accepted", days:30, unit:"calendar", authority:"NAC 686A.675(1)", source:"Nevada Administrative Code Chapter 686A", ...META },
    { key:"undisputed_payment", label:"Undisputed portion payment", days:0, unit:"prompt", authority:"NAC 686A.675(7)", source:"Nevada Administrative Code Chapter 686A", ...META },
    { key:"limitations_notice", label:"Insurer notice before limitations/policy time limit may expire", days:60, unit:"before", authority:"NAC 686A.675(5)", source:"Nevada Administrative Code Chapter 686A", ...META }
  ]
};

export function addCalendarDays(date,days){const d=new Date(date+"T12:00:00");d.setDate(d.getDate()+Number(days||0));return d.toISOString().slice(0,10);}
export function addWorkingDays(date,days){const d=new Date(date+"T12:00:00");let remaining=Number(days||0);while(remaining>0){d.setDate(d.getDate()+1);if(d.getDay()!==0&&d.getDay()!==6)remaining--;}return d.toISOString().slice(0,10);}
export function calculateDueDate(startDate,rule){if(!startDate||!rule||rule.unit==="prompt")return "";if(rule.unit==="before"){const d=new Date(startDate+"T12:00:00");d.setDate(d.getDate()-Number(rule.days||0));return d.toISOString().slice(0,10);}return rule.unit==="working"?addWorkingDays(startDate,rule.days):addCalendarDays(startDate,rule.days);}
export function reminderDate(dueDate,leadDays=2){if(!dueDate)return "";const d=new Date(dueDate+"T12:00:00");d.setDate(d.getDate()-Number(leadDays||2));return d.toISOString().slice(0,10);}
export function daysFromToday(date){if(!date)return null;return Math.ceil((new Date(date+"T23:59:59").getTime()-Date.now())/86400000);}
export function ruleFor(state,key){return (DEADLINE_RULES[state]||[]).find(r=>r.key===key);}
