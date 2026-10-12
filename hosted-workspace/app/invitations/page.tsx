import {requireChatGPTUser} from '@/app/chatgpt-auth';import Hub from './hub';
export const dynamic='force-dynamic';export const metadata={title:'Invitation recovery | ADPA',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const q=await searchParams,p=new URLSearchParams();for(const k of ['kind','id'])if(typeof q[k]==='string')p.set(k,q[k] as string);await requireChatGPTUser('/invitations?'+p.toString());return <Hub/>;}
