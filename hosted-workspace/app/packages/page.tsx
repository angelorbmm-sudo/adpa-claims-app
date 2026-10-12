import {requireChatGPTUser} from '@/app/chatgpt-auth';
import PackageWorkspace from './workspace';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/packages');return <PackageWorkspace/>;}
