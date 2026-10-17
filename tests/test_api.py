import unittest
from fastapi.testclient import TestClient
from backend.app.main import app

class TestAPIEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        # Reset to clean sample data before test suite runs
        cls.client.post("/api/reset-sample")

    def test_status(self):
        res = self.client.get("/api/status")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("OR-Tools", data["solver"])

    def test_get_data(self):
        res = self.client.get("/api/data")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("faculty", data)
        self.assertIn("classrooms", data)
        self.assertIn("batches", data)
        self.assertIn("courses", data)
        self.assertGreater(len(data["faculty"]), 0)
        self.assertGreater(len(data["courses"]), 0)

    def test_diagnostics(self):
        res = self.client.get("/api/diagnostics")
        self.assertEqual(res.status_code, 200)
        issues = res.json()
        self.assertIsInstance(issues, list)
        # Sample data should be completely valid (no errors)
        fatal = [i for i in issues if i["severity"] == "error"]
        self.assertEqual(len(fatal), 0)

    def test_optimize_and_retrieve_latest(self):
        # Generate timetable
        res = self.client.post("/api/optimize", json={
            "timeout_seconds": 10,
            "minimize_gaps": True,
            "balance_daily_load": True
        })
        self.assertEqual(res.status_code, 200)
        result = res.json()
        self.assertIn(result["status"], ["OPTIMAL", "FEASIBLE"])
        self.assertGreater(result["total_classes_scheduled"], 0)

        # Retrieve latest timetable
        latest_res = self.client.get("/api/timetable/latest")
        self.assertEqual(latest_res.status_code, 200)
        latest = latest_res.json()
        self.assertIsNotNone(latest)
        self.assertEqual(latest["total_classes_scheduled"], result["total_classes_scheduled"])

    def test_csv_export(self):
        # Ensure a timetable is generated first
        self.client.post("/api/optimize")
        res = self.client.get("/api/timetable/export/csv")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.headers.get("content-type"), "text/csv; charset=utf-8")
        self.assertIn("Course Code", res.text)
        self.assertIn("Faculty Name", res.text)

if __name__ == "__main__":
    unittest.main()
