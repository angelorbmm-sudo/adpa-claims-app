import express from "express";
import cors from "cors";
import { config, assertServerConfig } from "./config.js";
import { authenticate } from "./auth.js";
import { storageStatus } from "./storage.js";
import claimsRouter from "./routes/claims.js";
import auditRouter from "./routes/audit.js";
import migrationRouter from "./routes/migration.js";
import documentsRouter from "./routes/documents.js";

assertServerConfig();

const app=express();
app.disable("x-powered-by");
app.use(cors({origin:config.appOrigin,credentials:false}));
app.use(express.json({limit:"2mb"}));

app.get("/health",(req,res)=>res.json({ok:true,service:"adpa-api",storage:storageStatus()}));
app.use("/api",authenticate);
app.use("/api/claims",claimsRouter);
app.use("/api/audit",auditRouter);
app.use("/api/migration",migrationRouter);
app.use("/api/documents",documentsRouter);

app.use((err,req,res,next)=>{
  console.error(err);
  if(err?.name==="ZodError") return res.status(400).json({error:"Invalid request.",details:err.issues});
  res.status(err?.status||500).json({error:err?.status?err.message:"Server error."});
});

app.listen(config.port,()=>console.log(`ADPA API listening on port ${config.port}`));
