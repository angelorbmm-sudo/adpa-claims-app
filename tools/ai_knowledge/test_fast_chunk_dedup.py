import unittest
from fast_chunk_dedup import dedup_chunks


def chunk(vid, text):
    return {"chunk_id": vid, "text": text, "provenance": [{
        "source_id": "youtube:" + vid,
        "source_url": "https://www.youtube.com/watch?v=" + vid,
        "start_ms": 0, "end_ms": 5000}]}


class FastChunkDedupTests(unittest.TestCase):
    def test_exact_cross_video_dedup_preserves_sources(self):
        text = "roof damage estimate insurance replacement cost construction material labor"
        result = dedup_chunks([chunk("aaaaaaaaaaa", text), chunk("bbbbbbbbbbb", text)])
        self.assertEqual(result["stats"]["unique_chunks"], 1)
        self.assertEqual(len(result["chunks"][0]["provenance"]), 2)

    def test_unrelated_content_stays_separate(self):
        result = dedup_chunks([chunk("aaaaaaaaaaa", "roof replacement cost labor material"),
                               chunk("bbbbbbbbbbb", "contents valuation depreciation antique sofa")])
        self.assertEqual(result["stats"]["unique_chunks"], 2)

    def test_same_source_chunks_are_not_merged(self):
        text = "roof damage estimate insurance replacement cost construction material labor"
        result = dedup_chunks([chunk("aaaaaaaaaaa", text), chunk("aaaaaaaaaaa", text)])
        self.assertEqual(result["stats"]["unique_chunks"], 2)

    def test_empty_corpus(self):
        self.assertEqual(dedup_chunks([])["stats"]["unique_chunks"], 0)

    def test_invalid_threshold(self):
        with self.assertRaises(ValueError):
            dedup_chunks([], threshold=0)

    def test_provenance_integrity(self):
        text = "roof damage estimate insurance replacement cost construction material labor"
        data = [chunk("aaaaaaaaaaa", text), chunk("bbbbbbbbbbb", text),
                chunk("ccccccccccc", "other policyholder claim settlement")]
        result = dedup_chunks(data)
        self.assertEqual(sum(len(c["provenance"]) for c in result["chunks"]), 3)


if __name__ == "__main__":
    unittest.main()
