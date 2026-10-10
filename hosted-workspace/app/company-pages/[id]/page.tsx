import {requireChatGPTUser} from '@/app/chatgpt-auth';
import CompanyPage from './view';
export const dynamic='force-dynamic';
export const metadata={robots:{index:false,follow:false}};
export default async function Page({params}:any){const {id}=await params;await requireChatGPTUser('/company-pages/'+encodeURIComponent(id));return <CompanyPage companyId={id}/>;}
