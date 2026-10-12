import {requireChatGPTUser} from '@/app/chatgpt-auth';
import ContentsCompany from './workspace';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const q=await searchParams,p=new URLSearchParams();for(const k of ['companyId','id'])if(typeof q[k]==='string')p.set(k,q[k] as string);if(['Jobs', 'Inventory', 'Work steps', 'Evidence', 'Requests'].includes(String(q.tab)))p.set('tab',String(q.tab));await requireChatGPTUser('/contents-company'+(p.size?'?'+p.toString():''));return <ContentsCompany/>;}
