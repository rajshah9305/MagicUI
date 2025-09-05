from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from sqlalchemy import Column, String, DateTime, Text, Float, Integer, JSON, Boolean
from .database import Base
import datetime
from enum import Enum

# Enums
class AgentStatus(str, Enum):
    IDLE = "idle"
    WORKING = "working"
    COMPLETED = "completed"
    ERROR = "error"

class MessageType(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class PageType(str, Enum):
    LANDING = "landing"
    LOGIN = "login"
    SIGNUP = "signup"
    DASHBOARD = "dashboard"
    ECOMMERCE = "ecommerce"
    BLOG = "blog"
    PORTFOLIO = "portfolio"
    CONTACT = "contact"

# Database Models
class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, index=True)
    type = Column(String)
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    session_id = Column(String, index=True)
    metadata = Column(JSON, nullable=True)

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    user_id = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="active")
    settings = Column(JSON, nullable=True)

class GeneratedUI(Base):
    __tablename__ = "generated_uis"
    
    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, index=True)
    request_id = Column(String, index=True)
    page_type = Column(String)
    style_variant = Column(String)
    code = Column(Text)
    preview_html = Column(Text)
    components = Column(JSON)
    metrics = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)

class AgentExecution(Base):
    __tablename__ = "agent_executions"
    
    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, index=True)
    agent_name = Column(String)
    status = Column(String)
    progress = Column(Float, default=0.0)
    current_task = Column(String)
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    result = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)

# Pydantic Schemas
class ChatMessageBase(BaseModel):
    type: str
    content: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageSchema(ChatMessageBase):
    id: str
    timestamp: datetime.datetime

    class Config:
        orm_mode = True

class DesignRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=2000, description="User's design prompt")
    page_type: Optional[PageType] = PageType.LANDING
    style_preferences: List[str] = Field(default_factory=list, description="Style preferences like 'minimalist', 'glassmorphism'")
    complexity: str = Field(default="medium", pattern="^(low|medium|high)$")
    requirements: List[str] = Field(default_factory=list, description="Functional requirements")
    project_id: Optional[str] = None
    session_id: Optional[str] = None
    
    class Config:
        use_enum_values = True

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None
    project_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class PromptAnalysisRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=2000)
    context: Optional[Dict[str, Any]] = None

# Response Models
class DesignIntentResponse(BaseModel):
    page_type: str
    style_preferences: List[str]
    components: List[str]
    layout: str
    complexity: float
    business_domain: str
    target_audience: str
    brand_personality: List[str]
    functional_requirements: List[str]
    technical_requirements: List[str]
    confidence: float

class AgentStatusResponse(BaseModel):
    id: str
    name: str
    specialization: List[str]
    status: AgentStatus
    progress: float
    current_task: str
    performance: Dict[str, float]
    
    class Config:
        use_enum_values = True

class UIGenerationResponse(BaseModel):
    id: str
    request_id: str
    code: str
    preview: str
    components: List[Any]
    metrics: Dict[str, float]
    status: str = "completed"
    created_at: datetime.datetime

class ChatResponse(BaseModel):
    id: str
    type: MessageType
    content: str
    timestamp: datetime.datetime
    suggestions: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        use_enum_values = True

class WebSocketMessage(BaseModel):
    type: str
    data: Dict[str, Any]
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

# CrewAI Integration Models
class CrewAIAgent(BaseModel):
    role: str
    goal: str
    backstory: str
    tools: List[str] = Field(default_factory=list)
    verbose: bool = True
    allow_delegation: bool = False

class CrewAITask(BaseModel):
    description: str
    agent: str
    expected_output: str
    tools: List[str] = Field(default_factory=list)
    context: Optional[Dict[str, Any]] = None
