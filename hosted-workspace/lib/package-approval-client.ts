export async function connectPackageApproval<T>(write:()=>Promise<T>,saved:(value:T)=>void,refresh:()=>Promise<void>){
 let value:T;try{value=await write();}catch(e){return {saved:false,error:e instanceof Error?e.message:'Approval connection could not be confirmed. Keep your entries and refresh approval status before retrying.'};}
 saved(value);try{await refresh();return {saved:true};}catch{return {saved:true,error:'Approval connection saved successfully, but refreshing package facts failed. Refresh saved facts before continuing. Nothing sent.'};}
}
