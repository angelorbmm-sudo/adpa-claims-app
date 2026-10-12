import {requireChatGPTUser} from '@/app/chatgpt-auth';import Guide from './guide';
export const dynamic='force-dynamic';export const metadata={title:'Start my first job | ADPA',description:'Client, agreement, invitation and recovery workspace.'};
export default async function Page(){await requireChatGPTUser('/first-job');return <Guide/>;}
