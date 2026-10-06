import "dotenv/config";

function bool(value, fallback = false) {
  if (value == null || value === "") return fallback;
  return String(value).toLowerCase() === "true";
}

export const config = {
  port: Number(process.env.PORT || 8787),
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  databaseSsl: bool(process.env.DATABASE_SSL, false),
  appOrigin: process.env.APP_ORIGIN || "http://localhost:5173",
  auth: {
    issuer: process.env.AUTH_ISSUER || "",
    audience: process.env.AUTH_AUDIENCE || "",
    jwksUrl: process.env.AUTH_JWKS_URL || "",
    devBypass: bool(process.env.AUTH_DEV_BYPASS, false),
    devUserId: process.env.AUTH_DEV_USER_ID || "",
    devUserEmail: process.env.AUTH_DEV_USER_EMAIL || ""
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER || "disabled",
    bucket: process.env.STORAGE_BUCKET || "",
    region: process.env.STORAGE_REGION || "",
    endpoint: process.env.STORAGE_ENDPOINT || ""
  }
};

export function assertServerConfig() {
  if (!config.databaseUrl) throw new Error("DATABASE_URL is required.");
  if (config.nodeEnv === "production") {
    if (config.auth.devBypass) throw new Error("AUTH_DEV_BYPASS must be false in production.");
    if (!config.databaseSsl) throw new Error("DATABASE_SSL must be true in production.");
    if (!String(config.appOrigin).startsWith("https://")) throw new Error("APP_ORIGIN must use HTTPS in production.");
    if (config.storage.provider === "disabled" || !config.storage.bucket) throw new Error("Private STORAGE_PROVIDER and STORAGE_BUCKET are required in production.");
    if (!config.auth.issuer || !config.auth.audience || !config.auth.jwksUrl) {
      throw new Error("AUTH_ISSUER, AUTH_AUDIENCE and AUTH_JWKS_URL are required in production.");
    }
  }
}
