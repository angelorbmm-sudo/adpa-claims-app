import {z} from 'zod';
import {industries,serviceCatalog,classification} from './company-onboarding';
export const draftSchema=z.object({name:z.string().trim().max(200),primaryIndustry:z.enum(industries),industries:z.array(z.enum(industries)).min(1).max(16).refine(v=>new Set(v).size===v.length),serviceIds:z.array(z.string()).max(30).refine(v=>new Set(v).size===v.length&&v.every(id=>serviceCatalog.some(s=>s.id===id))),otherServices:z.array(z.string().trim().min(1).max(120)).max(10),serviceArea:z.string().trim().max(200)}).strict().refine(v=>v.industries.includes(v.primaryIndustry));
export const draftKey=(userId:string,companyId:string)=>'onboarding/'+encodeURIComponent(userId)+'/'+encodeURIComponent(companyId||'new')+'.json';
export function companyChecklist(c:any,facts:any){const p=classification(c.state),link=(path:string)=>path+'?companyId='+encodeURIComponent(c.id);
 return [
 {id:'basics',title:'Confirm your services and service area',status:p.complete&&c.state.onboardingBasics?.serviceArea?'Ready to use':'Needs information',href:'/getting-started?role=company&companyId='+encodeURIComponent(c.id),detail:'Start with what you do and where you work.'},
 {id:'client',title:'Bring in your first client',status:facts.clients?'Ready to use':'Needs information',href:link('/first-job'),detail:'Create the client intake when you are ready to take a job.'},
 {id:'contract',title:'Prepare your own service agreement',status:facts.template?'Ready to use':'Needs information',href:link('/company-clients'),detail:'Add a contract before requesting a signature. Provider-backed sending needs activation.'},
 {id:'job',title:'Join a recovery job',status:facts.jobs?'Ready to use':'Awaiting approval',href:link('/shared-jobs'),detail:'Your signed service agreement and homeowner approval are required.'},
 {id:'staff',title:'Invite your employees when needed',status:'Optional next step',href:link('/company'),detail:'Use staff permissions; never share a login.'},
 {id:'marketing',title:'Prepare your public-facing profile',status:facts.marketing?'Ready to use':'Optional next step',href:link('/marketing'),detail:'Add contact information, hours and branding when you want to market your company.'},
 {id:'providers',title:'Activate signatures, email, texting and calls',status:'Awaiting activation',href:link('/company-clients'),detail:'Jose must configure and test providers. This checklist does not activate them.'}
 ];
}
export function policyholderChecklist(claims:any[],jobs:any[],tasks:any[]){return [
 {id:'access',title:'Review your workspace invitations',status:claims.some(c=>!c.accepted)||jobs.some(j=>j.needsHomeownerAcceptance)?'Needs your review':claims.length||jobs.length?'Ready to use':'Awaiting invitation',href:'/policyholder',detail:'Confirm the property and invitation. Workspace acceptance is not a service contract.'},
 {id:'requests',title:'Complete your next claim request',status:tasks.length?'Needs information':'No current request',href:'/policyholder',detail:tasks[0]?.title||'ADPA will ask for documents when they are needed.'},
 {id:'companies',title:'Choose and approve your recovery companies',status:jobs.length?'Available to review':'Awaiting invitation',href:'/shared-jobs',detail:'Each company has its own agreement. You choose who joins and what evidence they can see.'},
 {id:'updates',title:'Check updates and talk to your team',status:jobs.some(j=>!j.needsHomeownerAcceptance)||claims.some(c=>c.accepted)?'Ready to use':'Awaiting invitation',href:'/policyholder',detail:'Read claim updates and use authorized in-app conversations. Live external channels await activation.'}
 ];}
