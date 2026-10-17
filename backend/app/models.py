from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field

class RoomType(str, Enum):
    LECTURE_HALL = "lecture_hall"
    COMPUTER_LAB = "computer_lab"
    ELECTRONICS_LAB = "electronics_lab"
    SEMINAR_HALL = "seminar_hall"

class SessionType(str, Enum):
    LECTURE = "lecture"
    LAB = "lab"

class UnavailableSlot(BaseModel):
    day: int = Field(..., ge=0, le=4, description="0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday")
    slot: int = Field(..., ge=0, le=5, description="0 to 5 representing periods in the day")

class Faculty(BaseModel):
    id: str
    name: str
    department: str
    email: Optional[str] = ""
    max_hours_per_week: int = Field(default=16, ge=1, le=30)
    max_hours_per_day: int = Field(default=4, ge=1, le=8)
    unavailable_slots: List[UnavailableSlot] = []
    color: Optional[str] = "#3b82f6"

class Classroom(BaseModel):
    id: str
    room_number: str
    capacity: int = Field(..., gt=0)
    type: RoomType = RoomType.LECTURE_HALL
    building: Optional[str] = "Main Academic Block"

class StudentBatch(BaseModel):
    id: str
    name: str
    department: str
    semester: int = Field(..., ge=1, le=8)
    size: int = Field(..., gt=0)

class Course(BaseModel):
    id: str
    code: str
    name: str
    faculty_id: str
    batch_id: str
    lectures_per_week: int = Field(default=3, ge=0, le=10)
    labs_per_week: int = Field(default=0, ge=0, le=5)
    lab_duration_hours: int = Field(default=2, ge=1, le=3)
    room_type_required: RoomType = RoomType.LECTURE_HALL
    color: Optional[str] = "#6366f1"

class CollegeData(BaseModel):
    faculty: List[Faculty] = []
    classrooms: List[Classroom] = []
    batches: List[StudentBatch] = []
    courses: List[Course] = []

class OptimizeRequest(BaseModel):
    timeout_seconds: int = Field(default=10, ge=1, le=60)
    minimize_gaps: bool = True
    balance_daily_load: bool = True
    prefer_morning_core: bool = True

class TimetableSlotEntry(BaseModel):
    id: str
    day: int
    day_name: str
    slot: int
    time_label: str
    course_id: str
    course_code: str
    course_name: str
    batch_id: str
    batch_name: str
    faculty_id: str
    faculty_name: str
    room_id: str
    room_number: str
    session_type: SessionType
    is_lab: bool = False
    color: str = "#3b82f6"

class DiagnosticIssue(BaseModel):
    severity: str  # "error", "warning", "info"
    category: str  # "room_capacity", "room_shortage", "faculty_overload", "batch_overload", "unavailability_conflict"
    entity_id: Optional[str] = None
    entity_name: Optional[str] = None
    message: str
    suggestion: str

class TimetableStats(BaseModel):
    total_slots_scheduled: int
    room_utilization_percent: float
    faculty_utilization_percent: float
    student_gap_hours: int
    daily_distribution: Dict[str, int]
    room_usage: Dict[str, int]
    faculty_hours: Dict[str, int]

class TimetableResult(BaseModel):
    status: str  # "OPTIMAL", "FEASIBLE", "INFEASIBLE", "TIMEOUT", "ERROR"
    score: Optional[float] = 0.0
    execution_time_ms: float = 0.0
    total_classes_scheduled: int = 0
    classes: List[TimetableSlotEntry] = []
    stats: Optional[TimetableStats] = None
    diagnostics: List[DiagnosticIssue] = []
    generated_at: Optional[str] = None

# Constants for Timetable Grid
DAYS = [
    {"index": 0, "name": "Monday", "short": "Mon"},
    {"index": 1, "name": "Tuesday", "short": "Tue"},
    {"index": 2, "name": "Wednesday", "short": "Wed"},
    {"index": 3, "name": "Thursday", "short": "Thu"},
    {"index": 4, "name": "Friday", "short": "Fri"},
]

TIME_SLOTS = [
    {"index": 0, "start": "09:00", "end": "10:00", "label": "09:00 - 10:00", "period": "Period 1"},
    {"index": 1, "start": "10:00", "end": "11:00", "label": "10:00 - 11:00", "period": "Period 2"},
    {"index": 2, "start": "11:15", "end": "12:15", "label": "11:15 - 12:15", "period": "Period 3"},
    {"index": 3, "start": "12:15", "end": "13:15", "label": "12:15 - 13:15", "period": "Period 4"},
    # Lunch 13:15 - 14:00 is unassigned break
    {"index": 4, "start": "14:00", "end": "15:00", "label": "14:00 - 15:00", "period": "Period 5"},
    {"index": 5, "start": "15:00", "end": "16:00", "label": "15:00 - 16:00", "period": "Period 6"},
]
