import unittest
from chunk_dedup import chunks, deduplicate


def transcript(video_id, text, language="en"):
    return {"video_id": video_id, "language": language,
            "segments": [{"offset": 1200, "duration": 4000, "text": text}]}


class ChunkDedupTests(unittest.TestCase):
    def setUp(self):
        self.text = ("estimate replacement cost for damaged interior drywall and paint "
                     "including material labor and measurements from field inspection ") * 12

    def test_same_content_cross_source_merges(self):
        result = deduplicate([transcript("aaaaaaaaaaa", self.text),
                              transcript("bbbbbbbbbbb", self.text)])
        self.assertEqual(result["stats"]["sources"], 2)
        self.assertGreater(result["stats"]["merged_chunks"], 0)
        self.assertTrue(any(len(c["provenance"]) == 2 for c in result["chunks"]))

    def test_different_sources_not_merged(self):
        result = deduplicate([transcript("aaaaaaaaaaa", self.text),
                              transcript("bbbbbbbbbbb", "hurricane roof tarping wind loss estimate " * 24)])
        self.assertEqual(result["stats"]["merged_chunks"], 0)

    def test_non_english_rejected(self):
        with self.assertRaises(ValueError):
            deduplicate([transcript("aaaaaaaaaaa", self.text, "ar")])

    def test_duplicate_source_rejected(self):
        with self.assertRaises(ValueError):
            deduplicate([transcript("aaaaaaaaaaa", self.text),
                         transcript("aaaaaaaaaaa", self.text)])

    def test_timestamps_retained(self):
        first = next(chunks(transcript("aaaaaaaaaaa", self.text)))
        self.assertEqual(first["start_ms"], 1200)
        self.assertIn("aaaaaaaaaaa", first["source_url"])

    def test_short_transcript_retained(self):
        result = deduplicate([transcript("aaaaaaaaaaa", "roof")])
        self.assertEqual(result["stats"]["unique_chunks"], 1)


if __name__ == "__main__":
    unittest.main()
