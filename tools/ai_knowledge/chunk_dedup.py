"""Cross-video transcript chunk deduplication with retained source provenance.

Local preparation utility, NOT a deployed ADPA search service.
Usage: python tools/ai_knowledge/chunk_dedup.py SOURCE_DIR OUTPUT_JSON
"""
import argparse
import hashlib
import json
import re
from pathlib import Path


def tokens(text):
    return re.findall(r"[a-z0-9]+", text.lower())


def grams(words):
    return set(zip(*(words[i:] for i in range(5)))) if len(words) >= 5 else set()


def chunks(transcript, window=180, overlap=30):
    if transcript.get("language") != "en":
        raise ValueError("English-only corpus")
    vid = transcript.get("video_id", "")
    if not re.fullmatch(r"[A-Za-z0-9_-]{11}", vid):
        raise ValueError("Invalid video ID")
    if window < 20 or not 0 <= overlap < window:
        raise ValueError("Invalid chunk window")
    words = []
    for segment in transcript.get("segments", []):
        ms = segment.get("offset")
        if not isinstance(ms, (int, float)) or ms < 0:
            raise ValueError("Invalid segment timestamp")
        words.extend((word, int(ms)) for word in tokens(segment.get("text", "")))
    for start in range(0, len(words), window - overlap):
        part = words[start:start + window]
        if not part:
            break
        yield {"source_id": "youtube:" + vid,
               "source_url": "https://www.youtube.com/watch?v=" + vid,
               "start_ms": part[0][1], "end_ms": part[-1][1],
               "text": " ".join(word for word, _ in part)}
        if start + window >= len(words):
            break


def deduplicate(transcripts, threshold=0.82):
    if not 0 < threshold <= 1:
        raise ValueError("Invalid threshold")
    canonical, inverted, registry = [], {}, {}
    input_count, merged = 0, 0
    for transcript in transcripts:
        source = "youtube:" + transcript["video_id"]
        if source in registry:
            raise ValueError("Duplicate video ID: " + source)
        registry[source] = {"chunks": 0, "merged": 0}
        for chunk in chunks(transcript):
            input_count += 1
            registry[source]["chunks"] += 1
            g = grams(tokens(chunk["text"]))
            candidates = set()
            for phrase in g:
                candidates.update(inverted.get(phrase, ()))
            best, best_score = None, 0.0
            for i in candidates:
                entry = canonical[i]
                if any(p["source_id"] == source for p in entry["provenance"]):
                    continue
                score = len(g & entry["_grams"]) / max(1, len(g | entry["_grams"]))
                if score > best_score:
                    best, best_score = i, score
            provenance = {k: chunk[k] for k in ("source_id", "source_url", "start_ms", "end_ms")}
            if best is not None and best_score >= threshold:
                canonical[best]["provenance"].append(provenance)
                registry[source]["merged"] += 1
                merged += 1
            else:
                chunk_id = hashlib.sha256((source + ":" + str(chunk["start_ms"]) + ":" + chunk["text"]).encode()).hexdigest()[:24]
                i = len(canonical)
                canonical.append({"chunk_id": chunk_id, "text": chunk["text"],
                                  "provenance": [provenance], "_grams": g})
                for phrase in g:
                    inverted.setdefault(phrase, set()).add(i)
    for entry in canonical:
        del entry["_grams"]
    return {"schema_version": 1, "language": "en", "threshold": threshold,
            "stats": {"input_chunks": input_count, "merged_chunks": merged,
                      "unique_chunks": len(canonical), "sources": len(registry)},
            "sources": registry, "chunks": canonical}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output_json", type=Path)
    args = parser.parse_args()
    def sources():
        for path in sorted(args.source_dir.glob("*.json")):
            if path.name.endswith("manifest.json") or path.name in ("channel_manifest.json", "extraction_audit.json"):
                continue
            yield json.loads(path.read_text(encoding="utf-8"))
    result = deduplicate(sources())
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(result["stats"], indent=2))


if __name__ == "__main__":
    main()
