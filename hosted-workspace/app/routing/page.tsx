import {requireChatGPTUser} from '@/app/chatgpt-auth';
import RoutingWorkspace from './workspace';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/routing');return <RoutingWorkspace/>;}
