import fs from "node:fs/promises";
import { pool } from "./db.js";
import { assertServerConfig } from "./config.js";

assertServerConfig();

const sql = await fs.readFile(new URL("./schema.sql", import.meta.url), "utf8");
await pool.query(sql);
console.log("ADPA database schema is up to date.");
await pool.end();
