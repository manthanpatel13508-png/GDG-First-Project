from typing import List, Dict
from ..models import CollegeData, DiagnosticIssue, DAYS, TIME_SLOTS, RoomType

def run_diagnostics(data: CollegeData) -> List[DiagnosticIssue]:
    """
    Analyzes input data for feasibility issues, bottlenecks, and conflicts
    before or after timetable generation.
    """
    issues: List[DiagnosticIssue] = []

    faculty_map = {f.id: f for f in data.faculty}
    room_map = {r.id: r for r in data.classrooms}
    batch_map = {b.id: b for b in data.batches}

    total_days = len(DAYS)
    slots_per_day = len(TIME_SLOTS)
    total_slots = total_days * slots_per_day  # e.g., 5 * 6 = 30 slots

    # 1. Check for missing entities referenced in courses
    for course in data.courses:
        if course.faculty_id not in faculty_map:
            issues.append(DiagnosticIssue(
                severity="error",
                category="missing_faculty",
                entity_id=course.id,
                entity_name=course.name,
                message=f"Course '{course.code} - {course.name}' references non-existent faculty ID '{course.faculty_id}'.",
                suggestion="Assign an active faculty member to this course."
            ))
        if course.batch_id not in batch_map:
            issues.append(DiagnosticIssue(
                severity="error",
                category="missing_batch",
                entity_id=course.id,
                entity_name=course.name,
                message=f"Course '{course.code} - {course.name}' references non-existent batch ID '{course.batch_id}'.",
                suggestion="Assign a valid student batch/section to this course."
            ))

    # 2. Check Batch Total Hours vs Available Slots
    batch_hours: Dict[str, int] = {b.id: 0 for b in data.batches}
    for course in data.courses:
        hrs = course.lectures_per_week + (course.labs_per_week * course.lab_duration_hours)
        if course.batch_id in batch_hours:
            batch_hours[course.batch_id] += hrs

    for b in data.batches:
        req_hrs = batch_hours.get(b.id, 0)
        if req_hrs > total_slots:
            issues.append(DiagnosticIssue(
                severity="error",
                category="batch_overload",
                entity_id=b.id,
                entity_name=b.name,
                message=f"Batch '{b.name}' requires {req_hrs} class hours/week, exceeding max available slots ({total_slots} slots).",
                suggestion="Reduce the number of lectures/labs or add Saturday/additional time slots."
            ))
        elif req_hrs > total_slots * 0.9:
            issues.append(DiagnosticIssue(
                severity="warning",
                category="batch_heavy_load",
                entity_id=b.id,
                entity_name=b.name,
                message=f"Batch '{b.name}' has {req_hrs}/{total_slots} slots booked ({(req_hrs/total_slots)*100:.0f}% schedule density). Gaps and breaks will be tight.",
                suggestion="Consider balancing workload across semesters."
            ))

    # 3. Check Room Capacities and Types
    for course in data.courses:
        batch = batch_map.get(course.batch_id)
        if not batch:
            continue
        
        # Rooms that match type and capacity
        exact_matching_rooms = [
            r for r in data.classrooms
            if r.type == course.room_type_required and r.capacity >= batch.size
        ]
        
        if not exact_matching_rooms:
            # Check if any room exists with this type regardless of capacity
            type_rooms = [r for r in data.classrooms if r.type == course.room_type_required]
            if not type_rooms:
                issues.append(DiagnosticIssue(
                    severity="error",
                    category="room_shortage",
                    entity_id=course.id,
                    entity_name=course.name,
                    message=f"Course '{course.code}' requires '{course.room_type_required.value}', but no classrooms of that type exist in the college.",
                    suggestion=f"Add a new classroom of type '{course.room_type_required.value}' or change course room requirement."
                ))
            else:
                max_cap = max((r.capacity for r in type_rooms), default=0)
                issues.append(DiagnosticIssue(
                    severity="error",
                    category="room_capacity",
                    entity_id=course.id,
                    entity_name=course.name,
                    message=f"Batch '{batch.name}' has size {batch.size}, but largest '{course.room_type_required.value}' has capacity {max_cap}.",
                    suggestion=f"Increase room capacity of {type_rooms[0].room_number} to at least {batch.size} or split the batch."
                ))

    # 4. Check Lab Room Hours Demand vs Lab Room Capacity
    lab_hours_demanded = sum(
        c.labs_per_week * c.lab_duration_hours
        for c in data.courses
        if c.room_type_required in [RoomType.COMPUTER_LAB, RoomType.ELECTRONICS_LAB]
    )
    total_lab_rooms = len([
        r for r in data.classrooms
        if r.type in [RoomType.COMPUTER_LAB, RoomType.ELECTRONICS_LAB]
    ])
    max_lab_capacity_hours = total_lab_rooms * total_slots
    if lab_hours_demanded > max_lab_capacity_hours:
        issues.append(DiagnosticIssue(
            severity="error",
            category="room_shortage",
            message=f"Total requested laboratory hours ({lab_hours_demanded} hrs) exceed total laboratory room capacity ({max_lab_capacity_hours} hrs across {total_lab_rooms} lab rooms).",
            suggestion="Add more computer/electronics labs or reduce weekly lab hours."
        ))

    # 5. Check Faculty Teaching Load & Unavailability
    faculty_hours: Dict[str, int] = {f.id: 0 for f in data.faculty}
    for course in data.courses:
        hrs = course.lectures_per_week + (course.labs_per_week * course.lab_duration_hours)
        if course.faculty_id in faculty_hours:
            faculty_hours[course.faculty_id] += hrs

    for f in data.faculty:
        assigned_hrs = faculty_hours.get(f.id, 0)
        if assigned_hrs > f.max_hours_per_week:
            issues.append(DiagnosticIssue(
                severity="error",
                category="faculty_overload",
                entity_id=f.id,
                entity_name=f.name,
                message=f"Faculty '{f.name}' is assigned {assigned_hrs} hours/week, which exceeds their maximum limit of {f.max_hours_per_week} hours.",
                suggestion=f"Increase '{f.name}' max hours or reassign courses to co-faculty."
            ))

        # Check unavailable slots vs required hours
        unavail_count = len(f.unavailable_slots)
        available_slots = total_slots - unavail_count
        if assigned_hrs > available_slots:
            issues.append(DiagnosticIssue(
                severity="error",
                category="unavailability_conflict",
                entity_id=f.id,
                entity_name=f.name,
                message=f"Faculty '{f.name}' requires {assigned_hrs} hours, but only has {available_slots} available slots due to {unavail_count} unavailable periods.",
                suggestion=f"Remove some unavailable slot constraints for '{f.name}'."
            ))
        elif assigned_hrs > available_slots * 0.85:
            issues.append(DiagnosticIssue(
                severity="warning",
                category="unavailability_tight",
                entity_id=f.id,
                entity_name=f.name,
                message=f"Faculty '{f.name}' schedule flexibility is very low ({assigned_hrs} teaching hours vs {available_slots} available slots).",
                suggestion="Consider loosening some preferred unavailable slots to reduce solver bottlenecks."
            ))

    return issues
