import {requireChatGPTUser} from '@/app/chatgpt-auth';
import Checklist from './checklist';
export const dynamic='force-dynamic';
export const metadata={title:'Ready to begin | ADPA',description:'Current agreements, approvals, first visit and initial tasks.'};
export default async function Page(){await requireChatGPTUser('/job-readiness');return <Checklist/>;}
