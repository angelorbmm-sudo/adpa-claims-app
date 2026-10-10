import {requireChatGPTUser} from '@/app/chatgpt-auth';
import ClientsWorkspace from './workspace';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/company-clients');return <ClientsWorkspace/>;}
