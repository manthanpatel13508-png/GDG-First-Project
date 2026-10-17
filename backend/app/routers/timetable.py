import io
import csv
from fastapi import APIRouter, Response, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse
from typing import Optional, Dict, Any
from ..models import TimetableResult, DAYS, TIME_SLOTS
from ..db import get_latest_schedule

router = APIRouter(prefix="/api/timetable", tags=["timetable"])

@router.get("/latest", response_model=Optional[TimetableResult])
def get_latest():
    res = get_latest_schedule()
    return res

@router.get("/constants")
def get_constants():
    return {
        "days": DAYS,
        "time_slots": TIME_SLOTS
    }

@router.get("/export/csv")
def export_csv():
    res = get_latest_schedule()
    if not res or not res.classes:
        raise HTTPException(status_code=404, detail="No generated timetable found to export.")

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Day", "Slot Index", "Time Slot", "Course Code", "Course Name",
        "Student Batch", "Faculty Name", "Room Number", "Session Type"
    ])

    for entry in res.classes:
        writer.writerow([
            entry.day_name,
            entry.slot + 1,
            entry.time_label,
            entry.course_code,
            entry.course_name,
            entry.batch_name,
            entry.faculty_name,
            entry.room_number,
            entry.session_type.value.upper()
        ])

    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=college_timetable.csv"}
    )
