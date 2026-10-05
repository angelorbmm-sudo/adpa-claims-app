import { config } from "./config.js";

export function storageStatus() {
  return {
    provider: config.storage.provider,
    configured: config.storage.provider !== "disabled" && Boolean(config.storage.bucket)
  };
}

export async function createUploadIntent() {
  if (config.storage.provider === "disabled") {
    const error = new Error("Private object storage is not configured.");
    error.status = 503;
    throw error;
  }
  const error = new Error("Storage provider adapter must be implemented for the selected provider.");
  error.status = 501;
  throw error;
}
