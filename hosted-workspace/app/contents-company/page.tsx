import {requireChatGPTUser} from '@/app/chatgpt-auth';
import ContentsCompany from './workspace';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/contents-company');return <ContentsCompany/>;}
