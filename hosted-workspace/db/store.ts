import { env } from 'cloudflare:workers';
export function database(){if(!env.DB)throw new Error('Claim storage unavailable');return env.DB;}
export function files(){const binding=(env as unknown as {FILES?:R2Bucket}).FILES;if(!binding)throw new Error('Evidence storage unavailable');return binding;}
