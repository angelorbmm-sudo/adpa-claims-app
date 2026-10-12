import { requireChatGPTUser } from '@/app/chatgpt-auth';
import Agreements from './templates';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/agreements');return <Agreements/>;}
