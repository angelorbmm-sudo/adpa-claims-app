/** A confirmed write remains successful even when refreshing the screen fails. */
export async function saveRoutingReview(write:()=>Promise<void>,confirmed:()=>void,refresh:()=>Promise<void>){await write();confirmed();try{await refresh();return {saved:true,refreshError:''};}catch(e){return {saved:true,refreshError:(e as Error).message||'Saved facts could not be refreshed.'};}}
