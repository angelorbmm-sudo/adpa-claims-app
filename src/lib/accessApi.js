import { apiEnabled, apiRequest } from "./api.js";
export const accessConnected = apiEnabled;
export const fetchAccessSession = () => apiRequest("/api/access/me");
export const fetchAccessPlans = () => apiRequest("/api/access/plans");
export const fetchAccessMembers = () => apiRequest("/api/access/members");
const payload = ({displayName,email,role,licensedAuthority,scope,claimIds,status,notes}) => ({displayName,email,role,licensedAuthority,scope,claimIds,status,notes});
export const createAccessPlan = plan => apiRequest("/api/access/plans", {method:"POST",body:JSON.stringify(payload(plan))});
export const updateAccessPlan = plan => apiRequest("/api/access/plans/" + encodeURIComponent(plan.id), {method:"PUT",body:JSON.stringify(payload(plan))});
