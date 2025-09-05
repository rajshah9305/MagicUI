from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
import uuid
import logging
from . import services, crud
from .models import (
    DesignRequest, 
    ChatRequest, 
    PromptAnalysisRequest, 
    ChatMessageCreate,
    UIGenerationResponse,
    ChatResponse,
    DesignIntentResponse,
    AgentStatusResponse,
    MessageType
)
from .database import get_db
from .websocket_manager import websocket_manager

logger = logging.getLogger(__name__)

router = APIRouter()

# Add startup event to initialize services
@router.on_event("startup")
async def startup_event():
    logger.info("API router initialized with enhanced services")
    
@router.on_event("shutdown")
async def shutdown_event():
    logger.info("API router shutting down")

@router.post("/generate-ui", response_model=UIGenerationResponse)
async def generate_ui(request: DesignRequest, db: Session = Depends(get_db)):
    """Generate UI using advanced CrewAI orchestration with Cerebras AI"""
    try:
        # Always use the advanced service with Cerebras AI
        result = await services.generate_ui_advanced(request)
        
        # TODO: Save to database
        return result
        
    except Exception as e:
        logger.error(f"UI generation failed: {str(e)}")
        
        # Fallback to mock service in case of error
        try:
            result_dict = services.generate_ui_mock(request)
            result = UIGenerationResponse(**result_dict)
            return result
        except Exception as fallback_error:
            logger.error(f"Fallback also failed: {str(fallback_error)}")
            raise HTTPException(status_code=500, detail=f"UI generation failed: {str(e)}")

@router.post("/generate-ui/mock")
async def generate_ui_mock_endpoint(request: DesignRequest):
    """Generate UI using mock service (for testing)"""
    return services.generate_ui_mock(request)

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """Advanced chat with NLP analysis and context awareness"""
    try:
        # Save user message
        user_message = ChatMessageCreate(
            type=MessageType.USER.value, 
            content=request.message
        )
        crud.create_chat_message(db, message=user_message)
        
        # Get assistant response using advanced service
        if hasattr(services, 'chat_advanced'):
            response = await services.chat_advanced(request)
        else:
            response_dict = services.chat_mock(request)
            response = ChatResponse(**response_dict)
        
        # Save assistant message
        assistant_message = ChatMessageCreate(
            type=MessageType.ASSISTANT.value,
            content=response.content
        )
        crud.create_chat_message(db, message=assistant_message)
        
        return response
        
    except Exception as e:
        logger.error(f"Chat failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.post("/chat/mock")
async def chat_mock_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    """Chat using mock service (for testing)"""
    # Save user message
    user_message = ChatMessageCreate(type="user", content=request.message)
    crud.create_chat_message(db, message=user_message)
    
    # Get mock response
    response = services.chat_mock(request)
    
    # Save assistant message
    assistant_message = ChatMessageCreate(type="assistant", content=response['content'])
    crud.create_chat_message(db, message=assistant_message)
    
    return response

@router.post("/analyze-prompt", response_model=DesignIntentResponse)
async def analyze_prompt(request: PromptAnalysisRequest):
    """Analyze prompt using advanced NLP engine"""
    try:
        if hasattr(services, 'analyze_prompt_advanced'):
            return await services.analyze_prompt_advanced(request)
        else:
            result = services.analyze_prompt_mock(request)
            # Convert mock result to proper response model
            return DesignIntentResponse(
                page_type=result.get('pageType', 'landing'),
                style_preferences=[result.get('style', 'modern')],
                components=['header', 'content', 'footer'],
                layout='single_column',
                complexity=0.5,
                business_domain='general',
                target_audience='general',
                brand_personality=['friendly'],
                functional_requirements=result.get('requirements', []),
                technical_requirements=['react_nextjs'],
                confidence=0.7
            )
    except Exception as e:
        logger.error(f"Prompt analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prompt analysis failed: {str(e)}")

@router.post("/analyze-prompt/mock")
async def analyze_prompt_mock_endpoint(request: PromptAnalysisRequest):
    """Analyze prompt using mock service (for testing)"""
    return services.analyze_prompt_mock(request)

@router.get("/chat/history")
async def get_chat_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get chat message history"""
    try:
        return crud.get_chat_messages(db, skip=skip, limit=limit)
    except Exception as e:
        logger.error(f"Chat history retrieval failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat history retrieval failed: {str(e)}")

# WebSocket endpoint for real-time communication
@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str, project_id: str = None):
    """WebSocket endpoint for real-time updates"""
    await websocket_manager.connect(websocket, client_id, project_id)
    
    try:
        while True:
            # Receive messages from client
            data = await websocket.receive_text()
            
            try:
                import json
                message_data = json.loads(data)
                await websocket_manager.handle_client_message(client_id, message_data)
            except json.JSONDecodeError:
                await websocket_manager.send_personal_message(
                    {"type": "error", "data": {"message": "Invalid JSON format"}},
                    client_id
                )
                
    except WebSocketDisconnect:
        websocket_manager.disconnect(client_id)
    except Exception as e:
        logger.error(f"WebSocket error for client {client_id}: {str(e)}")
        websocket_manager.disconnect(client_id)

# Health check and system status endpoints
@router.get("/health")
async def health_check():
    """Comprehensive health check"""
    if hasattr(services, 'health_check'):
        return await services.health_check()
    else:
        return {"status": "healthy", "services": ["mock"]}

@router.get("/websocket/stats")
async def websocket_stats():
    """Get WebSocket connection statistics"""
    if hasattr(services, 'get_websocket_stats'):
        return services.get_websocket_stats()
    else:
        return {"connections": 0, "projects": 0}

@router.get("/agents/status", response_model=List[AgentStatusResponse])
async def get_agent_status():
    """Get real-time agent status"""
    try:
        if hasattr(services, 'get_agent_status_advanced'):
            return services.get_agent_status_advanced()
        else:
            mock_results = services.get_agent_status_mock()
            # Convert mock results to proper response models
            return [
                AgentStatusResponse(
                    id=agent['id'],
                    name=agent['name'],
                    specialization=['general'],
                    status=agent['status'],
                    progress=float(agent['progress']),
                    current_task='Ready',
                    performance={'successRate': 0.9, 'qualityScore': 0.85, 'avgDuration': 2000}
                )
                for agent in mock_results
            ]
    except Exception as e:
        logger.error(f"Agent status retrieval failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Agent status retrieval failed: {str(e)}")

@router.get("/agents/status/mock")
async def get_agent_status_mock_endpoint():
    """Get agent status using mock service (for testing)"""
    return services.get_agent_status_mock()
