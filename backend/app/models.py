from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

Base = declarative_base()

class UISchema(Base):
    __tablename__ = "ui_schemas"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    schema_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class StyleSpec(Base):
    __tablename__ = "style_specs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    style_data = Column(JSON, nullable=False)
    novelty_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Variant(Base):
    __tablename__ = "variants"
    
    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    style = Column(String(100), nullable=False)
    preview_url = Column(String(500))
    build_path = Column(String(500))
    novelty_score = Column(Float, default=0.0)
    quality_scores = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(String(50), primary_key=True, index=True)
    role = Column(String(50), nullable=False)
    agent = Column(String(100))
    text = Column(Text, nullable=False)
    metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class Generation(Base):
    __tablename__ = "generations"
    
    id = Column(String(50), primary_key=True, index=True)
    brief = Column(Text, nullable=False)
    mood = Column(String(100))
    status = Column(String(50), default="pending")
    manifest_data = Column(JSON)
    processing_time = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)

class Agent(Base):
    __tablename__ = "agents"
    
    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    role = Column(String(100), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="idle")
    last_activity = Column(DateTime, default=datetime.utcnow)
    capabilities = Column(JSON)

class PerformanceMetric(Base):
    __tablename__ = "performance_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    generation_time = Column(Float)
    quality_score = Column(Float)
    accessibility_score = Column(Float)
    novelty_score = Column(Float)
    user_satisfaction = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class DesignMemory(Base):
    __tablename__ = "design_memory"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), nullable=False)
    style_dna = Column(JSON)
    novelty_hashes = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)