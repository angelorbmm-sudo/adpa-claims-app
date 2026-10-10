import {requireChatGPTUser} from '@/app/chatgpt-auth';
import CompanyWorkspace from './workspace';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/company');return <CompanyWorkspace/>;}
