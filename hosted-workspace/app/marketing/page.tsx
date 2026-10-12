import {requireChatGPTUser} from '@/app/chatgpt-auth';
import Workspace from './workspace';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const q=await searchParams,p=new URLSearchParams();for(const k of ['companyId'])if(typeof q[k]==='string')p.set(k,q[k] as string);await requireChatGPTUser('/marketing'+(p.size?'?'+p.toString():''));return <Workspace/>;}
