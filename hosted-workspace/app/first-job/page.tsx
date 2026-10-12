import {requireChatGPTUser} from '@/app/chatgpt-auth';import Guide from './guide';
export const dynamic='force-dynamic';export const metadata={title:'Start my first job | ADPA',description:'Client, agreement, invitation and recovery workspace.'};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const q=await searchParams,p=new URLSearchParams();for(const k of ['companyId', 'clientId'])if(typeof q[k]==='string')p.set(k,q[k] as string);await requireChatGPTUser('/first-job'+(p.size?'?'+p.toString():''));return <Guide/>;}
