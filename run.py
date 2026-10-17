import uvicorn
import os
import sys

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "127.0.0.1")

    print("=" * 70)
    print("  Intelligent College Timetable Optimization System")
    print("  Powered by Google OR-Tools CP-SAT & FastAPI")
    print("=" * 70)
    print(f"  • Web Application : http://{host}:{port}")
    print(f"  • API Swagger Docs: http://{host}:{port}/docs")
    print(f"  • API Status      : http://{host}:{port}/api/status")
    print("=" * 70)
    print("Press CTRL+C to stop the server.\n")

    uvicorn.run("backend.app.main:app", host=host, port=port, reload=False)
