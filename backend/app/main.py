import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .db import init_db
from .routers import data, optimize, timetable

app = FastAPI(
    title="Intelligent College Timetable Optimization Engine",
    description="DevSprint Hackathon - Automated conflict-free college timetable generation using Google OR-Tools CP-SAT",
    version="1.0.0"
)

# CORS setup for dev and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(data.router)
app.include_router(optimize.router)
app.include_router(timetable.router)

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/api/status")
def get_status():
    return {
        "status": "online",
        "service": "Intelligent College Timetable Optimizer",
        "solver": "Google OR-Tools CP-SAT Engine",
        "version": "1.0.0"
    }

# Mount static directory for frontend
static_dir = os.path.join(os.path.dirname(__file__), "..", "..", "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

    @app.get("/")
    def serve_frontend():
        return FileResponse(os.path.join(static_dir, "index.html"))
