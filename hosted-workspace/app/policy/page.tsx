import {requireChatGPTUser} from '@/app/chatgpt-auth';
import PolicyWorkspace from './workspace';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/policy');return <PolicyWorkspace/>;}
