import { query } from "./db.js";

export async function writeAuditEvent({
  actorUserId,
  organizationId,
  claimId = null,
  action,
  entityType,
  entityId = null,
  before = null,
  after = null,
  metadata = {}
}) {
  await query(
    `INSERT INTO audit_events
      (organization_id, actor_user_id, claim_id, action, entity_type, entity_id, before_json, after_json, metadata_json)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [organizationId, actorUserId, claimId, action, entityType, entityId, before, after, metadata]
  );
}
