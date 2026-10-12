import {requireChatGPTUser} from '@/app/chatgpt-auth';
import CompanyWorkspace from './workspace';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const q=await searchParams,p=new URLSearchParams();for(const k of ['companyId','id'])if(typeof q[k]==='string')p.set(k,q[k] as string);if(['Overview', 'Tasks & requests', 'Evidence', 'Daily field visits', 'Equipment review', 'Material decisions', 'Field & scope', 'Messages', 'Billing'].includes(String(q.tab)))p.set('tab',String(q.tab));await requireChatGPTUser('/company'+(p.size?'?'+p.toString():''));return <CompanyWorkspace/>;}
