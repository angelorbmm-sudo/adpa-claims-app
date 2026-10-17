"""Bounded candidate near-duplicate pass over pre-chunked English transcripts.

Reads the private chunk JSON produced by the preparation pipeline; outputs
deduplicated chunks with complete provenance. No network, no claims data.
Heuristic: candidate recall is NOT exhaustive; use the video-level overlap
audit and expert review for excerpt/near-duplicate cases.

Usage: python tools/ai_knowledge/fast_chunk_dedup.py input.json output.json
"""
import argparse
import collections
import hashlib
import json
import time
from pathlib import Path


def fivegrams(text):
    words = text.split()
    return set(zip(*(words[i:] for i in range(5)))) if len(words) >= 5 else set()


def dedup_chunks(chunks, threshold=0.82):
    if not 0 < threshold <= 1:
        raise ValueError("threshold must be between 0 and 1")
    entries, postings, exact = [], collections.defaultdict(list), {}
    merged, comparisons, total = 0, 0, 0
    for chunk in chunks:
        total += 1
        source = chunk["provenance"][0]["source_id"]
        if not source.startswith("youtube:"):
            raise ValueError("source ID required")
        text = chunk["text"]
        key = hashlib.sha256(text.encode("utf-8")).hexdigest()
        existing = exact.get(key)
        if existing is not None and source not in entries[existing]["_sources"]:
            entries[existing]["provenance"].extend(chunk["provenance"])
            entries[existing]["_sources"].add(source)
            merged += 1
            continue
        grams = fivegrams(text)
        # Fixed, bounded posting budget: 8 representative shingles per chunk.
        # This improves throughput but may miss approximate matches.
        sample = sorted(grams, key=lambda g: hashlib.blake2s(
            " ".join(g).encode("utf-8"), digest_size=8).digest())[:8]
        candidate_counts = collections.Counter()
        for gram in sample:
            for idx in postings.get(gram, ()):
                candidate_counts[idx] += 1
        best, best_score = None, 0.0
        for idx, _ in candidate_counts.most_common(16):
            entry = entries[idx]
            if source in entry["_sources"]:
                continue
            comparisons += 1
            similarity = len(grams & entry["_grams"]) / max(1, len(grams | entry["_grams"]))
            if similarity > best_score:
                best, best_score = idx, similarity
        if best is not None and best_score >= threshold:
            entries[best]["provenance"].extend(chunk["provenance"])
            entries[best]["_sources"].add(source)
            merged += 1
        else:
            idx = len(entries)
            entries.append({**chunk, "provenance": list(chunk["provenance"]),
                            "_grams": grams, "_sources": {source}})
            exact.setdefault(key, idx)
            for gram in sample:
                postings[gram].append(idx)
    for entry in entries:
        del entry["_grams"]
        del entry["_sources"]
    if sum(len(x["provenance"]) for x in entries) != sum(
        len(x["provenance"]) for x in chunks
    ):
        raise AssertionError("provenance count changed")
    return {"schema_version": 1, "language": "en",
            "method": "bounded candidate 5-gram Jaccard; non-exhaustive",
            "threshold": threshold,
            "stats": {"input_chunks": total, "unique_chunks": len(entries),
                      "merged_chunks": merged, "candidate_comparisons": comparisons},
            "chunks": entries}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("input_json", type=Path)
    parser.add_argument("output_json", type=Path)
    args = parser.parse_args()
    data = json.loads(args.input_json.read_text(encoding="utf-8"))
    if data.get("language") != "en":
        raise ValueError("English-only input required")
    started = time.monotonic()
    result = dedup_chunks(data["chunks"])
    result["stats"]["sources"] = data.get("stats", {}).get("sources")
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({"elapsed_seconds": round(time.monotonic() - started, 2),
                      **result["stats"]}, indent=2))


if __name__ == "__main__":
    main()
