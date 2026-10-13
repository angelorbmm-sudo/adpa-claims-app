// A confirmed write and its subsequent screen refresh are separate outcomes.
export async function saveThenRefresh(send:()=>Promise<any>,committed:(receipt:any)=>void,refresh:(receipt:any)=>Promise<void>){
 let receipt:any;try{receipt=await send();}catch(e){return {saved:false,refreshed:false,error:(e as Error).message};}
 committed(receipt);try{await refresh(receipt);return {saved:true,refreshed:true,error:''};}catch(e){return {saved:true,refreshed:false,error:(e as Error).message};}
}
