import {requireChatGPTUser} from '@/app/chatgpt-auth';
import Dashboard from './dashboard';
export const dynamic='force-dynamic';
export const metadata={title:'My Claim | ADPA',description:'Your private claim updates, next steps and shared documents.'};
export default async function Page(){await requireChatGPTUser('/policyholder');return <Dashboard/>;}
