from typing import Dict, Any

def get_sample_college_data() -> Dict[str, Any]:
    return {
        "faculty": [
            {
                "id": "FAC_TURING",
                "name": "Dr. Alan Turing",
                "department": "Computer Science & Engineering",
                "email": "a.turing@univ.edu",
                "max_hours_per_week": 16,
                "max_hours_per_day": 4,
                "unavailable_slots": [
                    {"day": 0, "slot": 0},  # Monday 09:00-10:00 (HOD Admin Meeting)
                    {"day": 2, "slot": 4},  # Wednesday 14:00-15:00 (Research Lab)
                ],
                "color": "#3b82f6"
            },
            {
                "id": "FAC_LOVELACE",
                "name": "Prof. Ada Lovelace",
                "department": "Computer Science & Engineering",
                "email": "a.lovelace@univ.edu",
                "max_hours_per_week": 15,
                "max_hours_per_day": 4,
                "unavailable_slots": [
                    {"day": 1, "slot": 0},  # Tuesday 09:00-10:00 (Admissions committee)
                    {"day": 4, "slot": 5},  # Friday 15:00-16:00 (Office hours)
                ],
                "color": "#ec4899"
            },
            {
                "id": "FAC_SHANNON",
                "name": "Dr. Claude Shannon",
                "department": "Information & Network Systems",
                "email": "c.shannon@univ.edu",
                "max_hours_per_week": 16,
                "max_hours_per_day": 4,
                "unavailable_slots": [
                    {"day": 3, "slot": 0},  # Thursday 09:00-10:00
                    {"day": 3, "slot": 1},  # Thursday 10:00-11:00 (IEEE Review)
                ],
                "color": "#10b981"
            },
            {
                "id": "FAC_HOPPER",
                "name": "Dr. Grace Hopper",
                "department": "Computer Science & Engineering",
                "email": "g.hopper@univ.edu",
                "max_hours_per_week": 16,
                "max_hours_per_day": 4,
                "unavailable_slots": [
                    {"day": 0, "slot": 5},  # Monday 15:00-16:00 (Lab Supervision)
                ],
                "color": "#f59e0b"
            },
            {
                "id": "FAC_NEUMANN",
                "name": "Prof. John von Neumann",
                "department": "Mathematics & Architecture",
                "email": "j.vneumann@univ.edu",
                "max_hours_per_week": 15,
                "max_hours_per_day": 4,
                "unavailable_slots": [
                    {"day": 2, "slot": 0},  # Wednesday 09:00-10:00
                    {"day": 2, "slot": 1},  # Wednesday 10:00-11:00
                ],
                "color": "#8b5cf6"
            },
            {
                "id": "FAC_KNUTH",
                "name": "Dr. Donald Knuth",
                "department": "Computer Science & Engineering",
                "email": "d.knuth@univ.edu",
                "max_hours_per_week": 14,
                "max_hours_per_day": 4,
                "unavailable_slots": [
                    {"day": 4, "slot": 0},  # Friday morning writing
                ],
                "color": "#06b6d4"
            },
            {
                "id": "FAC_LISKOV",
                "name": "Prof. Barbara Liskov",
                "department": "Software Engineering & Systems",
                "email": "b.liskov@univ.edu",
                "max_hours_per_week": 16,
                "max_hours_per_day": 4,
                "unavailable_slots": [
                    {"day": 1, "slot": 4},  # Tuesday afternoon seminar
                ],
                "color": "#14b8a6"
            },
            {
                "id": "FAC_BERNERS_LEE",
                "name": "Dr. Tim Berners-Lee",
                "department": "Web Technologies & Distributed Systems",
                "email": "t.blee@univ.edu",
                "max_hours_per_week": 14,
                "max_hours_per_day": 4,
                "unavailable_slots": [
                    {"day": 3, "slot": 4},  # Thursday afternoon consortium
                    {"day": 3, "slot": 5},
                ],
                "color": "#ef4444"
            }
        ],
        "classrooms": [
            {
                "id": "ROOM_LH101",
                "room_number": "LH-101 (Turing Hall)",
                "capacity": 60,
                "type": "lecture_hall",
                "building": "Main Academic Block (Ground Fl)"
            },
            {
                "id": "ROOM_LH102",
                "room_number": "LH-102 (Lovelace Hall)",
                "capacity": 55,
                "type": "lecture_hall",
                "building": "Main Academic Block (1st Fl)"
            },
            {
                "id": "ROOM_LH201",
                "room_number": "LH-201 (Shannon Hall)",
                "capacity": 50,
                "type": "lecture_hall",
                "building": "Science & Tech Annex"
            },
            {
                "id": "ROOM_LAB101",
                "room_number": "LAB-101 (Advanced Computing)",
                "capacity": 45,
                "type": "computer_lab",
                "building": "CS Center (2nd Fl)"
            },
            {
                "id": "ROOM_LAB102",
                "room_number": "LAB-102 (Software & Systems)",
                "capacity": 45,
                "type": "computer_lab",
                "building": "CS Center (3rd Fl)"
            },
            {
                "id": "ROOM_SEM301",
                "room_number": "SEM-301 (Auditorium)",
                "capacity": 70,
                "type": "seminar_hall",
                "building": "Central Library Complex"
            }
        ],
        "batches": [
            {
                "id": "BATCH_CS_Y2A",
                "name": "B.Tech CSE - Year 2 (Sec A)",
                "department": "Computer Science & Engineering",
                "semester": 4,
                "size": 42
            },
            {
                "id": "BATCH_CS_Y2B",
                "name": "B.Tech CSE - Year 2 (Sec B)",
                "department": "Computer Science & Engineering",
                "semester": 4,
                "size": 40
            },
            {
                "id": "BATCH_CS_Y3AI",
                "name": "B.Tech CSE - Year 3 (AI & Data Science)",
                "department": "Computer Science & Engineering",
                "semester": 6,
                "size": 44
            },
            {
                "id": "BATCH_CS_Y4SYS",
                "name": "B.Tech CSE - Year 4 (Cloud & Distributed)",
                "department": "Computer Science & Engineering",
                "semester": 8,
                "size": 38
            }
        ],
        "courses": [
            # Batch CS_Y2A Courses
            {
                "id": "CRS_CS201",
                "code": "CS201",
                "name": "Data Structures & Algorithms",
                "faculty_id": "FAC_KNUTH",
                "batch_id": "BATCH_CS_Y2A",
                "lectures_per_week": 3,
                "labs_per_week": 1,
                "lab_duration_hours": 2,
                "room_type_required": "computer_lab",
                "color": "#0284c7"
            },
            {
                "id": "CRS_CS202",
                "code": "CS202",
                "name": "Computer Organization & Architecture",
                "faculty_id": "FAC_NEUMANN",
                "batch_id": "BATCH_CS_Y2A",
                "lectures_per_week": 3,
                "labs_per_week": 0,
                "lab_duration_hours": 2,
                "room_type_required": "lecture_hall",
                "color": "#7c3aed"
            },
            {
                "id": "CRS_CS203",
                "code": "CS203",
                "name": "Discrete Mathematics",
                "faculty_id": "FAC_SHANNON",
                "batch_id": "BATCH_CS_Y2A",
                "lectures_per_week": 3,
                "labs_per_week": 0,
                "lab_duration_hours": 2,
                "room_type_required": "lecture_hall",
                "color": "#059669"
            },
            # Batch CS_Y2B Courses
            {
                "id": "CRS_CS204",
                "code": "CS204",
                "name": "Object Oriented Programming (Java)",
                "faculty_id": "FAC_LISKOV",
                "batch_id": "BATCH_CS_Y2B",
                "lectures_per_week": 3,
                "labs_per_week": 1,
                "lab_duration_hours": 2,
                "room_type_required": "computer_lab",
                "color": "#0d9488"
            },
            {
                "id": "CRS_CS205",
                "code": "CS205",
                "name": "Database Management Systems",
                "faculty_id": "FAC_HOPPER",
                "batch_id": "BATCH_CS_Y2B",
                "lectures_per_week": 3,
                "labs_per_week": 1,
                "lab_duration_hours": 2,
                "room_type_required": "computer_lab",
                "color": "#d97706"
            },
            {
                "id": "CRS_CS206",
                "code": "CS206",
                "name": "Digital Systems Design",
                "faculty_id": "FAC_NEUMANN",
                "batch_id": "BATCH_CS_Y2B",
                "lectures_per_week": 3,
                "labs_per_week": 0,
                "lab_duration_hours": 2,
                "room_type_required": "lecture_hall",
                "color": "#9333ea"
            },
            # Batch CS_Y3AI Courses
            {
                "id": "CRS_CS301",
                "code": "CS301",
                "name": "Artificial Intelligence & Heuristics",
                "faculty_id": "FAC_TURING",
                "batch_id": "BATCH_CS_Y3AI",
                "lectures_per_week": 3,
                "labs_per_week": 1,
                "lab_duration_hours": 2,
                "room_type_required": "computer_lab",
                "color": "#2563eb"
            },
            {
                "id": "CRS_CS302",
                "code": "CS302",
                "name": "Computer Networks & Protocols",
                "faculty_id": "FAC_SHANNON",
                "batch_id": "BATCH_CS_Y3AI",
                "lectures_per_week": 3,
                "labs_per_week": 0,
                "lab_duration_hours": 2,
                "room_type_required": "lecture_hall",
                "color": "#16a34a"
            },
            {
                "id": "CRS_CS303",
                "code": "CS303",
                "name": "Software Engineering Methodologies",
                "faculty_id": "FAC_LOVELACE",
                "batch_id": "BATCH_CS_Y3AI",
                "lectures_per_week": 3,
                "labs_per_week": 0,
                "lab_duration_hours": 2,
                "room_type_required": "lecture_hall",
                "color": "#db2777"
            },
            # Batch CS_Y4SYS Courses
            {
                "id": "CRS_CS401",
                "code": "CS401",
                "name": "Cloud Computing & DevOps",
                "faculty_id": "FAC_BERNERS_LEE",
                "batch_id": "BATCH_CS_Y4SYS",
                "lectures_per_week": 3,
                "labs_per_week": 1,
                "lab_duration_hours": 2,
                "room_type_required": "computer_lab",
                "color": "#dc2626"
            },
            {
                "id": "CRS_CS402",
                "code": "CS402",
                "name": "Distributed Systems & Consensus",
                "faculty_id": "FAC_LISKOV",
                "batch_id": "BATCH_CS_Y4SYS",
                "lectures_per_week": 3,
                "labs_per_week": 0,
                "lab_duration_hours": 2,
                "room_type_required": "lecture_hall",
                "color": "#0f766e"
            },
            {
                "id": "CRS_CS403",
                "code": "CS403",
                "name": "Principles of Compiler Design",
                "faculty_id": "FAC_HOPPER",
                "batch_id": "BATCH_CS_Y4SYS",
                "lectures_per_week": 3,
                "labs_per_week": 0,
                "lab_duration_hours": 2,
                "room_type_required": "lecture_hall",
                "color": "#b45309"
            },
            {
                "id": "CRS_CS404",
                "code": "CS404",
                "name": "Advanced Seminar on AI Ethics",
                "faculty_id": "FAC_TURING",
                "batch_id": "BATCH_CS_Y4SYS",
                "lectures_per_week": 2,
                "labs_per_week": 0,
                "lab_duration_hours": 2,
                "room_type_required": "seminar_hall",
                "color": "#4338ca"
            }
        ]
    }
