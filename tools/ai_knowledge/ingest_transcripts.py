"""Validate and normalize ADPA English-language transcript exports.

Standard library only. Run: python -m unittest discover -s tools/ai_knowledge -p 'test_*.py'
This tool does NOT deploy a retrieval service or import private claims.
"""
import hashlib
import json
from pathlib import Path

def normalize_transcript(data: dict) -> dict:
    video_id = data.get("video_id")
    language = data.get("language")
    if not isinstance(video_id, str) or len(video_id) != 11:
        raise ValueError("Invalid YouTube video ID")
    if language != "en":
        raise ValueError("Only English transcripts are permitted")
    segments = data.get("segments")
    if not isinstance(segments, list) or not segments:
        raise ValueError("Transcript must contain timestamped segments")
    normalized = []
    for segment in segments:
        text = segment.get("text", "").strip()
        offset = segment.get("offset")
        duration = segment.get("duration")
        if not text or not isinstance(offset, (int, float)) or offset < 0:
            raise ValueError("Invalid transcript segment")
        if not isinstance(duration, (int, float)) or duration < 0:
            raise ValueError("Invalid segment duration")
        normalized.append({"start_ms": int(offset), "duration_ms": int(duration), "text": text})
    return {"source_id": "youtube:" + video_id, "video_id": video_id,
            "source_url": "https://www.youtube.com/watch?v=" + video_id,
            "language": "en", "segments": normalized}

def ingest_directory(source: Path, destination: Path) -> dict:
    destination.mkdir(parents=True, exist_ok=True)
    manifest = {"format_version": 1, "language": "en", "sources": [], "rejected": []}
    for path in sorted(source.glob("*.json")):
        if path.name.endswith("manifest.json") or path.name in ("extraction_audit.json", "channel_manifest.json"):
            continue
        try:
            data = normalize_transcript(json.loads(path.read_text(encoding="utf-8")))
            output = json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
            (destination / (data["video_id"] + ".json")).write_bytes(output)
            manifest["sources"].append({"source_id": data["source_id"], "video_id": data["video_id"],
                "sha256": hashlib.sha256(output).hexdigest(), "segments": len(data["segments"])})
        except (ValueError, TypeError, KeyError, json.JSONDecodeError) as error:
            manifest["rejected"].append({"filename": path.name, "reason": str(error)})
    (destination / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    result = ingest_directory(args.source, args.destination)
    print(f"Accepted {len(result['sources'])}; rejected {len(result['rejected'])}")
