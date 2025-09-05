from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import os
import uuid
import asyncio
from datetime import datetime
import logging

from .gemini_client import gemini_client
from .models import *
from .services import UIGenerationService, ChatService, PreviewService
from .websocket_manager import WebSocketManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Magic UI Elite API",
    description="Elite AI-powered UI generation platform with real-time neural network visualization",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://magic-ui-elite.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
ui_service = UIGenerationService()
chat_service = ChatService()
preview_service = PreviewService()
ws_manager = WebSocketManager()

# Pydantic models
class GenerationRequest(BaseModel):
    brief: str
    mood: Optional[str] = "futuristic"
    style_preferences: Optional[List[str]] = []
    target_platforms: Optional[List[str]] = ["web"]
    accessibility_level: Optional[str] = "AA"

class ChatMessage(BaseModel):
    role: str
    text: str
    agent: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = {}

class PatchRequest(BaseModel):
    variant_id: str
    target: str  # "UI_SCHEMA", "STYLE_SPEC", "code"
    patches: List[Dict[str, Any]]

class ExportRequest(BaseModel):
    variant_ids: List[str]
    format: str = "zip"  # "zip", "vercel", "docker"
    include_assets: bool = True
    optimize: bool = True

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

# Generation endpoints
@app.post("/api/generate")
async def generate_ui(request: GenerationRequest, background_tasks: BackgroundTasks):
    """Generate UI variants from user brief"""
    try:
        logger.info(f"Generating UI for brief: {request.brief[:50]}...")
        
        # Generate UI schema
        ui_schema = await gemini_client.generate_ui_schema(request.brief, request.mood)
        
        # Generate style variants
        style_variants = []
        style_names = ["retro-futurism-mesh", "glass-aurora", "brutalist-editorial", "minimal-monochrome"]
        
        for i, style_name in enumerate(style_names):
            style_spec = await gemini_client.generate_style_spec(ui_schema, style_name)
            style_variants.append(style_spec)
        
        # Generate code for each variant
        variants = []
        for i, (style_spec, style_name) in enumerate(zip(style_variants, style_names)):
            variant_id = f"v{i+1}"
            
            # Generate code
            code_files = await gemini_client.generate_code(ui_schema, style_spec, variant_id)
            
            # Create preview
            preview_path = await preview_service.create_preview(variant_id, code_files, style_spec)
            
            # Analyze quality
            quality_scores = await gemini_client.analyze_design_quality(ui_schema, style_spec)
            
            variant = {
                "id": variant_id,
                "name": style_name.replace("-", " ").title(),
                "style": style_name,
                "style_spec": style_spec,
                "build": f"./out/{variant_id}",
                "preview": preview_path,
                "novelty": style_spec.get("novelty_score", 0.8),
                "metadata": {
                    "width": 1200,
                    "height": 800,
                    "responsive": True,
                    "quality_scores": quality_scores
                }
            }
            variants.append(variant)
        
        # Create manifest
        manifest = {
            "brief": request.brief,
            "ui_schema_path": "UI_SCHEMA.json",
            "variants": variants,
            "preview_manifest": "preview-manifest.json",
            "generated_at": datetime.now().isoformat(),
            "version": "1.0.0"
        }
        
        # Save manifest
        os.makedirs("generated", exist_ok=True)
        with open("generated/preview-manifest.json", "w") as f:
            json.dump(manifest, f, indent=2)
        
        # Broadcast update via WebSocket
        await ws_manager.broadcast({
            "type": "generation_complete",
            "data": manifest
        })
        
        return {
            "success": True,
            "manifest": manifest,
            "processing_time": 0  # Will be calculated in real implementation
        }
        
    except Exception as e:
        logger.error(f"Error generating UI: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/preview/manifest")
async def get_preview_manifest():
    """Get current preview manifest"""
    try:
        if os.path.exists("generated/preview-manifest.json"):
            with open("generated/preview-manifest.json", "r") as f:
                return json.load(f)
        else:
            # Return empty manifest if none exists
            return {
                "brief": "",
                "ui_schema_path": "",
                "variants": [],
                "preview_manifest": "",
                "generated_at": datetime.now().isoformat(),
                "version": "1.0.0"
            }
    except Exception as e:
        logger.error(f"Error getting preview manifest: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Chat endpoints
@app.post("/api/chat")
async def send_chat_message(message: ChatMessage):
    """Send chat message and get AI response"""
    try:
        # Generate AI response
        context = {
            "current_manifest": await get_preview_manifest(),
            "selected_agent": message.agent
        }
        
        ai_response = await gemini_client.generate_chat_response(message.text, context)
        
        # Create response message
        response_message = {
            "id": str(uuid.uuid4()),
            "role": "agent",
            "agent": message.agent or "AI Assistant",
            "text": ai_response,
            "timestamp": datetime.now(),
            "metadata": {}
        }
        
        # Save to chat history
        await chat_service.save_message(message.dict())
        await chat_service.save_message(response_message)
        
        # Broadcast via WebSocket
        await ws_manager.broadcast({
            "type": "chat_message",
            "data": response_message
        })
        
        return response_message
        
    except Exception as e:
        logger.error(f"Error processing chat message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chat/history")
async def get_chat_history(limit: int = 50):
    """Get chat history"""
    try:
        return await chat_service.get_history(limit)
    except Exception as e:
        logger.error(f"Error getting chat history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Patch endpoints
@app.post("/api/patch")
async def apply_patch(request: PatchRequest):
    """Apply patches to UI schema, style spec, or code"""
    try:
        # Get current manifest
        manifest = await get_preview_manifest()
        
        # Find the variant
        variant = next((v for v in manifest["variants"] if v["id"] == request.variant_id), None)
        if not variant:
            raise HTTPException(status_code=404, detail="Variant not found")
        
        # Apply patches based on target
        if request.target == "UI_SCHEMA":
            # Apply patches to UI schema
            updated_schema = apply_json_patches(manifest.get("ui_schema", {}), request.patches)
            manifest["ui_schema"] = updated_schema
        elif request.target == "STYLE_SPEC":
            # Apply patches to style spec
            updated_style_spec = apply_json_patches(variant["style_spec"], request.patches)
            variant["style_spec"] = updated_style_spec
        elif request.target == "code":
            # Regenerate code with updated schema/style
            code_files = await gemini_client.generate_code(
                manifest.get("ui_schema", {}),
                variant["style_spec"],
                request.variant_id
            )
            # Update preview
            preview_path = await preview_service.create_preview(
                request.variant_id, 
                code_files, 
                variant["style_spec"]
            )
            variant["preview"] = preview_path
        
        # Save updated manifest
        with open("generated/preview-manifest.json", "w") as f:
            json.dump(manifest, f, indent=2)
        
        # Broadcast update
        await ws_manager.broadcast({
            "type": "patch_applied",
            "data": {"variant_id": request.variant_id, "target": request.target}
        })
        
        return {
            "success": True,
            "updated_manifest": manifest
        }
        
    except Exception as e:
        logger.error(f"Error applying patch: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Export endpoints
@app.post("/api/export")
async def export_variants(request: ExportRequest):
    """Export selected variants"""
    try:
        manifest = await get_preview_manifest()
        selected_variants = [v for v in manifest["variants"] if v["id"] in request.variant_ids]
        
        if not selected_variants:
            raise HTTPException(status_code=404, detail="No variants found")
        
        # Create export package
        export_path = await preview_service.create_export(
            selected_variants, 
            request.format, 
            request.include_assets, 
            request.optimize
        )
        
        return {
            "success": True,
            "download_url": f"/api/download/{os.path.basename(export_path)}",
            "format": request.format
        }
        
    except Exception as e:
        logger.error(f"Error exporting variants: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/download/{filename}")
async def download_file(filename: str):
    """Download exported file"""
    file_path = f"exports/{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=filename)
    else:
        raise HTTPException(status_code=404, detail="File not found")

# Agent endpoints
@app.get("/api/agents")
async def get_agents():
    """Get available agents"""
    return [
        {
            "id": "architect",
            "name": "Design Architect",
            "role": "UI Structure",
            "description": "Creates semantic UI schemas and component hierarchies",
            "status": "idle",
            "last_activity": datetime.now(),
            "capabilities": ["UI Schema Generation", "Component Design", "Accessibility Planning"]
        },
        {
            "id": "curator",
            "name": "Style Curator",
            "role": "Visual Design",
            "description": "Crafts unique visual styles and design systems",
            "status": "working",
            "last_activity": datetime.now(),
            "capabilities": ["Style Generation", "Color Theory", "Typography", "Trend Analysis"]
        },
        {
            "id": "generator",
            "name": "Code Generator",
            "role": "Implementation",
            "description": "Converts designs into production-ready code",
            "status": "idle",
            "last_activity": datetime.now(),
            "capabilities": ["Next.js", "React", "TypeScript", "Tailwind CSS"]
        },
        {
            "id": "previewer",
            "name": "Preview Engine",
            "role": "Live Preview",
            "description": "Manages real-time preview generation and updates",
            "status": "idle",
            "last_activity": datetime.now(),
            "capabilities": ["Live Preview", "Hot Reload", "Responsive Testing"]
        },
        {
            "id": "qa",
            "name": "QA Engineer",
            "role": "Quality Assurance",
            "description": "Ensures accessibility, performance, and code quality",
            "status": "idle",
            "last_activity": datetime.now(),
            "capabilities": ["Accessibility Testing", "Performance Analysis", "Code Review"]
        },
        {
            "id": "exporter",
            "name": "Export Manager",
            "role": "Deployment",
            "description": "Packages and deploys final designs",
            "status": "idle",
            "last_activity": datetime.now(),
            "capabilities": ["Export Generation", "Deployment", "Asset Optimization"]
        }
    ]

@app.get("/api/agents/{agent_id}")
async def get_agent_status(agent_id: str):
    """Get specific agent status"""
    agents = await get_agents()
    agent = next((a for a in agents if a["id"] == agent_id), None)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

# Gemini API endpoints
@app.post("/api/gemini")
async def call_gemini(request: Dict[str, Any]):
    """Direct Gemini API call"""
    try:
        prompt = request.get("prompt", "")
        model = request.get("model", "gemini-pro")
        temperature = request.get("temperature", 0.7)
        max_tokens = request.get("max_tokens", 1024)
        
        # Configure model
        genai_model = genai.GenerativeModel(model)
        
        response = genai_model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
            )
        )
        
        return {
            "success": True,
            "content": response.text,
            "usage": {
                "prompt_tokens": len(prompt.split()),
                "completion_tokens": len(response.text.split()),
                "total_tokens": len(prompt.split()) + len(response.text.split())
            }
        }
        
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        return {
            "success": False,
            "error": str(e)
        }

# Metrics endpoints
@app.get("/api/metrics")
async def get_performance_metrics():
    """Get performance metrics"""
    return [
        {
            "generation_time": 2.5,
            "quality_score": 0.92,
            "accessibility_score": 0.88,
            "novelty_score": 0.85,
            "user_satisfaction": 0.90,
            "timestamp": datetime.now()
        }
    ]

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket connection for real-time updates"""
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            await ws_manager.handle_message(websocket, message)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

# Utility functions
def apply_json_patches(obj: Dict[str, Any], patches: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Apply JSON patches to an object"""
    result = obj.copy()
    
    for patch in patches:
        op = patch.get("op")
        path = patch.get("path", "")
        value = patch.get("value")
        
        if op == "replace":
            # Simple path replacement (for demo)
            keys = path.strip("/").split("/")
            current = result
            for key in keys[:-1]:
                current = current[key]
            current[keys[-1]] = value
        elif op == "add":
            keys = path.strip("/").split("/")
            current = result
            for key in keys[:-1]:
                if key not in current:
                    current[key] = {}
                current = current[key]
            current[keys[-1]] = value
    
    return result

# Mount static files
app.mount("/previews", StaticFiles(directory="previews"), name="previews")
app.mount("/exports", StaticFiles(directory="exports"), name="exports")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)