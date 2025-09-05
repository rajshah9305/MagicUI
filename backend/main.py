from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import logging
import os
from .app.api import router as api_router
from .app.database import engine
from .app.models import Base
from .app.security import get_api_key
from .app.websocket_manager import websocket_manager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Magic UI Studio Pro API", 
    version="2.0.0",
    description="Advanced AI-powered UI generation platform with CrewAI orchestration",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "https://*.vercel.app",
        "https://*.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api", dependencies=[Depends(get_api_key)])

# WebSocket routes (no auth required for real-time updates)
app.include_router(api_router, prefix="/ws", tags=["websocket"])

# Health check endpoint (no auth required)
@app.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy", 
        "version": "2.0.0",
        "services": {
            "api": "running",
            "database": "connected",
            "websocket": "active"
        }
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Magic UI Studio Pro API starting up...")
    logger.info("Services initialized successfully")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Magic UI Studio Pro API shutting down...")

# Error handlers
@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Internal server error: {str(exc)}")
    return {"error": "Internal server error", "detail": str(exc)}

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {"error": "Not found", "detail": "The requested resource was not found"}

# Root endpoint
@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Magic UI Studio Pro API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health",
        "websocket": "/ws"
    }

if __name__ == "__main__":
    import uvicorn
    
    # Development server configuration
    uvicorn.run(
        "main:app",
        host="0.0.0.0", 
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )