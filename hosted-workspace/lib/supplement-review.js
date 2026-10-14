export const supplementStatuses=['Draft','Ready to submit','Submitted','Under review','Additional information requested','Partially approved','Approved','Disputed','Denied','Revised / resubmitted','Closed'];
const stable=v=>Array.isArray(v)?'['+v.map(stable).join(',')+']':v&&typeof v==='object'?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}':JSON.stringify(v)??'null';
const present=v=>v!==null&&v!==undefined&&String(v).trim()!=='';
export const supplementCents=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&Number.isSafeInteger(Math.round(v*100))&&Math.abs(v*100-Math.round(v*100))<0.000001?Math.round(v*100):null;
export const supplementDate=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
export const supplementSourceKey=f=>stable(Object.fromEntries(['id','filename','mime','size','category','created'].map(k=>[k,f[k]??null])));
export function supplementGaps(r,files=[],buckets=[]){
 if(r.voided)return present(r.voidReason)?[]:['Explain why this supplement was voided.'];
 const gaps=[],add=x=>gaps.push(x);
 if(!present(r.title)||!Number.isInteger(r.coverage)||!buckets[r.coverage]||!supplementStatuses.includes(r.status))add('Record title, current coverage and supplement status.');
 for(const k of ['requested','approved'])if(present(r[k])&&supplementCents(r[k])===null)add('Supplement amounts need nonnegative whole cents; unknown remains blank.');
 if(present(r.date)&&!supplementDate(r.date))add('Use a real calendar date.');
 const support=files.find(f=>f.id===r.evidenceId);if(!support||!present(r.evidenceLocator))add('Link the supporting original and its page or record locator.');else if(r.evidenceKey!==supplementSourceKey(support))add('Supporting original review is missing or stale.');
 if(present(r.requested)&&!present(r.amountBasis))add('Explain whether this request is incremental, replacement or cumulative; do not add overlapping demands.');
 if(['Submitted','Under review','Additional information requested','Revised / resubmitted'].includes(r.status)){const proof=files.find(f=>f.id===r.submissionEvidenceId);if(!proof||!present(r.submissionLocator)||r.submissionKey!==supplementSourceKey(proof))add('Record current original proof and locator for the logged submission.');}
 if(present(r.approved)||['Approved','Partially approved','Denied','Disputed','Additional information requested','Closed'].includes(r.status)){const proof=files.find(f=>f.id===r.responseEvidenceId);if(!proof||!present(r.responseLocator)||r.responseChecked!==true||r.responseKey!==supplementSourceKey(proof))add('Carrier position or amount needs a separately reviewed response original and locator.');}
 if(['Approved','Partially approved'].includes(r.status)&&supplementCents(r.approved)===null)add('Record the separately supported carrier-approved amount; approval is not payment.');
 if(r.status!=='Draft'&&r.status!=='Closed'&&(!present(r.owner)||!present(r.nextAction)||!supplementDate(r.followUp)))add('Record responsible person, next action and valid follow-up date.');
 if(r.status==='Closed'&&!present(r.closeReason))add('Explain why this issue is closed; closure does not establish payment.');
 return [...new Set(gaps)];
}
export function supplementFindings(state,files=[]){return (state.supplements||[]).flatMap(r=>supplementGaps(r,files,state.buckets||[]).map(g=>'Supplement '+(r.title||r.id)+': '+g));}
export function supplementStateError(previous,next,files=[]){
 const rows=next.supplements||[],prior=previous?.supplements||[];if(stable(rows)===stable(prior))return null;
 if(!Array.isArray(rows)||rows.length>2000)return 'Invalid or oversized supplement records.';
 if(prior.some(r=>!rows.some(n=>n.id===r.id)))return 'Keep existing supplement history; void a record with a reason instead of deleting it.';
 const ids=new Set();for(const r of rows){if(!r?.id||ids.has(r.id))return 'Supplement IDs must be present and unique.';ids.add(r.id);const old=prior.find(o=>o.id===r.id);if(old&&stable(old)===stable(r))continue;
 if(['voided','responseChecked'].some(k=>r[k]!==undefined&&typeof r[k]!=='boolean'))return 'Supplement review and void controls require true or false.';if(old?.scopePairId&&r.voided&&(stable(r.scopeSourceVersions)!==stable(old.scopeSourceVersions)||stable(r.scopeSnapshot)!==stable(old.scopeSnapshot)))return 'Preserve construction source provenance when voiding a supplement.';if(old?.scopePairId&&r.scopePairId!==old.scopePairId)return 'Preserve the construction comparison link when revising a supplement.';
 for(const k of ['title','owner','notes','amountBasis','evidenceLocator','submissionLocator','responseLocator','nextAction','waitingOn','closeReason','voidReason','correctionReason'])if(present(r[k])&&(typeof r[k]!=='string'||r[k].length>4000))return 'Supplement text fields exceed their supported size.';
 if(!present(r.title)||!Number.isInteger(r.coverage)||!next.buckets?.[r.coverage]||!supplementStatuses.includes(r.status))return 'Record supplement title, current coverage and status.';
 for(const k of ['requested','approved'])if(present(r[k])&&supplementCents(r[k])===null)return 'Supplement amounts require nonnegative whole cents; keep unknown amounts blank.';
 for(const k of ['date','followUp'])if(present(r[k])&&!supplementDate(r[k]))return 'Use real calendar dates for supplement records and follow-up.';
 for(const k of ['evidenceId','submissionEvidenceId','responseEvidenceId'])if(r[k]&&!files.some(f=>f.id===r[k]))return 'Supplement originals must belong to this claim.';
 if(old){if(!present(r.correctionReason))return 'Explain this supplement correction.';const history=r.history||[],oldHistory=old.history||[];if(!Array.isArray(history)||history.length<=oldHistory.length||stable(history.slice(0,oldHistory.length))!==stable(oldHistory))return 'Append supplement corrections without rewriting prior history.';}
 if(r.voided){if(!present(r.voidReason))return 'Explain why the supplement was voided.';continue;}
 if(present(r.approved)||r.status!=='Draft'){const gaps=supplementGaps(r,files,next.buckets||[]);if(gaps.length)return gaps.join(' ');}
 }
 return null;
}
