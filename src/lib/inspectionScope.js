import { z } from 'zod';

const finite = z.number().finite().nonnegative().max(1000000);
export const ScanSchema = z.object({
  version: z.literal(1), units: z.enum(['ft', 'm']), provider: z.string().trim().min(1).max(100),
  capturedAt: z.string().datetime(),
  rooms: z.array(z.object({
    name: z.string().trim().min(1).max(150), length: finite.positive(), width: finite.positive(), height: finite.positive(),
    openingsArea: finite.default(0)
  }).strict()).min(1).max(100)
}).strict();
export function normalizeScan(input) {
  const scan = ScanSchema.parse(input), factor = scan.units === 'm' ? 1 / 0.3048 : 1;
  return scan.rooms.map(room => ({
    name: room.name, length: room.length * factor, width: room.width * factor, height: room.height * factor,
    openingsArea: room.openingsArea * factor * factor,
    measurementSource: `${scan.provider} scan (${scan.units}) · ${scan.capturedAt}`,
    measurementVerified: false
  }));
}
export function roomQuantities(room) {
  const values = ['length', 'width', 'height'].map(key => Number(room[key]));
  if (values.some(v => !Number.isFinite(v) || v <= 0 || v > 1000000)) return null;
  const [l, w, h] = values, openings = Number(room.openingsArea || 0), gross = 2 * (l + w) * h;
  if (!Number.isFinite(openings) || openings < 0 || openings > gross) return null;
  return { floor: l*w, ceiling: l*w, walls: gross-openings, perimeter: 2*(l+w) };
}
export const bases = { floor: 'Floor area (SF)', ceiling: 'Ceiling area (SF)', walls: 'Net wall area (SF)', perimeter: 'Perimeter (LF)', manual: 'Custom quantity' };
export function lineQuantity(room, line) {
  if (line.basis === 'manual') {
    if (String(line.quantity).trim() === '') return null;
    const value = Number(line.quantity);
    return Number.isFinite(value) && value > 0 && value <= 100000000 ? value : null;
  }
  return roomQuantities(room)?.[line.basis] ?? null;
}
export function reviewBlockers(room, documents = []) {
  const reasons = [];
  if (!room.name?.trim()) reasons.push('Name the room.');
  if (!room.measurementSource?.trim() || !room.measurementVerified || !roomQuantities(room)) reasons.push('Verify valid measurements and their source.');
  if (!room.reviewer?.trim()) reasons.push('Enter the scope reviewer.');
  if (!room.lines?.length) reasons.push('Add at least one repair operation.');
  for (const [i, line] of (room.lines || []).entries()) {
    if (!line.description?.trim() || !line.material?.trim() || !line.rationale?.trim()) reasons.push(`Line ${i+1}: enter material, repair operation, and rationale.`);
    if (!(lineQuantity(room, line) > 0) || !['SF','LF','EA','CY','HR'].includes(line.unit) || (line.basis !== 'manual' && line.unit !== (line.basis === 'perimeter' ? 'LF' : 'SF'))) reasons.push(`Line ${i+1}: verify quantity and units.`);
    if (!line.reviewed) reasons.push(`Line ${i+1}: review the proposed operation.`);
    if (!line.evidenceIds?.length || line.evidenceIds.some(id => !documents.some(d => d.id === id) || !(room.evidenceIds || []).includes(id))) reasons.push(`Line ${i+1}: link existing evidence.`);
  }
  return reasons;
}
export function comparisonLines(room, documents, timestamp) {
  const blockers = reviewBlockers(room, documents);
  if (blockers.length) throw new Error(blockers.join(' '));
  return room.lines.map(line => ({
    id: `inspection-${room.id}-${line.id}`, inspectionRoomId: room.id, inspectionLineId: line.id,
    room: room.name, trade: line.trade || '', description: `${line.material}: ${line.description}`,
    quantity: Math.round(lineQuantity(room,line)*100)/100, unit: line.unit, coverage: room.coverage || 'A',
    adpaUnitPrice: '', carrierQuantity: '', carrierUnitPrice: '', pricingPending: true,
    status: 'Needs review', createdAt: timestamp,
    source: `${room.measurementSource}; evidence: ${line.evidenceIds.join(', ')}; ${line.rationale}`,
    scopeReviewer: room.reviewer, scopeReviewedAt: timestamp,
    sourceRefs: line.evidenceIds, measurementSnapshot: {length:room.length,width:room.width,height:room.height,openingsArea:room.openingsArea||0,basis:line.basis}
  }));
}
export function mergeComparisonLines(existing, incoming, roomId) {
  const ids = new Set(incoming.map(x=>x.id));
  return [...existing.filter(x=>roomId ? x.inspectionRoomId !== roomId : !ids.has(x.id)), ...incoming];
}
export const SuggestionSchema = z.object({
  observations: z.array(z.string().max(2000)).max(30), questions: z.array(z.string().max(1000)).max(30),
  lines: z.array(z.object({
    material: z.string().max(300), trade: z.string().max(100), description: z.string().max(1000),
    basis: z.enum(['floor','ceiling','walls','perimeter','manual']),
    rationale: z.string().max(2000), evidenceIds: z.array(z.string()).max(20)
  }).strict()).max(50)
}).strict();
