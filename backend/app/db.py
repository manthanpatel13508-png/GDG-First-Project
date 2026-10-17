import sqlite3
import json
import os
from typing import Dict, Any, List, Optional
from .models import Faculty, Classroom, StudentBatch, Course, CollegeData, TimetableResult
from .sample_data import get_sample_college_data

DB_PATH = os.environ.get("TIMETABLE_DB_PATH", os.path.join(os.path.dirname(__file__), "..", "..", "timetable.db"))

def get_connection():
    os.makedirs(os.path.dirname(os.path.abspath(DB_PATH)), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def _create_tables(cursor):
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS faculty (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        department TEXT,
        data TEXT NOT NULL
    );
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS classrooms (
        id TEXT PRIMARY KEY,
        room_number TEXT NOT NULL,
        type TEXT,
        data TEXT NOT NULL
    );
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS batches (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        semester INTEGER,
        data TEXT NOT NULL
    );
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        data TEXT NOT NULL
    );
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status TEXT NOT NULL,
        generated_at TEXT NOT NULL,
        score REAL,
        execution_time_ms REAL,
        data TEXT NOT NULL
    );
    """)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    _create_tables(cursor)
    conn.commit()

    # Check if empty, populate with default sample data
    cursor.execute("SELECT COUNT(*) FROM faculty")
    count = cursor.fetchone()[0]
    if count == 0:
        populate_sample_data(conn)
    conn.close()

def populate_sample_data(conn=None):
    close_at_end = False
    if conn is None:
        conn = get_connection()
        close_at_end = True
    cursor = conn.cursor()
    _create_tables(cursor)
    cursor.execute("DELETE FROM faculty")
    cursor.execute("DELETE FROM classrooms")
    cursor.execute("DELETE FROM batches")
    cursor.execute("DELETE FROM courses")

    sample = get_sample_college_data()
    for f in sample["faculty"]:
        cursor.execute("INSERT INTO faculty (id, name, department, data) VALUES (?, ?, ?, ?)",
                       (f["id"], f["name"], f.get("department", ""), json.dumps(f)))
    for r in sample["classrooms"]:
        cursor.execute("INSERT INTO classrooms (id, room_number, type, data) VALUES (?, ?, ?, ?)",
                       (r["id"], r["room_number"], r.get("type", "lecture_hall"), json.dumps(r)))
    for b in sample["batches"]:
        cursor.execute("INSERT INTO batches (id, name, semester, data) VALUES (?, ?, ?, ?)",
                       (b["id"], b["name"], b.get("semester", 1), json.dumps(b)))
    for c in sample["courses"]:
        cursor.execute("INSERT INTO courses (id, code, name, data) VALUES (?, ?, ?, ?)",
                       (c["id"], c["code"], c["name"], json.dumps(c)))
    conn.commit()
    if close_at_end:
        conn.close()

def get_all_college_data() -> CollegeData:
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT data FROM faculty ORDER BY name")
    faculty = [Faculty(**json.loads(row["data"])) for row in cursor.fetchall()]
    
    cursor.execute("SELECT data FROM classrooms ORDER BY room_number")
    classrooms = [Classroom(**json.loads(row["data"])) for row in cursor.fetchall()]
    
    cursor.execute("SELECT data FROM batches ORDER BY name")
    batches = [StudentBatch(**json.loads(row["data"])) for row in cursor.fetchall()]
    
    cursor.execute("SELECT data FROM courses ORDER BY code")
    courses = [Course(**json.loads(row["data"])) for row in cursor.fetchall()]
    
    conn.close()
    return CollegeData(faculty=faculty, classrooms=classrooms, batches=batches, courses=courses)

def save_schedule(result: TimetableResult):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO schedules (status, generated_at, score, execution_time_ms, data)
    VALUES (?, ?, ?, ?, ?)
    """, (
        result.status,
        result.generated_at or "",
        result.score or 0.0,
        result.execution_time_ms or 0.0,
        result.model_dump_json()
    ))
    conn.commit()
    conn.close()

def get_latest_schedule() -> Optional[TimetableResult]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT data FROM schedules ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return TimetableResult(**json.loads(row["data"]))
    return None

# Entity CRUD Helpers
def upsert_faculty(f: Faculty):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO faculty (id, name, department, data) VALUES (?, ?, ?, ?)",
                   (f.id, f.name, f.department, f.model_dump_json()))
    conn.commit()
    conn.close()

def delete_faculty(faculty_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM faculty WHERE id = ?", (faculty_id,))
    conn.commit()
    conn.close()

def upsert_classroom(c: Classroom):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO classrooms (id, room_number, type, data) VALUES (?, ?, ?, ?)",
                   (c.id, c.room_number, c.type.value, c.model_dump_json()))
    conn.commit()
    conn.close()

def delete_classroom(room_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM classrooms WHERE id = ?", (room_id,))
    conn.commit()
    conn.close()

def upsert_batch(b: StudentBatch):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO batches (id, name, semester, data) VALUES (?, ?, ?, ?)",
                   (b.id, b.name, b.semester, b.model_dump_json()))
    conn.commit()
    conn.close()

def delete_batch(batch_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM batches WHERE id = ?", (batch_id,))
    conn.commit()
    conn.close()

def upsert_course(c: Course):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO courses (id, code, name, data) VALUES (?, ?, ?, ?)",
                   (c.id, c.code, c.name, c.model_dump_json()))
    conn.commit()
    conn.close()

def delete_course(course_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM courses WHERE id = ?", (course_id,))
    conn.commit()
    conn.close()
