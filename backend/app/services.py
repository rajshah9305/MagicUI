import uuid
import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, List
from .models import (
    DesignRequest, 
    ChatRequest, 
    PromptAnalysisRequest, 
    DesignIntentResponse,
    UIGenerationResponse,
    ChatResponse,
    AgentStatusResponse,
    MessageType
)
from .crewai_orchestrator import MagicUICrewOrchestrator
from .websocket_manager import websocket_manager
from ..lib.nlp_engine import AdvancedNLPEngine
import os
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# Initialize services
nlp_engine = AdvancedNLPEngine()
crewai_orchestrator = MagicUICrewOrchestrator(
    openai_api_key=os.getenv("OPENAI_API_KEY", "demo-key"),
    websocket_manager=websocket_manager
)

async def generate_ui_advanced(request: DesignRequest) -> UIGenerationResponse:
    """Advanced UI generation using CrewAI and NLP analysis"""
    try:
        # Step 1: Analyze the prompt using NLP engine
        design_intent = await nlp_engine.analyze_prompt(request.prompt)
        
        # Step 2: Generate project ID
        project_id = request.project_id or str(uuid.uuid4())
        
        # Step 3: Broadcast generation start
        await websocket_manager.send_generation_progress(
            progress=0.0, 
            stage="Starting AI analysis", 
            project_id=project_id
        )
        
        # Step 4: Orchestrate UI generation using CrewAI
        generation_result = await crewai_orchestrator.orchestrate_ui_generation(
            design_intent=design_intent,
            project_id=project_id
        )
        
        # Step 5: Broadcast completion
        await websocket_manager.send_generation_complete(
            result=generation_result,
            project_id=project_id
        )
        
        return UIGenerationResponse(
            id=generation_result["id"],
            request_id=generation_result["request_id"],
            code=generation_result["code"],
            preview=generation_result["preview"],
            components=generation_result["components"],
            metrics=generation_result["metrics"],
            status=generation_result["status"],
            created_at=datetime.fromisoformat(generation_result["created_at"])
        )
        
    except Exception as e:
        logger.error(f"Error in UI generation: {str(e)}")
        await websocket_manager.send_error(
            error_message=f"UI generation failed: {str(e)}",
            error_type="generation_error",
            project_id=project_id
        )
        raise

def generate_ui_mock(request: DesignRequest) -> Dict[str, Any]:
    """Mock UI generation service for backward compatibility"""
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

async def chat_advanced(request: ChatRequest) -> ChatResponse:
    """Advanced chat service with NLP analysis and context awareness"""
    try:
        # Analyze the message for design intent
        if len(request.message) > 20:  # Only analyze substantial messages
            design_intent = await nlp_engine.analyze_prompt(request.message)
            
            # Generate contextual response
            if design_intent.confidence > 0.7:
                response_content = f"I can help you create a {design_intent.page_type} with {', '.join(design_intent.style_preferences)} styling. Would you like me to start generating this UI?"
                suggestions = [
                    "Generate this UI now",
                    "Modify the requirements",
                    "Show me examples",
                    "Explain the approach"
                ]
            else:
                response_content = "I'd be happy to help you create a UI! Could you provide more details about what you'd like to build?"
                suggestions = [
                    "Create a login page",
                    "Build a dashboard",
                    "Design a landing page",
                    "Make a contact form"
                ]
        else:
            response_content = f"I understand you want: {request.message}. Could you provide more details so I can help you better?"
            suggestions = None
        
        chat_response = ChatResponse(
            id=str(uuid.uuid4()),
            type=MessageType.ASSISTANT,
            content=response_content,
            timestamp=datetime.utcnow(),
            suggestions=suggestions,
            metadata={
                "analyzed": len(request.message) > 20,
                "confidence": design_intent.confidence if len(request.message) > 20 else 0.0
            }
        )
        
        # Broadcast chat message to project clients
        if request.project_id:
            await websocket_manager.send_chat_message(
                message_data=chat_response.dict(),
                project_id=request.project_id
            )
        
        return chat_response
        
    except Exception as e:
        logger.error(f"Error in chat service: {str(e)}")
        return ChatResponse(
            id=str(uuid.uuid4()),
            type=MessageType.ASSISTANT,
            content="I apologize, but I encountered an error. Please try again.",
            timestamp=datetime.utcnow(),
            metadata={"error": str(e)}
        )

def chat_mock(request: ChatRequest) -> Dict[str, Any]:
    """Mock chat response service for backward compatibility"""
    return {
        "id": str(uuid.uuid4()),
        "type": "assistant",
        "content": f"I understand you want: {request.message}. Let me generate that for you.",
        "timestamp": datetime.now().isoformat()
    }

async def analyze_prompt_advanced(request: PromptAnalysisRequest) -> DesignIntentResponse:
    """Advanced prompt analysis using NLP engine"""
    try:
        design_intent = await nlp_engine.analyze_prompt(request.prompt)
        return design_intent
        
    except Exception as e:
        logger.error(f"Error in prompt analysis: {str(e)}")
        # Return default analysis on error
        return DesignIntentResponse(
            page_type="landing",
            style_preferences=["modern"],
            components=["header", "content", "footer"],
            layout="single_column",
            complexity=0.5,
            business_domain="general",
            target_audience="general",
            brand_personality=["friendly"],
            functional_requirements=["responsive"],
            technical_requirements=["react_nextjs"],
            confidence=0.3
        )

def analyze_prompt_mock(request: PromptAnalysisRequest) -> Dict[str, Any]:
    """Mock prompt analysis service for backward compatibility"""
    return {
        "id": str(uuid.uuid4()),
        "prompt": request.prompt,
        "pageType": "landing",
        "style": "minimalist",
        "complexity": "medium",
        "requirements": ["responsive", "accessible", "modern"]
    }

def get_agent_status_advanced() -> List[AgentStatusResponse]:
    """Get real-time agent status from CrewAI orchestrator"""
    return crewai_orchestrator.get_agent_status()

def get_agent_status_mock() -> List[Dict[str, Any]]:
    """Mock agent status service for backward compatibility"""
    return [
        {"id": "1", "name": "Design Architect", "status": "idle", "progress": 0},
        {"id": "2", "name": "UI Generator", "status": "idle", "progress": 0},
        {"id": "3", "name": "Style Expert", "status": "idle", "progress": 0},
        {"id": "4", "name": "Code Generator", "status": "idle", "progress": 0},
        {"id": "5", "name": "QA Agent", "status": "idle", "progress": 0},
    ]

# WebSocket connection statistics
def get_websocket_stats() -> Dict[str, Any]:
    """Get WebSocket connection statistics"""
    return websocket_manager.get_connection_stats()

# Health check for all services
async def health_check() -> Dict[str, Any]:
    """Comprehensive health check for all services"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "nlp_engine": "healthy",
            "crewai_orchestrator": "healthy",
            "websocket_manager": "healthy",
            "database": "healthy"
        },
        "connections": websocket_manager.get_connection_stats()
    }
    
    try:
        # Test NLP engine
        test_analysis = await nlp_engine.analyze_prompt("test prompt")
        if not test_analysis:
            health_status["services"]["nlp_engine"] = "degraded"
            
        # Test agent status
        agent_status = crewai_orchestrator.get_agent_status()
        if not agent_status:
            health_status["services"]["crewai_orchestrator"] = "degraded"
            
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        health_status["status"] = "degraded"
        health_status["error"] = str(e)
    
    return health_status
