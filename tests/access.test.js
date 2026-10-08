import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import {once} from "node:events";
import {initialAccessPlans,plannedCapabilities,validateAccessPlan} from "../src/lib/accessPlans.js";
import {createAccessRouter} from "../server/routes/access.js";
import {hasPermission} from "../server/roles.js";

test("Jason's initial plan has claim editing and no licensed or administrative authority",()=>{
  const p=initialAccessPlans().find(x=>x.id==="plan-jason");
  assert.equal(p.role,"claims_staff");
  const caps=plannedCapabilities(p);
  assert.ok(caps.includes("claims:write"));
  for(const key of ["claims:approve","claims:release","users:manage"])assert.ok(!caps.includes(key));
  assert.equal(p.status,"draft");
});
test("administration alone does not propose licensed authority",()=>{
  assert.ok(!plannedCapabilities({role:"admin",licensedAuthority:false}).includes("claims:release"));
  assert.ok(plannedCapabilities({role:"admin",licensedAuthority:true}).includes("claims:release"));
});
test("scope and review plans do not propose general claim editing",()=>{
  for(const role of ["estimator","reviewer","read_only"])assert.ok(!plannedCapabilities({role}).includes("claims:write"));
  assert.ok(plannedCapabilities({role:"estimator"}).includes("estimates:write"));
});
test("plan validation rejects activation, unknown roles and unavailable assignments",()=>{
  const p=initialAccessPlans()[1];
  assert.equal(validateAccessPlan(p,[]).length,0);
  assert.ok(validateAccessPlan({...p,status:"active"},[]).length);
  assert.ok(validateAccessPlan({...p,role:"super_admin"},[]).length);
  assert.ok(validateAccessPlan({...p,claimIds:["another-org"]},[]).length);
  assert.ok(validateAccessPlan({...p,licensedAuthority:true},[]).length);
});
test("server Claims Staff role denies account management and PA release",()=>{
  assert.equal(hasPermission("claims_staff","claims:write"),true);
  for(const key of ["claims:approve","claims:release","users:manage"])assert.equal(hasPermission("claims_staff",key),false);
});

async function withServer(role,fn){
  const statements=[];
  const db={query:async(sql,args=[])=>{
    statements.push({sql,args});
    if(sql.startsWith("SELECT id FROM claims"))return {rows:args[1].filter(id=>id==="org-claim").map(id=>({id})),rowCount:1};
    if(sql.startsWith("INSERT INTO access_account_plans"))return {rows:[{id:"e48781d8-18c1-49c8-b278-083ec76f8fc1",plan_json:args[1]}],rowCount:1};
    if(sql.includes("FOR UPDATE"))return {rows:[],rowCount:0};
    return {rows:[],rowCount:0};
  }};
  db.withTransaction=async fn=>fn(db);
  const app=express();
  app.use(express.json());
  app.use((req,res,next)=>{if(role)req.user={id:"actor",organization_id:"org-one",role};next();});
  app.use("/api/access",createAccessRouter(db));
  app.use((err,req,res,next)=>res.status(err.name==="ZodError"?400:err.status||500).json({error:err.message}));
  const server=app.listen(0,"127.0.0.1");
  await once(server,"listening");
  try{await fn("http://127.0.0.1:"+server.address().port,statements);}
  finally{await new Promise(resolve=>server.close(resolve));}
}
const input=()=>{const {id,...p}=initialAccessPlans()[1];return {...p,claimIds:["org-claim"]};};
test("anonymous session and staff administration are denied without database access",async()=>{
  await withServer(null,async(base,sql)=>{assert.equal((await fetch(base+"/api/access/me")).status,401);assert.equal(sql.length,0);});
  await withServer("claims_staff",async(base,sql)=>{
    for(const path of ["members","plans"])assert.equal((await fetch(base+"/api/access/"+path)).status,403);
    assert.equal((await fetch(base+"/api/access/plans",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(input())})).status,403);
    assert.equal(sql.length,0);
  });
});
test("server session reports actual permissions rather than planned privileges",async()=>{
  await withServer("claims_staff",async(base)=>{
    const r=await (await fetch(base+"/api/access/me")).json();
    assert.ok(r.permissions.includes("claims:write"));
    assert.ok(!r.permissions.includes("users:manage"));
    assert.ok(!r.permissions.includes("claims:release"));
    assert.equal(r.user.organizationId,"org-one");
  });
});
test("admin saves only a tenant-scoped audited inactive plan",async()=>{
  await withServer("admin",async(base,sql)=>{
    const r=await fetch(base+"/api/access/plans",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(input())});
    assert.equal(r.status,201);
    const body=await r.json();assert.equal(body.accountActivated,false);assert.equal(body.invitationSent,false);
    assert.equal(body.plan.status,"draft");
    assert.ok(sql.some(x=>x.sql.startsWith("INSERT INTO audit_events")));
    for(const x of sql)assert.equal(x.args[0],"org-one");
    assert.ok(!sql.some(x=>/INSERT INTO users|UPDATE users|INSERT INTO organization_members|UPDATE organization_members|user_licenses/.test(x.sql)));
  });
});
test("plans reject unknown claims, passwords, and live status",async()=>{
  await withServer("admin",async(base,sql)=>{
    for(const p of [{...input(),claimIds:["other-tenant"]},{...input(),password:"not-accepted"},{...input(),status:"active"}]){
      const r=await fetch(base+"/api/access/plans",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)});
      assert.equal(r.status,400);
    }
    assert.ok(!sql.some(x=>x.sql.startsWith("INSERT")));
  });
});
test("foreign plan update returns 404 and cannot grant access",async()=>{
  await withServer("admin",async(base,sql)=>{
    const r=await fetch(base+"/api/access/plans/e48781d8-18c1-49c8-b278-083ec76f8fc1",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(input())});
    assert.equal(r.status,404);
    assert.ok(!sql.some(x=>x.sql.startsWith("UPDATE")||x.sql.startsWith("INSERT")));
  });
});
