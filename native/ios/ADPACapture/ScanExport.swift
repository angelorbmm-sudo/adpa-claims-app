import Foundation
import RoomPlan
import simd

struct FloorPoint: Codable { let x: Double; let z: Double }
struct ScanRoom: Codable {
    let name: String
    let points: [FloorPoint]
    let height: Double
    let openingsArea: Double
    let heightSource: String
    let notes: String
}
struct ScanEnvelope: Codable {
    let version = 2
    let scanId: String
    let provider = "Apple RoomPlan"
    let captureMethod = "apple_roomplan"
    let units = "m"
    let capturedAt: String
    let warnings: [String]
    let rooms: [ScanRoom]
}
enum ScanExportError: LocalizedError {
    case unsupportedOutline
    var errorDescription: String? { "A single closed straight-wall outline with consistent wall heights could not be built. Export the RoomPlan source and use ADPA manual measurements; do not substitute a bounding rectangle." }
}
// Conservative adapter: preserve native source, refuse disconnected outlines, require review in ADPA.
enum ScanExport {
    private static func distance(_ a: FloorPoint, _ b: FloorPoint) -> Double { hypot(a.x-b.x, a.z-b.z) }
    static func envelope(room: CapturedRoom, name: String) throws -> ScanEnvelope {
        guard room.walls.count >= 3, room.walls.count <= 100 else { throw ScanExportError.unsupportedOutline }
        let heights = room.walls.map { Double($0.dimensions.y) }
        guard let lowest = heights.min(), let highest = heights.max(), lowest > 0, highest-lowest < 0.15 else { throw ScanExportError.unsupportedOutline }
        var segments = room.walls.map { wall -> (FloorPoint, FloorPoint) in
            let half = wall.dimensions.x/2
            let a = wall.transform * SIMD4<Float>(-half, 0, 0, 1)
            let b = wall.transform * SIMD4<Float>(half, 0, 0, 1)
            return (FloorPoint(x:Double(a.x),z:Double(a.z)), FloorPoint(x:Double(b.x),z:Double(b.z)))
        }
        let first = segments.removeFirst()
        var points = [first.0, first.1]
        let tolerance = 0.20 // meters; candidate endpoints only, never a claim of measurement accuracy
        while !segments.isEmpty {
            let last = points.last!
            let candidates = segments.enumerated().flatMap { index, segment in
                [(index, false, distance(last,segment.0)),(index, true, distance(last,segment.1))]
            }
            guard let best = candidates.min(by: {$0.2 < $1.2}), best.2 <= tolerance else { throw ScanExportError.unsupportedOutline }
            let segment = segments.remove(at:best.0)
            points.append(best.1 ? segment.0 : segment.1)
        }
        guard distance(points.last!,points[0]) <= tolerance else { throw ScanExportError.unsupportedOutline }
        points.removeLast() // duplicate closure is implicit in the shared format
        let timestamp = ISO8601DateFormatter().string(from:Date())
        return ScanEnvelope(scanId:UUID().uuidString, capturedAt:timestamp, warnings:[
            "Candidate straight-wall floor projection; field verification required.",
            "Endpoints within 0.20m were joined. This tolerance is not an accuracy guarantee.",
            "Door/window/opening deductions were not applied. Review the RoomPlan source and enter deductions in ADPA.",
            "Sloped ceilings, curved walls, multiple levels and concealed conditions are not established by this adapter."
        ], rooms:[ScanRoom(name:name,points:points,height:heights.reduce(0,+)/Double(heights.count),openingsArea:0,heightSource:"RoomPlan wall-height candidate; field verification required",notes:"")])
    }
    static func write<T: Encodable>(_ value:T, filename:String) throws -> URL {
        let encoder=JSONEncoder(); encoder.outputFormatting=[.prettyPrinted,.sortedKeys]
        let directory=FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString,isDirectory:true)
        try FileManager.default.createDirectory(at:directory,withIntermediateDirectories:true)
        let url=directory.appendingPathComponent(filename)
        try encoder.encode(value).write(to:url,options:.atomic)
        return url
    }
}
