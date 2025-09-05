import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import app

# Create directories for static files
os.makedirs("previews", exist_ok=True)
os.makedirs("exports", exist_ok=True)
os.makedirs("generated", exist_ok=True)

if __name__ == "__main__":
    uvicorn.run(
        "app.api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )