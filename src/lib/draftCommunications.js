import { prepareClaimReview } from "./claimPreparation.js";

const money=v=>Number(v||0).toLocaleString(undefined,{style:"currency",currency:"USD"});
const make=(claim,type,subject,body,requiresPAReview=false)=>({type,subject,body,status:"DRAFT / HUMAN REVIEW REQUIRED",sendAllowed:false,requiresPAReview,claimId:claim.id});

export function draftCommunicationOptions(claim){
 const p=prepareClaimReview(claim), out=[];
 const ref="Regarding "+(claim.insured||"the insured")+", claim "+(claim.claimNumber||"not entered")+", date of loss "+(claim.dateOfLoss||"not entered")+".";
 const end="\n\nPlease confirm receipt and advise of the current status and any additional information reasonably needed to move this matter forward.\n\nThank you,\nADPA Claims\nDRAFT — HUMAN REVIEW REQUIRED";
 const pa=p.findings.some(x=>x.requiresPA);
 out.push(make(claim,"Status Follow-up","Claim status / follow-up — "+(claim.claimNumber||"claim"),"Hello,\n\n"+ref+" We are following up regarding the current status of the claim. Please provide the carrier's current status, any pending decision or review, and any outstanding item needed from the insured or representative."+end,pa));
 const evidence=p.findings.filter(x=>x.type==="Evidence Gap"||x.type==="Evidence Review");
 if(evidence.length) out.push(make(claim,"Evidence Follow-up","Evidence / information follow-up — "+(claim.claimNumber||"claim"),"Hello,\n\n"+ref+" We are reviewing the claim file and identified evidence or information requiring clarification or completion before the substantive position is finalized. Please identify any carrier-requested documents or information that remain outstanding and the purpose of each request."+end,evidence.some(x=>x.requiresPA)));
 const supplements=(claim.supplements||[]).filter(x=>!["Resolved","Closed","Approved","Paid"].includes(x.status));
 if(supplements.length) out.push(make(claim,"Supplement Follow-up","Supplement status request — "+(claim.claimNumber||"claim"),"Hello,\n\n"+ref+" We are following up on "+supplements.length+" open supplement/dispute item(s) reflected in our file. Please provide the carrier's written status and position on each outstanding item, including any additional documentation or estimate detail needed for review. No settlement or release authority is conveyed by this request."+end,true));
 const dep=p.reconciliation.depreciationOutstanding;
 if(dep>0.01) out.push(make(claim,"Depreciation Follow-up","Recoverable depreciation status — "+(claim.claimNumber||"claim"),"Hello,\n\n"+ref+" Our current reconciliation reflects "+money(dep)+" in recoverable depreciation still outstanding, subject to policy terms and documented replacement or repair requirements. Please confirm the carrier's current depreciation-release requirements and identify any proof still needed for evaluation."+end,false));
 const held=p.reconciliation.lenderHeld;
 if(held>0.01) out.push(make(claim,"Mortgage / Loss Draft","Mortgage / loss-draft funds follow-up — "+(claim.claimNumber||"claim"),"Hello,\n\n"+ref+" Our current loss-draft record reflects approximately "+money(held)+" remaining lender-held. Please provide the current draw/release status and identify any inspection, endorsement, contractor, completion, or documentation requirement still needed for the next release."+end,false));
 return {options:out,prepared:p};
}
export const communicationDraftByType=(claim,type)=>draftCommunicationOptions(claim).options.find(x=>x.type===type)||null;
