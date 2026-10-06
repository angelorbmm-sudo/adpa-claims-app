const base = import.meta.env.VITE_API_BASE_URL || "";

export function apiEnabled(){ return Boolean(base); }

async function request(path, options={}){
  const token = sessionStorage.getItem("adpa-access-token");
  const headers = {"Content-Type":"application/json",...(options.headers||{})};
  if(token) headers.Authorization="Bearer "+token;
  const res=await fetch(base+path,{...options,headers});
  if(!res.ok){
    const body=await res.json().catch(()=>({}));
    throw new Error(body.error||("API request failed: "+res.status));
  }
  return res.json();
}

export async function fetchClaims(){ return request("/api/claims"); }
export async function fetchClaim(id){ return request("/api/claims/"+encodeURIComponent(id)); }
export async function saveClaimRemote(claim){ return request("/api/claims/"+encodeURIComponent(claim.id),{method:"PUT",body:JSON.stringify(claim)}); }
export async function preflightWorkspace(claims){ return request("/api/migration/preflight",{method:"POST",body:JSON.stringify({claims})}); }
export async function importWorkspace(claims,mode="skip_existing"){ return request("/api/migration/workspace",{method:"POST",body:JSON.stringify({claims,mode,confirm:true})}); }
export async function fetchAudit(claimId){ return request("/api/audit/claims/"+encodeURIComponent(claimId)); }

export async function releaseCheck(claimId){ return request("/api/claims/"+encodeURIComponent(claimId)+"/release-check",{method:"POST"}); }
