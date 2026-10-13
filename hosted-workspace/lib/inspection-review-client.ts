// Preserve the observation time in the device-local datetime editor; saved correction time remains separate.
export function inspectionLocalTime(value:string){const d=new Date(value);if(!Number.isFinite(d.getTime()))return '';return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,23);}
