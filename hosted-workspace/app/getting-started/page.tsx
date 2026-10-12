import {requireChatGPTUser} from '@/app/chatgpt-auth';
import Guide from './guide';
export const dynamic='force-dynamic';
export const metadata={title:'Get started | ADPA',description:'Your next step, with only the information needed now.'};
export default async function Page(){await requireChatGPTUser('/getting-started');return <Guide/>;}
