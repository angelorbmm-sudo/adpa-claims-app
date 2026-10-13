// Accept only the already-authorized shared-job projection. This is not an access grant.
export function informationChecklist(job:any,role:string,today:string){
 const name=(id:string)=>id==='homeowner'?'Policyholder':id==='adpa'?'ADPA':job.companies?.find((c:any)=>c.companyId===id)?.name||'Former participant';
 const rows=(job.inbox?.missingEvidence||[]).filter((r:any)=>role==='adpa'||r.createdRole===role||r.assignedRole===role).map((r:any)=>{
  const closed=['Complete','Cancelled'].includes(r.status),paused=!closed&&!r.active;
  const mine=!closed&&!paused&&(r.status==='Requested'?r.assignedRole===role:['Uploaded','Needs review'].includes(r.status)&&r.createdRole===role);
  return {id:'evidence:'+r.id,title:r.title,detail:r.label,assigned:name(r.assignedRole),due:r.due||'',status:r.displayStatus||r.status,closed,paused,mine,overdue:!closed&&!paused&&!!r.due&&r.due<today,kind:'Evidence request',next:closed?'Recorded history retained':paused?'Restore evidence access or ask the requester to revise this request':r.status==='Requested'?'Upload the requested original and submit it for review':'Requester reviews the uploaded original',tab:'Shared evidence'};
 });
 for(const t of job.tasks||[]){if(role!=='adpa'&&t.companyId!==role)continue;const closed=['Complete','Completed','Cancelled','Done'].includes(t.status);rows.push({id:'task:'+t.id,title:t.title,detail:t.note||'',assigned:name(t.companyId),due:t.due||'',status:t.stage||t.status||'Open',closed,paused:false,mine:!closed&&t.companyId===role,overdue:!closed&&!!t.due&&t.due<today,kind:t.kind==='Inspection question'?'Inspection question':'Company task',next:closed?'Recorded history retained':t.kind==='Inspection question'?'Open the inspection question and review the recorded answer':'Open the company task and record its progress',tab:t.kind==='Inspection question'?'Inspection':'Tasks'});}
 return rows.sort((a:any,b:any)=>Number(a.closed)-Number(b.closed)||Number(b.mine)-Number(a.mine)||Number(b.overdue)-Number(a.overdue)||(a.due||'9999').localeCompare(b.due||'9999')||a.title.localeCompare(b.title));
}
