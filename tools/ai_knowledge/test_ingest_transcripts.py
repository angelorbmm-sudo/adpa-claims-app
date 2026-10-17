import tempfile
import unittest
from pathlib import Path
from ingest_transcripts import normalize_transcript, ingest_directory
import json

class IngestionTests(unittest.TestCase):
    def setUp(self):
        self.valid = {"video_id": "IGsgn9YEpKk", "language": "en",
                      "segments": [{"text": "Estimate wall area", "offset": 1200, "duration": 3000}]}

    def test_accepts_english_with_provenance(self):
        result = normalize_transcript(self.valid)
        self.assertEqual(result["source_id"], "youtube:IGsgn9YEpKk")
        self.assertEqual(result["segments"][0]["start_ms"], 1200)

    def test_rejects_non_english(self):
        self.valid["language"] = "ar"
        with self.assertRaises(ValueError):
            normalize_transcript(self.valid)

    def test_rejects_empty_segments(self):
        self.valid["segments"] = []
        with self.assertRaises(ValueError):
            normalize_transcript(self.valid)

    def test_does_not_ingest_invalid_file(self):
        with tempfile.TemporaryDirectory() as temp:
            source, dest = Path(temp) / "input", Path(temp) / "output"
            source.mkdir()
            (source / "valid.json").write_text(json.dumps(self.valid))
            (source / "invalid.json").write_text(json.dumps({"video_id":"bad","language":"ar"}))
            result = ingest_directory(source, dest)
            self.assertEqual(len(result["sources"]), 1)
            self.assertEqual(len(result["rejected"]), 1)
            self.assertTrue((dest / "IGsgn9YEpKk.json").exists())

if __name__ == "__main__":
    unittest.main()
