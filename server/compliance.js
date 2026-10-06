import { query } from "./db.js";

// Server-side gate for future material regulated actions (negotiation/release/send).
// Do not rely on the browser's compliance status for authorization.
export async function requireVerifiedPALicenseForClaim(req,res,next){
  try{
    const claimId=req.params.id||req.params.claimId;
    if(!claimId)return res.status(400).json({error:"Claim id required for licensed action."});
    const claim=await query("SELECT jurisdiction FROM claims WHERE id=$1 AND organization_id=$2",[claimId,req.user.organization_id]);
    if(!claim.rowCount)return res.status(404).json({error:"Claim not found."});
    const jurisdiction=claim.rows[0].jurisdiction;
    if(!jurisdiction)return res.status(409).json({error:"Claim jurisdiction must be verified before regulated action."});
    const license=await query(
      "SELECT status,expires_on,license_number FROM user_licenses WHERE user_id=$1 AND jurisdiction=$2 AND license_type='public_adjuster' LIMIT 1",
      [req.user.id,jurisdiction]
    );
    const row=license.rows[0];
    const expired=row?.expires_on && new Date(row.expires_on+"T23:59:59").getTime()<Date.now();
    if(!row||row.status!=="verified"||expired){
      return res.status(403).json({error:"Verified active public-adjuster license required for this claim jurisdiction.",jurisdiction});
    }
    req.verifiedPALicense={jurisdiction,licenseNumber:row.license_number,expiresOn:row.expires_on};
    next();
  }catch(e){next(e);}
}
