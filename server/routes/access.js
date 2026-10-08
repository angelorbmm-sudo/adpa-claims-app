import { Router } from "express";
import { z } from "zod";
import { query, withTransaction } from "../db.js";
import { requirePermission } from "../auth.js";
import { hasPermission } from "../roles.js";
import { validateAccessPlan } from "../../src/lib/accessPlans.js";

const PlanInput = z.object({
  displayName: z.string().trim().min(1).max(120),
  email: z.union([z.string().email().max(254),z.literal("")]).default(""),
  role: z.enum(["admin","licensed_pa","claims_staff","estimator","reviewer","read_only"]),
  licensedAuthority: z.boolean().default(false),
  scope: z.literal("assigned"),
  claimIds: z.array(z.string().min(1).max(200)).max(500),
  status: z.enum(["draft","archived"]),
  notes: z.string().max(2000).default("")
}).strict();
const permissionNames = ["claims:read","claims:write","claims:approve","claims:negotiate","claims:release","compliance:override","documents:read","documents:write","audit:read","users:manage"];
const serialize = row => ({...row.plan_json,id:row.id,createdAt:row.created_at,updatedAt:row.updated_at});

// This router stores proposed accounts ONLY. It never writes user memberships,
// credentials, license records or live claim assignments.
export function createAccessRouter(deps={query,withTransaction}) {
  const router=Router();
  router.get("/me",(req,res)=>{
    if(!req.user) return res.status(401).json({error:"Authentication required."});
    res.json({user:{id:req.user.id,email:req.user.email,displayName:req.user.display_name,organizationId:req.user.organization_id,role:req.user.role},permissions:permissionNames.filter(p=>hasPermission(req.user.role,p)),planningOnly:true});
  });
  router.get("/members",requirePermission("users:manage"),async(req,res,next)=>{
    try{
      const result=await deps.query(`SELECT u.id,u.email,u.display_name,u.is_active,om.role FROM users u JOIN organization_members om ON om.user_id=u.id WHERE om.organization_id=$1 ORDER BY u.display_name,u.email`,[req.user.organization_id]);
      res.json({members:result.rows.map(r=>({id:r.id,email:r.email,displayName:r.display_name,active:r.is_active,role:r.role}))});
    }catch(error){next(error);}
  });
  router.get("/plans",requirePermission("users:manage"),async(req,res,next)=>{
    try{
      const result=await deps.query("SELECT id,plan_json,created_at,updated_at FROM access_account_plans WHERE organization_id=$1 ORDER BY created_at",[req.user.organization_id]);
      res.json({plans:result.rows.map(serialize),planningOnly:true});
    }catch(error){next(error);}
  });
  const save = update => async(req,res,next)=>{
    try{
      const id=update?z.string().uuid().parse(req.params.id):null;
      const plan=PlanInput.parse(req.body);
      const saved=await deps.withTransaction(async client=>{
        const assigned=await client.query("SELECT id FROM claims WHERE organization_id=$1 AND id=ANY($2::text[])",[req.user.organization_id,plan.claimIds]);
        const errors=validateAccessPlan(plan,assigned.rows.map(r=>r.id));
        if(errors.length){const error=new Error(errors.join(" "));error.status=400;throw error;}
        const before=update?await client.query("SELECT plan_json FROM access_account_plans WHERE organization_id=$1 AND id=$2 FOR UPDATE",[req.user.organization_id,id]):{rows:[],rowCount:0};
        if(update&&!before.rowCount){const error=new Error("Access plan not found.");error.status=404;throw error;}
        const result=update
          ? await client.query("UPDATE access_account_plans SET plan_json=$3,updated_by=$4,updated_at=now() WHERE organization_id=$1 AND id=$2 RETURNING id,plan_json,created_at,updated_at",[req.user.organization_id,id,plan,req.user.id])
          : await client.query("INSERT INTO access_account_plans (organization_id,plan_json,created_by,updated_by) VALUES ($1,$2,$3,$3) RETURNING id,plan_json,created_at,updated_at",[req.user.organization_id,plan,req.user.id]);
        const row=result.rows[0];
        await client.query("INSERT INTO audit_events (organization_id,actor_user_id,action,entity_type,entity_id,before_json,after_json,metadata_json) VALUES ($1,$2,$3,'access_plan',$4,$5,$6,$7)",[req.user.organization_id,req.user.id,update?"access_plan.update":"access_plan.create",row.id,before.rows[0]?.plan_json||null,plan,{planningOnly:true,accountActivated:false,invitationSent:false}]);
        return row;
      });
      res.status(update?200:201).json({plan:serialize(saved),planningOnly:true,accountActivated:false,invitationSent:false});
    }catch(error){next(error);}
  };
  router.post("/plans",requirePermission("users:manage"),save(false));
  router.put("/plans/:id",requirePermission("users:manage"),save(true));
  return router;
}
export default createAccessRouter();
