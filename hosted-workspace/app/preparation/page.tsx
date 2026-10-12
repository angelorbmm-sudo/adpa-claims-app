import { requireChatGPTUser } from '@/app/chatgpt-auth';
import PreparationWorkspace from './workspace';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/preparation');return <PreparationWorkspace/>;}
