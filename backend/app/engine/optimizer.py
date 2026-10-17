import time
from typing import Dict, List, Tuple, Any, Optional
from ortools.sat.python import cp_model

from ..models import (
    CollegeData,
    TimetableResult,
    TimetableSlotEntry,
    TimetableStats,
    OptimizeRequest,
    SessionType,
    RoomType,
    DAYS,
    TIME_SLOTS
)
from .diagnostics import run_diagnostics

class TimetableOptimizer:
    def __init__(self, data: CollegeData, config: Optional[OptimizeRequest] = None):
        self.data = data
        self.config = config or OptimizeRequest()
        self.num_days = len(DAYS)  # 5 days (Mon-Fri)
        self.num_slots = len(TIME_SLOTS)  # 6 slots (0 to 5)

        self.faculty_map = {f.id: f for f in data.faculty}
        self.classroom_map = {r.id: r for r in data.classrooms}
        self.batch_map = {b.id: b for b in data.batches}
        self.course_map = {c.id: c for c in data.courses}

    def solve(self) -> TimetableResult:
        start_time = time.time()

        # Step 1: Pre-validation Diagnostics
        diagnostics = run_diagnostics(self.data)
        has_fatal_error = any(d.severity == "error" for d in diagnostics)
        if has_fatal_error:
            elapsed = (time.time() - start_time) * 1000
            return TimetableResult(
                status="INFEASIBLE",
                score=0.0,
                execution_time_ms=elapsed,
                total_classes_scheduled=0,
                classes=[],
                stats=None,
                diagnostics=diagnostics,
                generated_at=time.strftime("%Y-%m-%d %H:%M:%S")
            )

        # Step 2: Build Units to Schedule
        # Each unit represents either a 1-hour lecture or a multi-hour lab block
        units = []
        unit_idx = 0
        for course in self.data.courses:
            # Lectures (each 1 hour)
            for lec_num in range(course.lectures_per_week):
                units.append({
                    "unit_id": f"{course.id}_LEC_{lec_num+1}",
                    "course_id": course.id,
                    "session_type": SessionType.LECTURE,
                    "duration": 1,
                    "session_num": lec_num + 1,
                    "room_type_required": course.room_type_required,
                    "faculty_id": course.faculty_id,
                    "batch_id": course.batch_id,
                    "color": course.color or "#3b82f6"
                })
                unit_idx += 1

            # Labs (each lab_duration_hours, e.g. 2 hours)
            for lab_num in range(course.labs_per_week):
                dur = course.lab_duration_hours or 2
                units.append({
                    "unit_id": f"{course.id}_LAB_{lab_num+1}",
                    "course_id": course.id,
                    "session_type": SessionType.LAB,
                    "duration": dur,
                    "session_num": lab_num + 1,
                    "room_type_required": course.room_type_required,
                    "faculty_id": course.faculty_id,
                    "batch_id": course.batch_id,
                    "color": course.color or "#10b981"
                })
                unit_idx += 1

        if not units:
            elapsed = (time.time() - start_time) * 1000
            return TimetableResult(
                status="OPTIMAL",
                score=100.0,
                execution_time_ms=elapsed,
                total_classes_scheduled=0,
                classes=[],
                stats=self._empty_stats(),
                diagnostics=diagnostics,
                generated_at=time.strftime("%Y-%m-%d %H:%M:%S")
            )

        # Step 3: Build CP-SAT Model
        model = cp_model.CpModel()

        # Determine valid start slots for given duration
        # Slot index 0,1 (morning 1), 2,3 (morning 2), 4,5 (afternoon)
        valid_start_slots = {
            1: list(range(self.num_slots)),  # 0,1,2,3,4,5
            2: [0, 2, 4],                   # Pairs: (0,1), (2,3), (4,5) to respect breaks!
            3: [0, 3]
        }

        # Candidate rooms for each unit
        unit_candidate_rooms = {}
        for u in units:
            batch = self.batch_map.get(u["batch_id"])
            batch_size = batch.size if batch else 40
            
            # Compatible rooms matching type and capacity
            cand = [
                r for r in self.data.classrooms
                if r.type == u["room_type_required"] and r.capacity >= batch_size
            ]
            if not cand:
                # Fallback: any room matching type, or any room matching capacity
                cand = [r for r in self.data.classrooms if r.type == u["room_type_required"]]
                if not cand:
                    cand = [r for r in self.data.classrooms if r.capacity >= batch_size]
            if not cand:
                cand = self.data.classrooms  # Last resort
            unit_candidate_rooms[u["unit_id"]] = cand

        # Precompute faculty unavailable slots set: (day, slot)
        faculty_unavail = {}
        for f in self.data.faculty:
            faculty_unavail[f.id] = {(s.day, s.slot) for s in f.unavailable_slots}

        # Decision Variables: X[unit_id, day, slot, room_id] in {0, 1}
        X = {}
        objective_terms = []

        for u in units:
            u_id = u["unit_id"]
            dur = u["duration"]
            valid_slots = valid_start_slots.get(dur, [0])
            cand_rooms = unit_candidate_rooms[u_id]
            u_vars = []

            for d in range(self.num_days):
                for s in valid_slots:
                    # Check if faculty is unavailable during any slot occupied by this unit
                    f_id = u["faculty_id"]
                    is_unavail = False
                    for offset in range(dur):
                        if (d, s + offset) in faculty_unavail.get(f_id, set()):
                            is_unavail = True
                            break
                    if is_unavail:
                        continue

                    for r in cand_rooms:
                        var = model.NewBoolVar(f"x_{u_id}_d{d}_s{s}_r{r.id}")
                        X[(u_id, d, s, r.id)] = var
                        u_vars.append(var)

                        # Soft objective: morning preference for theory lectures
                        if self.config.prefer_morning_core and u["session_type"] == SessionType.LECTURE:
                            if s in [0, 1, 2]:
                                objective_terms.append(var * 4)  # Small bonus for morning

            # Constraint 1: Exactly one assignment per unit
            if not u_vars:
                # Could not even instantiate a single valid slot/room for this unit
                diagnostics.append(run_diagnostics(self.data)[0] if diagnostics else None)
                elapsed = (time.time() - start_time) * 1000
                return TimetableResult(
                    status="INFEASIBLE",
                    score=0.0,
                    execution_time_ms=elapsed,
                    total_classes_scheduled=0,
                    classes=[],
                    stats=None,
                    diagnostics=diagnostics,
                    generated_at=time.strftime("%Y-%m-%d %H:%M:%S")
                )
            model.Add(sum(u_vars) == 1)

        # Constraint 2: No Room Overlap at any (room, day, slot)
        for r in self.data.classrooms:
            for d in range(self.num_days):
                for t in range(self.num_slots):
                    occupying_vars = []
                    for u in units:
                        u_id = u["unit_id"]
                        dur = u["duration"]
                        for s in valid_start_slots.get(dur, []):
                            if s <= t < s + dur:
                                key = (u_id, d, s, r.id)
                                if key in X:
                                    occupying_vars.append(X[key])
                    if len(occupying_vars) > 1:
                        model.Add(sum(occupying_vars) <= 1)

        # Constraint 3: No Faculty Double-Booking at any (faculty, day, slot)
        for f in self.data.faculty:
            for d in range(self.num_days):
                for t in range(self.num_slots):
                    occupying_vars = []
                    for u in units:
                        if u["faculty_id"] == f.id:
                            u_id = u["unit_id"]
                            dur = u["duration"]
                            for s in valid_start_slots.get(dur, []):
                                if s <= t < s + dur:
                                    for r in unit_candidate_rooms[u_id]:
                                        key = (u_id, d, s, r.id)
                                        if key in X:
                                            occupying_vars.append(X[key])
                    if len(occupying_vars) > 1:
                        model.Add(sum(occupying_vars) <= 1)

        # Constraint 4: No Student Batch Overlap at any (batch, day, slot)
        batch_slot_active = {}
        for b in self.data.batches:
            for d in range(self.num_days):
                for t in range(self.num_slots):
                    occupying_vars = []
                    for u in units:
                        if u["batch_id"] == b.id:
                            u_id = u["unit_id"]
                            dur = u["duration"]
                            for s in valid_start_slots.get(dur, []):
                                if s <= t < s + dur:
                                    for r in unit_candidate_rooms[u_id]:
                                        key = (u_id, d, s, r.id)
                                        if key in X:
                                            occupying_vars.append(X[key])
                    # Batch can attend at most 1 session at time t
                    model.Add(sum(occupying_vars) <= 1)
                    
                    # Store active status variable for gap minimization
                    active_var = model.NewBoolVar(f"batch_{b.id}_active_d{d}_s{t}")
                    if occupying_vars:
                        model.Add(active_var == sum(occupying_vars))
                    else:
                        model.Add(active_var == 0)
                    batch_slot_active[(b.id, d, t)] = active_var

        # Constraint 5: Daily Workload Balance & Lecture Spread
        # For any course, schedule at most 1 lecture per day (unless lectures > 5)
        for course in self.data.courses:
            course_units = [u for u in units if u["course_id"] == course.id and u["session_type"] == SessionType.LECTURE]
            max_daily_lec = 2 if course.lectures_per_week > self.num_days else 1
            for d in range(self.num_days):
                day_lec_vars = []
                for u in course_units:
                    u_id = u["unit_id"]
                    dur = u["duration"]
                    for s in valid_start_slots.get(dur, []):
                        for r in unit_candidate_rooms[u_id]:
                            key = (u_id, d, s, r.id)
                            if key in X:
                                day_lec_vars.append(X[key])
                if len(day_lec_vars) > max_daily_lec:
                    model.Add(sum(day_lec_vars) <= max_daily_lec)

        # Constraint 6: Faculty Max Hours per Day
        for f in self.data.faculty:
            for d in range(self.num_days):
                day_faculty_terms = []
                for u in units:
                    if u["faculty_id"] == f.id:
                        u_id = u["unit_id"]
                        dur = u["duration"]
                        for s in valid_start_slots.get(dur, []):
                            for r in unit_candidate_rooms[u_id]:
                                key = (u_id, d, s, r.id)
                                if key in X:
                                    day_faculty_terms.append(dur * X[key])
                if day_faculty_terms:
                    model.Add(sum(day_faculty_terms) <= f.max_hours_per_day)

        # Soft Constraint: Minimize Idle Gaps for Student Batches
        if self.config.minimize_gaps:
            for b in self.data.batches:
                for d in range(self.num_days):
                    # Check for 1-hour middle gap: slot t active, slot t+1 empty, slot t+2 active
                    for t in range(self.num_slots - 2):
                        gap_var = model.NewBoolVar(f"gap_{b.id}_d{d}_s{t}")
                        # gap_var >= active[t] + active[t+2] - active[t+1] - 1
                        model.Add(gap_var >= batch_slot_active[(b.id, d, t)] + batch_slot_active[(b.id, d, t+2)] - batch_slot_active[(b.id, d, t+1)] - 1)
                        # Penalize each gap
                        objective_terms.append(gap_var * -15)

        # Soft Constraint: Balanced Daily Load across Monday-Friday
        if self.config.balance_daily_load:
            for b in self.data.batches:
                for d in range(self.num_days):
                    day_sum = sum(batch_slot_active[(b.id, d, t)] for t in range(self.num_slots))
                    # Reward days having balanced 2 to 4 classes
                    has_class = model.NewBoolVar(f"has_class_{b.id}_d{d}")
                    model.Add(day_sum >= 1).OnlyEnforceIf(has_class)
                    model.Add(day_sum == 0).OnlyEnforceIf(has_class.Not())
                    objective_terms.append(has_class * 5)

        # Maximize total objective
        if objective_terms:
            model.Maximize(sum(objective_terms))

        # Step 4: Solve with CP-SAT
        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = float(self.config.timeout_seconds)
        solver.parameters.num_workers = 4

        status = solver.Solve(model)
        elapsed = (time.time() - start_time) * 1000

        status_str = "UNKNOWN"
        if status == cp_model.OPTIMAL:
            status_str = "OPTIMAL"
        elif status == cp_model.FEASIBLE:
            status_str = "FEASIBLE"
        elif status == cp_model.INFEASIBLE:
            status_str = "INFEASIBLE"
        elif status == cp_model.MODEL_INVALID:
            status_str = "ERROR"
        else:
            status_str = "TIMEOUT"

        if status not in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
            if not diagnostics:
                diagnostics.append(run_diagnostics(self.data)[0] if run_diagnostics(self.data) else None)
            return TimetableResult(
                status=status_str,
                score=0.0,
                execution_time_ms=elapsed,
                total_classes_scheduled=0,
                classes=[],
                stats=None,
                diagnostics=diagnostics,
                generated_at=time.strftime("%Y-%m-%d %H:%M:%S")
            )

        # Step 5: Extract Solution Entries
        scheduled_classes = []
        for u in units:
            u_id = u["unit_id"]
            dur = u["duration"]
            cand_rooms = unit_candidate_rooms[u_id]
            for d in range(self.num_days):
                for s in valid_start_slots.get(dur, []):
                    for r in cand_rooms:
                        key = (u_id, d, s, r.id)
                        if key in X and solver.Value(X[key]) == 1:
                            course = self.course_map[u["course_id"]]
                            batch = self.batch_map[u["batch_id"]]
                            faculty = self.faculty_map[u["faculty_id"]]
                            
                            # For each hour occupied by this unit (1 or 2 slots)
                            for offset in range(dur):
                                slot_idx = s + offset
                                scheduled_classes.append(TimetableSlotEntry(
                                    id=f"{u_id}_slot{slot_idx}",
                                    day=d,
                                    day_name=DAYS[d]["name"],
                                    slot=slot_idx,
                                    time_label=TIME_SLOTS[slot_idx]["label"],
                                    course_id=course.id,
                                    course_code=course.code,
                                    course_name=course.name,
                                    batch_id=batch.id,
                                    batch_name=batch.name,
                                    faculty_id=faculty.id,
                                    faculty_name=faculty.name,
                                    room_id=r.id,
                                    room_number=r.room_number,
                                    session_type=u["session_type"],
                                    is_lab=(u["session_type"] == SessionType.LAB),
                                    color=u["color"]
                                ))

        # Sort classes by day and slot
        scheduled_classes.sort(key=lambda c: (c.day, c.slot, c.batch_name))

        # Calculate Statistics
        stats = self._calculate_stats(scheduled_classes)

        return TimetableResult(
            status=status_str,
            score=round(solver.ObjectiveValue(), 2) if objective_terms else 100.0,
            execution_time_ms=round(elapsed, 2),
            total_classes_scheduled=len(scheduled_classes),
            classes=scheduled_classes,
            stats=stats,
            diagnostics=diagnostics,
            generated_at=time.strftime("%Y-%m-%d %H:%M:%S")
        )

    def _calculate_stats(self, classes: List[TimetableSlotEntry]) -> TimetableStats:
        total_slots_scheduled = len(classes)
        total_room_slots = len(self.data.classrooms) * self.num_days * self.num_slots
        room_utilization = (total_slots_scheduled / total_room_slots * 100) if total_room_slots else 0

        total_faculty_slots = len(self.data.faculty) * self.num_days * self.num_slots
        faculty_utilization = (total_slots_scheduled / total_faculty_slots * 100) if total_faculty_slots else 0

        # Calculate student gap hours
        batch_day_slots = {}
        for c in classes:
            key = (c.batch_id, c.day)
            batch_day_slots.setdefault(key, []).append(c.slot)

        gap_hours = 0
        for slots in batch_day_slots.values():
            if len(slots) > 1:
                min_s = min(slots)
                max_s = max(slots)
                span = max_s - min_s + 1
                occupied = len(set(slots))
                gap_hours += max(0, span - occupied)

        # Daily distribution
        daily_dist = {day["name"]: 0 for day in DAYS}
        for c in classes:
            daily_dist[c.day_name] = daily_dist.get(c.day_name, 0) + 1

        # Room usage
        room_usage = {}
        for c in classes:
            room_usage[c.room_number] = room_usage.get(c.room_number, 0) + 1

        # Faculty hours
        fac_hours = {}
        for c in classes:
            fac_hours[c.faculty_name] = fac_hours.get(c.faculty_name, 0) + 1

        return TimetableStats(
            total_slots_scheduled=total_slots_scheduled,
            room_utilization_percent=round(room_utilization, 1),
            faculty_utilization_percent=round(faculty_utilization, 1),
            student_gap_hours=gap_hours,
            daily_distribution=daily_dist,
            room_usage=room_usage,
            faculty_hours=fac_hours
        )

    def _empty_stats(self) -> TimetableStats:
        return TimetableStats(
            total_slots_scheduled=0,
            room_utilization_percent=0.0,
            faculty_utilization_percent=0.0,
            student_gap_hours=0,
            daily_distribution={d["name"]: 0 for d in DAYS},
            room_usage={},
            faculty_hours={}
        )
