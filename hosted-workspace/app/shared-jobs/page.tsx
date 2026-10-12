import {requireChatGPTUser} from '@/app/chatgpt-auth';
import Workspace from './workspace';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const q=await searchParams,p=new URLSearchParams();for(const k of ['companyId','job'])if(typeof q[k]==='string')p.set(k,q[k] as string);if(['Inspection','Shared evidence','Tasks','People & consent'].includes(String(q.tab)))p.set('tab',String(q.tab));await requireChatGPTUser('/shared-jobs'+(p.size?'?'+p.toString():''));return <Workspace/>;}
