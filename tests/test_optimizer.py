import unittest
from backend.app.sample_data import get_sample_college_data
from backend.app.models import CollegeData, Faculty, Classroom, StudentBatch, Course, SessionType
from backend.app.engine.optimizer import TimetableOptimizer
from backend.app.engine.diagnostics import run_diagnostics

class TestTimetableOptimizer(unittest.TestCase):
    def setUp(self):
        sample = get_sample_college_data()
        self.data = CollegeData(
            faculty=[Faculty(**f) for f in sample["faculty"]],
            classrooms=[Classroom(**r) for r in sample["classrooms"]],
            batches=[StudentBatch(**b) for b in sample["batches"]],
            courses=[Course(**c) for c in sample["courses"]]
        )

    def test_solve_sample_data(self):
        optimizer = TimetableOptimizer(self.data)
        result = optimizer.solve()

        self.assertIn(result.status, ["OPTIMAL", "FEASIBLE"])
        self.assertGreater(result.total_classes_scheduled, 0)
        self.assertIsNotNone(result.stats)

        # 1. Test Room Overlap: No room can host two classes in same slot
        room_slots = set()
        for entry in result.classes:
            key = (entry.room_id, entry.day, entry.slot)
            self.assertNotIn(key, room_slots, f"Room collision detected for room {entry.room_id} at day {entry.day}, slot {entry.slot}")
            room_slots.add(key)

        # 2. Test Faculty Double-Booking
        faculty_slots = set()
        for entry in result.classes:
            key = (entry.faculty_id, entry.day, entry.slot)
            self.assertNotIn(key, faculty_slots, f"Faculty double-booking for faculty {entry.faculty_id} at day {entry.day}, slot {entry.slot}")
            faculty_slots.add(key)

        # 3. Test Student Batch Double-Booking
        batch_slots = set()
        for entry in result.classes:
            key = (entry.batch_id, entry.day, entry.slot)
            self.assertNotIn(key, batch_slots, f"Student batch conflict for batch {entry.batch_id} at day {entry.day}, slot {entry.slot}")
            batch_slots.add(key)

        # 4. Test Faculty Unavailable Slots Respect
        fac_unavail = {f.id: {(s.day, s.slot) for s in f.unavailable_slots} for f in self.data.faculty}
        for entry in result.classes:
            unavail_set = fac_unavail.get(entry.faculty_id, set())
            self.assertNotIn((entry.day, entry.slot), unavail_set, f"Faculty scheduled during declared unavailable slot")

        # 5. Test Room Capacity
        room_caps = {r.id: r.capacity for r in self.data.classrooms}
        batch_sizes = {b.id: b.size for b in self.data.batches}
        for entry in result.classes:
            cap = room_caps[entry.room_id]
            size = batch_sizes[entry.batch_id]
            self.assertGreaterEqual(cap, size, f"Room capacity {cap} is less than batch size {size}")

    def test_diagnostics_on_impossible_batch_size(self):
        sample = get_sample_college_data()
        # Set first batch size to 200 (largest room is 70)
        sample["batches"][0]["size"] = 200
        bad_data = CollegeData(
            faculty=[Faculty(**f) for f in sample["faculty"]],
            classrooms=[Classroom(**r) for r in sample["classrooms"]],
            batches=[StudentBatch(**b) for b in sample["batches"]],
            courses=[Course(**c) for c in sample["courses"]]
        )
        diagnostics = run_diagnostics(bad_data)
        errors = [d for d in diagnostics if d.severity == "error" and d.category == "room_capacity"]
        self.assertGreater(len(errors), 0)
        
        # Optimizer should detect this and return INFEASIBLE immediately
        optimizer = TimetableOptimizer(bad_data)
        res = optimizer.solve()
        self.assertEqual(res.status, "INFEASIBLE")
        self.assertGreater(len(res.diagnostics), 0)

if __name__ == "__main__":
    unittest.main()
