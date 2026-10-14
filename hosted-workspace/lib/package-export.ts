// Package projections carry current source facts, not internal correction/audit snapshots.
export const exportPick=(r:Record<string,any>,fields:string[])=>Object.fromEntries(fields.filter(k=>r[k]!==undefined).map(k=>[k,r[k]]));
const base=['id','documentId','locator','createdAt','updatedAt'];
const care:Record<string,string>={
 items:'tag room description brand model serial material unit status currentLocation sourceReportId authorizationDocumentId authorizationLocator specialistReviewer specialistDocumentId specialistLocator repairDocumentId repairLocator reviewer countBasis priorCondition lossDamage reason quantity disposition specialistNeeded',
 cleaning:'itemId material contractor result reviewer beforeDocumentId beforeLocator afterDocumentId afterLocator method compatibilityBasis remainingDamage',
 custody:'itemId event from to person containerId returnReviewer readinessDocumentId readinessLocator acceptanceNotes quantity observedAt',
 storage:'periodType containerId location unit billingBasis extensionReason startedAt endedAt billedUnits extension',
 invoices:'contractor invoiceNumber invoiceLine status serviceType itemId cleaningId custodyId storageId paymentDocumentId paymentLocator workKey unit priceSourceDocumentId priceSourceLocator supersedesId billingBasis relationshipBasis priceBasis voidReason amount approvedAmount issuedAmount receivedAmount quantity unitPrice voided',
 reportVersions:'inventoryGroupId format sourceClaimNumber versionBasis'
};
const mitigation:Record<string,string>={
 zones:'name material disposition pointId instrument method units dryGoal goalBasis addedAfterInitial changeReason',
 readings:'zoneId observedAt pointId material instrument method units value temperature temperatureUnits rh',
 equipment:'zoneId label count startedAt removedAt needBasis billedUnitDays billingBasis photoDocumentId photoLocator',
 scope:'zoneId description operation quantity unit length height reason photoDocumentId photoLocator',
 cleaning:'zoneId kind material method rationale contractor result reviewer remainingDamage product registrationReview specialistBasis beforeDocumentId beforeLocator afterDocumentId afterLocator labelDocumentId labelLocator sdsDocumentId sdsLocator',
 contents:'zoneId description quantity disposition reason status currentLocation authorizationDocumentId authorizationLocator',
 custody:'itemId event quantity observedAt from to person',
 hazards:'type status reviewer dispositionNotes',
 invoices:'contractor serviceType invoiceLine amount coverage coverageBasis scopeId equipmentId cleaningId custodyId'
};
export function exportWorkstream(r:Record<string,any>,kind:string,stream:'care'|'mitigation'){return {recordType:kind,...exportPick(r,[...base,...((stream==='care'?care:mitigation)[kind]||'').split(' ')])};}
export function exportPricing(r:Record<string,any>){return {...exportPick(r,'id kind description identity room physicalKey quantity unit countBasis scopeBasis targetRef status dismissReason'.split(' ')),sources:(r.sources||[]).map((s:any)=>exportPick(s,['fileId','locator','observation'])),prices:(r.prices||[]).map((p:any)=>exportPick(p,'id provider url fileId locator observedAt unit amount currency availability match matchBasis tax shipping exclusions'.split(' ')))};}
export function exportAgreement(r:Record<string,any>){return {recordType:'Agreement preparation packet',...exportPick(r,'id parentId revision title templateId templateTitle templateRevision fileId status reviewLocator notes cancelReason correctionReason created actor'.split(' ')),signers:(r.signers||[]).map((s:any)=>exportPick(s,['name','email']))};}
export const mortgageFields='mortgageStatus workflow servicer held asOf evidenceId evidenceLocator sourceChecked reviewer nextAction followUp notes';
export const drawFields='id title coverage status owner servicer payee date requested approved released releaseDate releaseReference releaseBasis amountBasis differenceBasis evidenceId evidenceLocator requestChecked approvalEvidenceId approvalLocator approvalChecked releaseEvidenceId releaseLocator releaseChecked nextAction followUp closeReason correctionReason notes';
