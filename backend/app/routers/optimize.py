from fastapi import APIRouter
from typing import List, Optional
from ..models import OptimizeRequest, TimetableResult, DiagnosticIssue
from ..db import get_all_college_data, save_schedule
from ..engine.optimizer import TimetableOptimizer
from ..engine.diagnostics import run_diagnostics

router = APIRouter(prefix="/api", tags=["optimization"])

@router.post("/optimize", response_model=TimetableResult)
def generate_timetable(request: Optional[OptimizeRequest] = None):
    req = request or OptimizeRequest()
    data = get_all_college_data()
    optimizer = TimetableOptimizer(data, req)
    result = optimizer.solve()
    
    # Persist the generated schedule in the database
    if result.status in ["OPTIMAL", "FEASIBLE"]:
        save_schedule(result)
        
    return result

@router.get("/diagnostics", response_model=List[DiagnosticIssue])
def get_diagnostics():
    data = get_all_college_data()
    return run_diagnostics(data)
