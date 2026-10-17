from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from ..models import Faculty, Classroom, StudentBatch, Course, CollegeData
from ..db import (
    get_all_college_data,
    populate_sample_data,
    upsert_faculty,
    delete_faculty,
    upsert_classroom,
    delete_classroom,
    upsert_batch,
    delete_batch,
    upsert_course,
    delete_course
)

router = APIRouter(prefix="/api", tags=["data"])

@router.get("/data", response_model=CollegeData)
def get_data():
    return get_all_college_data()

@router.post("/reset-sample")
def reset_sample():
    populate_sample_data()
    return {"message": "Database reset to sample college dataset successfully", "data": get_all_college_data()}

# Faculty Endpoints
@router.post("/faculty", response_model=Faculty)
def create_faculty(faculty: Faculty):
    upsert_faculty(faculty)
    return faculty

@router.put("/faculty/{faculty_id}", response_model=Faculty)
def update_faculty(faculty_id: str, faculty: Faculty):
    faculty.id = faculty_id
    upsert_faculty(faculty)
    return faculty

@router.delete("/faculty/{faculty_id}")
def remove_faculty(faculty_id: str):
    delete_faculty(faculty_id)
    return {"message": f"Faculty {faculty_id} deleted"}

# Classroom Endpoints
@router.post("/classrooms", response_model=Classroom)
def create_classroom(classroom: Classroom):
    upsert_classroom(classroom)
    return classroom

@router.put("/classrooms/{room_id}", response_model=Classroom)
def update_classroom(room_id: str, classroom: Classroom):
    classroom.id = room_id
    upsert_classroom(classroom)
    return classroom

@router.delete("/classrooms/{room_id}")
def remove_classroom(room_id: str):
    delete_classroom(room_id)
    return {"message": f"Classroom {room_id} deleted"}

# Batch Endpoints
@router.post("/batches", response_model=StudentBatch)
def create_batch(batch: StudentBatch):
    upsert_batch(batch)
    return batch

@router.put("/batches/{batch_id}", response_model=StudentBatch)
def update_batch(batch_id: str, batch: StudentBatch):
    batch.id = batch_id
    upsert_batch(batch)
    return batch

@router.delete("/batches/{batch_id}")
def remove_batch(batch_id: str):
    delete_batch(batch_id)
    return {"message": f"Batch {batch_id} deleted"}

# Course Endpoints
@router.post("/courses", response_model=Course)
def create_course(course: Course):
    upsert_course(course)
    return course

@router.put("/courses/{course_id}", response_model=Course)
def update_course(course_id: str, course: Course):
    course.id = course_id
    upsert_course(course)
    return course

@router.delete("/courses/{course_id}")
def remove_course(course_id: str):
    delete_course(course_id)
    return {"message": f"Course {course_id} deleted"}
