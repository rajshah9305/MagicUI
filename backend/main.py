from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

app = FastAPI(title="Magic UI Studio Pro API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DesignRequest(BaseModel):
    prompt: str
    pageType: str = "landing"
    style: str = "minimalist"
    complexity: str = "medium"
    requirements: List[str] = []

class ChatRequest(BaseModel):
    message: str

class PromptAnalysisRequest(BaseModel):
    prompt: str

@app.post("/api/generate-ui")
async def generate_ui(request: DesignRequest):
    # Mock UI generation
    ui_id = str(uuid.uuid4())
    return {
        "id": ui_id,
        "requestId": ui_id,
        "code": f"// Generated component for: {request.prompt}",
        "preview": f"<div>Preview for: {request.prompt}</div>",
        "components": [],
        "metrics": {
            "novelty": 0.85,
            "quality": 0.92,
            "performance": 0.88,
            "accessibility": 0.94
        }
    }

@app.post("/api/chat")
async def chat(request: ChatRequest):
    return {
        "id": str(uuid.uuid4()),
        "type": "assistant",
        "content": f"I understand you want: {request.message}. Let me generate that for you.",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/analyze-prompt")
async def analyze_prompt(request: PromptAnalysisRequest):
    # Mock prompt analysis
    return {
        "id": str(uuid.uuid4()),
        "prompt": request.prompt,
        "pageType": "landing",
        "style": "minimalist",
        "complexity": "medium",
        "requirements": ["responsive", "accessible", "modern"]
    }

@app.get("/api/agents/status")
async def get_agent_status():
    return [
        {"id": "1", "name": "Design Architect", "status": "idle", "progress": 0},
        {"id": "2", "name": "UI Generator", "status": "idle", "progress": 0},
        {"id": "3", "name": "Style Expert", "status": "idle", "progress": 0},
        {"id": "4", "name": "Code Generator", "status": "idle", "progress": 0},
        {"id": "5", "name": "QA Agent", "status": "idle", "progress": 0},
    ]

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)