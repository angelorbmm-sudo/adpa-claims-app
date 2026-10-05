import { createRemoteJWKSet, jwtVerify } from "jose";
import { config } from "./config.js";
import { query } from "./db.js";
import { hasPermission } from "./roles.js";

let jwks;

async function resolveMembership(userId) {
  const result = await query(
    `SELECT u.id, u.email, u.display_name, om.organization_id, om.role
       FROM users u
       JOIN organization_members om ON om.user_id = u.id
      WHERE u.id = $1 AND u.is_active = true
      LIMIT 1`,
    [userId]
  );
  return result.rows[0] || null;
}

export async function authenticate(req, res, next) {
  try {
    if (config.auth.devBypass && config.nodeEnv !== "production") {
      const id = req.header("x-adpa-dev-user") || config.auth.devUserId;
      if (!id) return res.status(401).json({ error: "Development user not configured." });
      const member = await resolveMembership(id);
      if (!member) return res.status(403).json({ error: "Development user has no active membership." });
      req.user = member;
      return next();
    }

    const header = req.header("authorization") || "";
    if (!header.startsWith("Bearer ")) return res.status(401).json({ error: "Missing bearer token." });
    if (!config.auth.jwksUrl || !config.auth.issuer || !config.auth.audience) {
      return res.status(503).json({ error: "Authentication provider is not configured." });
    }
    if (!jwks) jwks = createRemoteJWKSet(new URL(config.auth.jwksUrl));
    const token = header.slice(7);
    const verified = await jwtVerify(token, jwks, {
      issuer: config.auth.issuer,
      audience: config.auth.audience
    });
    const userId = verified.payload.sub;
    if (!userId) return res.status(401).json({ error: "Token subject is missing." });
    const member = await resolveMembership(userId);
    if (!member) return res.status(403).json({ error: "User has no active ADPA membership." });
    req.user = member;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed." });
  }
}

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user || !hasPermission(req.user.role, permission)) {
      return res.status(403).json({ error: "Insufficient permission." });
    }
    next();
  };
}
