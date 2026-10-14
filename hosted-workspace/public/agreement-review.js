const stable=v=>Array.isArray(v)?'['+v.map(stable).join(',')+']':v&&typeof v==='object'?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}':JSON.stringify(v)??'null';
export const agreementFileKey=f=>stable(Object.fromEntries(['id','filename','mime','size','category','created'].map(k=>[k,f[k]??null])));
export const agreementTemplateKey=t=>stable(Object.fromEntries(['id','title','revision','kind','filename','mime','size','created'].map(k=>[k,t[k]??null])));
export const agreementContext=s=>Object.fromEntries(['name','address','carrier','claimNumber'].map(k=>[k,s.profile?.[k]??'']));
export const agreementReviewKey=(p,state,files)=>stable({title:p.title,templateId:p.templateId,templateKey:p.templateKey,templateTitle:p.templateTitle,templateRevision:p.templateRevision,fileId:p.fileId,fileKey:(()=>{const f=files.find(f=>f.id===p.fileId);return f?agreementFileKey(f):null;})(),signers:p.signers,reviewLocator:p.reviewLocator,notes:p.notes||'',claim:agreementContext(state)});
const statuses=['Draft — needs your review','Approved for signature preparation','Cancelled — retained in history'];
export function agreementGaps(p,state,files=[],templates=null){
 if(p.status==='Cancelled — retained in history')return p.cancelReason?.trim()?[]:['Record why this preparation packet was cancelled.'];
 const gaps=[],add=x=>gaps.push(x),file=files.find(f=>f.id===p.fileId),t=templates?.find(t=>t.id===p.templateId);
 if(!p.title?.trim()||!statuses.includes(p.status))add('Record packet title and preparation status; this record cannot establish signature completion.');
 if(!p.templateId||!p.templateTitle||!p.templateRevision||!p.templateKey||templates&&(!t||t.kind==='Claim-specific reference'||p.templateKey!==agreementTemplateKey(t)||p.templateTitle!==t.title||p.templateRevision!==t.revision))add('Retain the exact selected ADPA template version and its original metadata.');
 if(!Array.isArray(p.signers)||!p.signers.length||p.signers.length>10)add('Record one to ten named signers.');else{const emails=new Set();for(const signer of p.signers){const email=String(signer.email||'').trim().toLowerCase();if(!signer.name?.trim()||signer.name.length>150||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||emails.has(email))add('Signer names and valid distinct email addresses are required.');emails.add(email);}}
 if(!file||file.mime!=='application/pdf')add('Select the final agreement PDF stored in this claim.');
 if(!p.reviewLocator?.trim())add('Record the final PDF pages or signature-section locator checked.');
 if(p.status!=='Approved for signature preparation')add('Packet remains a preparation draft requiring final document and signer review.');
 if(p.status==='Approved for signature preparation'&&(p.reviewed!==true||p.reviewSnapshot!==agreementReviewKey(p,state,files)))add('Preparation review is missing or stale; inspect the current PDF, signers and claim details.');
 return [...new Set(gaps)];
}
export function agreementFindings(state,files=[]){const packets=state.agreements||[];return packets.filter(p=>!packets.some(n=>n.parentId===p.id)).flatMap(p=>agreementGaps(p,state,files).map(g=>'Agreement '+(p.title||p.id)+': '+g));}
export function agreementStateError(previous,next,files=[],templates=[]){
 const rows=next.agreements||[],prior=previous?.agreements||[];if(stable(rows)===stable(prior))return null;
 if(!Array.isArray(rows)||rows.length>100)return 'Invalid or oversized agreement preparation records.';
 if(prior.some(p=>!rows.some(r=>r.id===p.id)))return 'Preserve earlier agreement packets; cancel or add a revised packet instead of deleting them.';
 const ids=new Set();for(const p of rows){if(!p?.id||ids.has(p.id))return 'Agreement packet IDs must be present and unique.';ids.add(p.id);const old=prior.find(o=>o.id===p.id);if(old){if(stable(old)===stable(p))continue;const {status,cancelReason,history,...facts}=p,{status:oldStatus,cancelReason:oldReason,history:oldHistory,...oldFacts}=old;if(status!=='Cancelled — retained in history'||!cancelReason?.trim()||stable(facts)!==stable(oldFacts)||!Array.isArray(history)||history.length<=(oldHistory||[]).length||stable(history.slice(0,(oldHistory||[]).length))!==stable(oldHistory||[]))return 'Keep packet facts immutable. Add a revision, or cancel with a reason and appended history.';continue;}
 if(!statuses.includes(p.status)||p.status==='Cancelled — retained in history')return 'Agreement preparation cannot record sent, delivered, signed or completed status.';
 for(const k of ['title','notes','reviewLocator','correctionReason'])if(p[k]!=null&&(typeof p[k]!=='string'||p[k].length>2000))return 'Agreement packet text exceeds supported size.';
 if(!p.title?.trim())return 'Record the agreement packet title.';
 const t=templates.find(t=>t.id===p.templateId);if(!t||t.kind==='Claim-specific reference'||p.templateKey!==agreementTemplateKey(t)||p.templateTitle!==t.title||p.templateRevision!==t.revision)return 'Choose an unchanged ADPA template version from your library.';
 if(p.fileId&&!files.some(f=>f.id===p.fileId&&f.mime==='application/pdf'))return 'Final agreement PDFs must belong to this claim.';
 if(!Array.isArray(p.signers)||!p.signers.length||p.signers.length>10)return 'Record named signers.';const emails=p.signers.map(s=>String(s.email||'').trim().toLowerCase());if(new Set(emails).size!==emails.length||p.signers.some((s,n)=>typeof s.name!=='string'||!s.name.trim()||s.name.length>150||emails[n].length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emails[n])))return 'Use named signers with valid distinct emails.';
 if(p.parentId){const parent=prior.find(o=>o.id===p.parentId);if(!parent||p.revision!==(parent.revision||1)+1||!p.correctionReason?.trim()||rows.some(n=>n.id!==p.id&&n.parentId===p.parentId))return 'Revise the current packet once, with its next revision and a correction reason.';}else if(p.revision!==1)return 'A new packet starts at revision one.';
 if(rows.some(n=>n.id!==p.id&&!rows.some(child=>child.parentId===n.id)&&n.status!=='Cancelled — retained in history'&&p.fileId&&n.fileId===p.fileId&&stable((n.signers||[]).map(s=>String(s.email).trim().toLowerCase()))===stable(emails)))return 'An active preparation packet already uses this final PDF and signer list.';
 if(p.status==='Approved for signature preparation'){const gaps=agreementGaps(p,next,files,templates);if(gaps.length)return gaps.join(' ');}
 }
 return null;
}
