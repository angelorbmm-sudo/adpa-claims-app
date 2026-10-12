import {requireChatGPTUser} from '@/app/chatgpt-auth';
import Jobs from './jobs';
export const dynamic='force-dynamic';export const metadata={title:'My jobs | ADPA',description:'Your company’s jobs, next tasks, visits and assigned work tools.'};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const q=await searchParams;await requireChatGPTUser('/company-jobs'+(typeof q.companyId==='string'?'?companyId='+encodeURIComponent(q.companyId):''));return <Jobs/>;}
