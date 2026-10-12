from pathlib import Path
import json
s=Path('source/workspace-template.html').read_text()
s=s.replace('<span class="adpa-badge">Interactive prototype · Sample data</span>','<span class="adpa-badge">Private working version</span><a href="/" style="color:var(--adpa-blue)">Saved claims</a><button class="adpa-primary" type="button" id="adpa-save-claim" disabled>Save claim</button><span id="adpa-save-state" class="adpa-small" role="status">Loading claim…</span>')
s=s.replace('<button class="cursor-interaction" data-view="import" aria-current="page">HomeBack import</button>','').replace('data-view="manual">Manual intake','data-view="manual">Claim details')
s=s.replace('Sample records only · No live HomeBack connection · No carrier submission · Changes last for this preview session','Save claim to retain changes · No live HomeBack, email, text, or ESX connection · No carrier submission')
s=s.replace('Enter fictional information for this preview.','Update the policyholder and loss details for this claim.')
s=s.replace('Start directly with ADPA','Claim details').replace('Create manual sample claim','Update claim details').replace('Sample client','Policyholder').replace('Example address','Property address')
s=s.replace('Enter sample information only. Prices and evidence entered here are not independently verified.','Entered prices and evidence references require verification. File uploads are planned.')
s=s.replace('Record fictional communications only. This form logs a message; it does not send one. Follow-ups are entered manually in this version.','This form logs a conversation; it does not send a message. Follow-ups are entered manually in this version.')
s=s.replace('These are sample accounting fields.','Record the amounts supported by this claim’s documents.')
s=s.replace('Sample Adjuster','Adjuster').replace('Sample adjuster or client','Adjuster or client').replace('Sample recipient','Recipient').replace('Sample Home Store','Home Store')
s=s.replace('Add sample item','Add item').replace('Prepare sample summary','Prepare review summary').replace('Sample review summary','Claim review summary').replace('Save sample amounts','Update amounts').replace('Add to sample timeline','Add to timeline')
s=s.replace('Carrier sample value:','Carrier value:').replace('Accept sample value','Accept reviewed value').replace('Your decision applies to this sample item only.','Your decision applies to this item only.')
s=s.replace('No draft selected. Approval does not send a message.','No draft selected. Approval does not send a message.')
s=s.replace("const root=document.getElementById('adpa-prototype');", "const root=document.getElementById('adpa-prototype');\nlet claimExtra={},claimProfile={},claimVersion=0,claimId=new URLSearchParams(location.search).get('id'),dirty=false,loadingClaim=true;")
lines=s.splitlines()
for i,line in enumerate(lines):
 if line.startswith("q('#adpa-manual-form').addEventListener"):
  lines[i]="""q('#adpa-manual-form').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget.elements;if(!f.policyholder.value.trim()||!f.address.value.trim())return;claimProfile={...claimProfile,name:f.policyholder.value.trim(),address:f.address.value.trim(),carrier:f.carrier.value,policy:f.policy.value,lossDate:f.lossDate.value,loss:f.loss.value};applyProfile();markDirty();q('#adpa-feedback').textContent='Claim details updated. Save claim to retain them.';view('overview');});"""
s='\n'.join(lines)
s=s.replace('${i.state}', '${safe(i.state)}')
s=s.replace("+': '+state+'.';render();", "+': '+state+'.';render();markDirty();")
s=s.replace("sample accounting saved.';", "accounting updated. Save claim to retain changes.';markDirty();")
s=s.replace("e.currentTarget.reset();});", "e.currentTarget.reset();markDirty();});")
s=s.replace("renderComms()});row.append", "renderComms();markDirty()});row.append")
s=s.replace("draft.subject);renderComms();}", "draft.subject);renderComms();markDirty();}")
s=s.replace("e.currentTarget.elements.timestamp.value='2026-10-02T09:00';});", "e.currentTarget.elements.timestamp.value=pacificNow();markDirty();});")
# Bound entries remain in the real claim; preview data only initializes before async load.
extra=r'''
function pacificNow(){const p=new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date());return p.replace(' ','T');}
function markDirty(){if(loadingClaim)return;dirty=true;q('#adpa-save-state').textContent='Unsaved changes';q('#adpa-save-claim').disabled=false;}
function applyProfile(){const panel=q('[data-panel=overview]');panel.querySelector('h1').textContent=claimProfile.name||'Claim';panel.querySelector('h1 + p').textContent=claimProfile.address||'';panel.querySelector('h1').previousElementSibling.textContent='CLAIM / '+(claimProfile.loss||'LOSS DETAILS');q('#adpa-snapshot').textContent='Claim source: '+(claimProfile.source||'Manual intake')+'. HomeBack integration is planned.';const readiness=panel.querySelector('.adpa-grid .adpa-box');readiness.replaceChildren();const h=document.createElement('h2');h.textContent='Claim readiness';readiness.append(h);for(const text of ['Claim number · '+(claimProfile.claimNumber||'Needs confirmation'), 'Policyholder and address · '+(claimProfile.source||'Entered manually'),'Insurance company · '+(claimProfile.carrier||'Needs confirmation'),'Policy number · '+(claimProfile.policy||'Needs confirmation'),'Date of loss · '+(claimProfile.lossDate||'Needs confirmation'),'Representation agreement · '+(claimProfile.representation||'Needs confirmation')]){const p=document.createElement('p');p.textContent=text;readiness.append(p);}panel.querySelector('.adpa-box:last-child h2').textContent='Claim records';panel.querySelector('.adpa-box:last-child .adpa-fields div:first-child').textContent='Policyholder and property details entered in ADPA';q('#adpa-inventory-summary').textContent=items.length+' inventory records';q('#adpa-evidence-summary').textContent='Evidence references only; file uploads are planned';const f=q('#adpa-manual-form').elements;for(const [key,value] of Object.entries({policyholder:claimProfile.name,address:claimProfile.address,carrier:claimProfile.carrier,policy:claimProfile.policy,lossDate:claimProfile.lossDate,loss:claimProfile.loss}))f[key].value=value||'';}
function snapshot(){if(draft&&currentMessage!==null){savedDrafts[currentMessage]={...draft,to:q('#adpa-draft-to').value,subject:q('#adpa-draft-subject').value,body:q('#adpa-draft-body').value};}return {...claimExtra,profile:claimProfile,items,buckets,communications,commTasks,commAudit,savedDrafts,includeEvidence};}
function hydrate(data){const state=data.state||{};claimExtra={...state};claimVersion=data.version;claimProfile={...(state.profile||{}),name:data.name,address:data.address};items=state.items||[];selected=0;imported=true;includeInventory=true;includeEvidence=!!state.includeEvidence;for(let n=0;n<Math.max(5,state.buckets?.length||0);n++){if(!buckets[n])buckets[n]={name:state.buckets?.[n]?.name||'Additional coverage',limit:'',requested:'',carrier:'',issued:'',received:'',depreciation:'',notes:''};if(state.buckets?.[n])Object.assign(buckets[n],state.buckets[n]);}communications=state.communications||[];commTasks=state.commTasks||[];commAudit=state.commAudit||[];savedDrafts=state.savedDrafts||{};currentMessage=null;draft=null;applyProfile();render();renderBuckets();renderComms();renderClaimNotes();loadEvidence();q('#adpa-log-message').elements.timestamp.value=pacificNow();view(['overview','communications','buckets','inventory','evidence'].includes(new URLSearchParams(location.search).get('view'))?new URLSearchParams(location.search).get('view'):'overview');loadingClaim=false;dirty=false;q('#adpa-save-state').textContent='Saved · '+new Date(data.updated).toLocaleString('en-US',{timeZone:'America/Los_Angeles'})+' Pacific';q('#adpa-save-claim').disabled=false;}
root.addEventListener('input',markDirty);root.addEventListener('change',markDirty);
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
q('#adpa-save-claim').addEventListener('click',async()=>{q('#adpa-save-claim').disabled=true;q('#adpa-save-state').textContent='Saving…';try{const r=await fetch('/api/claims?id='+encodeURIComponent(claimId),{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:claimProfile.name,address:claimProfile.address,state:snapshot(),version:claimVersion})});const d=await r.json();if(!r.ok)throw Error(d.error||'Save failed');claimVersion=d.version;dirty=false;q('#adpa-save-state').textContent='Saved · '+new Date(d.updated).toLocaleTimeString('en-US',{timeZone:'America/Los_Angeles'})+' Pacific';}catch(e){q('#adpa-save-state').textContent=e.message||'Could not save; your changes remain here.';q('#adpa-save-state').setAttribute('role','alert');}finally{q('#adpa-save-claim').disabled=false;}});
(async()=>{try{if(!claimId)throw Error('Select a claim from Saved claims.');const r=await fetch('/api/claims?id='+encodeURIComponent(claimId));const data=await r.json();if(!r.ok)throw Error(data.error||'Could not load claim.');hydrate(data);}catch(e){root.querySelector('main').replaceChildren();const p=document.createElement('p');p.setAttribute('role','alert');p.textContent=e.message||'Could not load claim. Please reopen it from Saved claims.';root.querySelector('main').append(p);root.querySelectorAll('nav button').forEach(b=>b.disabled=true);q('#adpa-save-state').textContent='Claim unavailable';}})();
'''
s=s.replace('render();\n})();', 'render();\n'+extra+'\n})();')
s=s.replace('Preview session only','Private claim file').replace('Nothing has been sent.','Nothing has been sent.').replace('Sample claim','Claim')
# Files stay in private object storage rather than being embedded in claim JSON.
s=s.replace('<button class="cursor-interaction" data-view="communications">', '<button class="cursor-interaction" data-view="evidence">Documents &amp; evidence</button><button class="cursor-interaction" data-view="communications">')
s=s.replace('<section data-panel="communications" hidden>',Path('source/evidence-panel.html').read_text()+'<section data-panel="communications" hidden>')
s=s.replace("if(name==='communications')renderComms();","if(name==='communications')renderComms();if(name==='evidence')loadEvidence();")
s=s.replace('function pacificNow()',Path('source/evidence-client.js').read_text()+'\nfunction pacificNow()')
s=s.replace('Evidence references only; file uploads are planned','Open Documents & evidence for stored files')
s=s.replace('Entered prices and evidence references require verification. File uploads are planned.','Entered prices require verification. Store supporting files in Documents & evidence.')
s=s.replace("money(i.value)","(i.value==null?'Not valued':money(i.value))")
s=s.replace("i.source==='Manual'?'Manual replacement price':'LifeWorth reference'","i.source==='Manual'?'Manual replacement price':'Imported value — requires verification'")
# Agreements reuse saved claim state; templates remain in the owner library.
s=s.replace('<button class="cursor-interaction" data-view="evidence">','<button class="cursor-interaction" data-view="agreements">Agreements</button><button class="cursor-interaction" data-view="evidence">')
s=s.replace('<section data-panel="communications" hidden>',Path('source/agreements-panel.html').read_text()+'<section data-panel="communications" hidden>')
s=s.replace("function pacificNow()",Path('source/agreements-client.js').read_text()+'\nfunction pacificNow()')
s=s.replace("if(name==='evidence')loadEvidence();","if(name==='evidence')loadEvidence();if(name==='agreements')loadAgreements();")
s=s.replace("'inventory','evidence'].includes", "'inventory','evidence','agreements'].includes")
# Recovery modules use claim JSON and retain source-linked record revisions.
s=s.replace('<button class="cursor-interaction" data-view="agreements">','<button class="cursor-interaction" data-view="supplements">Supplements &amp; disputes</button><button class="cursor-interaction" data-view="mortgage">Mortgage &amp; draws</button><button class="cursor-interaction" data-view="agreements">')
s=s.replace('<section data-panel="agreements" hidden>',Path('source/recovery-panel.html').read_text()+'<section data-panel="agreements" hidden>')
s=s.replace("function pacificNow()",Path('source/recovery-client.js').read_text()+'\nfunction pacificNow()')
s=s.replace("if(name==='agreements')loadAgreements();","if(name==='agreements')loadAgreements();if(name==='supplements'||name==='mortgage')loadRecovery();")
s=s.replace("'evidence','agreements'].includes", "'evidence','agreements','supplements','mortgage'].includes")
# Root is full responsive document rather than conversation-only chrome.
s=s.replace('padding:20px 110px 20px 24px','padding:20px 24px').replace('id="adpa-prototype">','id="adpa-prototype" style="max-width:1200px;margin:auto">',1)
s=s.replace('border-radius:14px;overflow:hidden','border-radius:14px;overflow:hidden;overflow-wrap:anywhere')
html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>ADPA Claim Workspace</title><link rel="icon" href="/favicon.svg"><style>body{margin:0;padding:12px;font-family:system-ui;background:light-dark(#f3f6fa,#101822);color-scheme:light dark}button{cursor:pointer}a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid #86b8ff;outline-offset:3px}</style></head><body>'+s+'</body></html>'
Path('app/workspace-html.ts').write_text('export const workspaceHTML = '+json.dumps(html)+';\n')
Path('.sites-runtime/workspace-test.html').write_text(html)
