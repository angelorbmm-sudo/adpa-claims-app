import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {PORTAL_OWNER} from '@/lib/policyholder';
import Review from './review';
export const dynamic='force-dynamic';export const metadata={title:'Onboarding review | ADPA',description:'Setup progress, blockers and follow-up ownership.',robots:{index:false,follow:false}};
export default async function Page(){const actor=await requireChatGPTUser('/onboarding-review');if(actor.userId!==PORTAL_OWNER)return <main style={{padding:40}}><h1>ADPA owner access required</h1><p>This internal review contains onboarding records and follow-up notes.</p><a href="/getting-started">Open your setup checklist</a></main>;return <Review/>;}
