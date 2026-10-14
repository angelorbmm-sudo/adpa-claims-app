export async function savePackageDraft(write:()=>Promise<{id:string}>,saved:(id:string)=>void,refresh:(id:string)=>Promise<void>){
 let id:string;try{id=(await write()).id;if(!id)throw Error('No saved package ID was returned. Retry with the same request.');}catch(e){return {saved:false,error:e instanceof Error?e.message:'Package could not be saved.'};}
 saved(id);try{await refresh(id);return {saved:true,id};}catch{return {saved:true,id,error:'Package saved successfully, but refreshing its preview failed. Refresh saved facts and open the saved package. Nothing was sent.'};}
}
