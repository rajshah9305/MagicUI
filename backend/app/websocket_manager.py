"""
WebSocket Manager for Real-time Communication
Handles real-time updates for agent status, generation progress, and client communication
"""

from typing import Dict, Set, Any
import json
import asyncio
import logging
from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime

logger = logging.getLogger(__name__)

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.project_connections: Dict[str, Set[str]] = {}
        self.connection_metadata: Dict[str, Dict[str, Any]] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str, project_id: str = None):
        """Accept WebSocket connection and register client"""
        await websocket.accept()
        
        self.active_connections[client_id] = websocket
        self.connection_metadata[client_id] = {
            "project_id": project_id,
            "connected_at": datetime.utcnow(),
            "last_activity": datetime.utcnow()
        }
        
        # Group by project for targeted broadcasting
        if project_id:
            if project_id not in self.project_connections:
                self.project_connections[project_id] = set()
            self.project_connections[project_id].add(client_id)
        
        logger.info(f"Client {client_id} connected to project {project_id}")
        
        # Send welcome message
        await self.send_personal_message({
            "type": "connection_established",
            "data": {
                "client_id": client_id,
                "project_id": project_id,
                "timestamp": datetime.utcnow().isoformat()
            }
        }, client_id)
    
    def disconnect(self, client_id: str):
        """Remove client connection"""
        if client_id in self.active_connections:
            # Remove from project group
            metadata = self.connection_metadata.get(client_id, {})
            project_id = metadata.get("project_id")
            
            if project_id and project_id in self.project_connections:
                self.project_connections[project_id].discard(client_id)
                if not self.project_connections[project_id]:
                    del self.project_connections[project_id]
            
            # Clean up
            del self.active_connections[client_id]
            if client_id in self.connection_metadata:
                del self.connection_metadata[client_id]
            
            logger.info(f"Client {client_id} disconnected")
    
    async def send_personal_message(self, message: Dict[str, Any], client_id: str):
        """Send message to specific client"""
        if client_id in self.active_connections:
            try:
                websocket = self.active_connections[client_id]
                await websocket.send_text(json.dumps(message))
                
                # Update last activity
                if client_id in self.connection_metadata:
                    self.connection_metadata[client_id]["last_activity"] = datetime.utcnow()
                    
            except Exception as e:
                logger.error(f"Error sending message to {client_id}: {str(e)}")
                self.disconnect(client_id)
    
    async def broadcast(self, message: Dict[str, Any]):
        """Broadcast message to all connected clients"""
        if not self.active_connections:
            return
        
        disconnected_clients = []
        
        for client_id, websocket in self.active_connections.items():
            try:
                await websocket.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error broadcasting to {client_id}: {str(e)}")
                disconnected_clients.append(client_id)
        
        # Clean up disconnected clients
        for client_id in disconnected_clients:
            self.disconnect(client_id)
    
    async def broadcast_to_project(self, message: Dict[str, Any], project_id: str):
        """Broadcast message to all clients in a specific project"""
        if project_id not in self.project_connections:
            return
        
        disconnected_clients = []
        
        for client_id in self.project_connections[project_id]:
            if client_id in self.active_connections:
                try:
                    websocket = self.active_connections[client_id]
                    await websocket.send_text(json.dumps(message))
                except Exception as e:
                    logger.error(f"Error broadcasting to project {project_id}, client {client_id}: {str(e)}")
                    disconnected_clients.append(client_id)
        
        # Clean up disconnected clients
        for client_id in disconnected_clients:
            self.disconnect(client_id)
    
    async def send_agent_status_update(self, agent_id: str, status: str, progress: float, task: str, project_id: str = None):
        """Send agent status update"""
        message = {
            "type": "agent_status_update",
            "data": {
                "agent_id": agent_id,
                "status": status,
                "progress": progress,
                "current_task": task,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        if project_id:
            await self.broadcast_to_project(message, project_id)
        else:
            await self.broadcast(message)
    
    async def send_generation_progress(self, progress: float, stage: str, project_id: str = None):
        """Send UI generation progress update"""
        message = {
            "type": "generation_progress",
            "data": {
                "progress": progress,
                "stage": stage,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        if project_id:
            await self.broadcast_to_project(message, project_id)
        else:
            await self.broadcast(message)
    
    async def send_generation_complete(self, result: Dict[str, Any], project_id: str = None):
        """Send UI generation completion notification"""
        message = {
            "type": "generation_complete",
            "data": {
                "result": result,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        if project_id:
            await self.broadcast_to_project(message, project_id)
        else:
            await self.broadcast(message)
    
    async def send_error(self, error_message: str, error_type: str = "general", project_id: str = None):
        """Send error notification"""
        message = {
            "type": "error",
            "data": {
                "message": error_message,
                "error_type": error_type,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        if project_id:
            await self.broadcast_to_project(message, project_id)
        else:
            await self.broadcast(message)
    
    async def send_chat_message(self, message_data: Dict[str, Any], project_id: str = None):
        """Send chat message to clients"""
        message = {
            "type": "chat_message",
            "data": message_data
        }
        
        if project_id:
            await self.broadcast_to_project(message, project_id)
        else:
            await self.broadcast(message)
    
    def get_connection_stats(self) -> Dict[str, Any]:
        """Get connection statistics"""
        return {
            "total_connections": len(self.active_connections),
            "active_projects": len(self.project_connections),
            "connections_by_project": {
                project_id: len(clients) 
                for project_id, clients in self.project_connections.items()
            },
            "uptime_stats": {
                client_id: {
                    "connected_at": metadata["connected_at"].isoformat(),
                    "last_activity": metadata["last_activity"].isoformat(),
                    "project_id": metadata.get("project_id")
                }
                for client_id, metadata in self.connection_metadata.items()
            }
        }
    
    async def ping_all_clients(self):
        """Send ping to all clients to check connection health"""
        ping_message = {
            "type": "ping",
            "data": {
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        await self.broadcast(ping_message)
    
    async def handle_client_message(self, client_id: str, message_data: Dict[str, Any]):
        """Handle incoming message from client"""
        message_type = message_data.get("type")
        
        if message_type == "pong":
            # Update last activity
            if client_id in self.connection_metadata:
                self.connection_metadata[client_id]["last_activity"] = datetime.utcnow()
        
        elif message_type == "subscribe_to_project":
            # Subscribe client to project updates
            project_id = message_data.get("data", {}).get("project_id")
            if project_id:
                if project_id not in self.project_connections:
                    self.project_connections[project_id] = set()
                self.project_connections[project_id].add(client_id)
                
                if client_id in self.connection_metadata:
                    self.connection_metadata[client_id]["project_id"] = project_id
        
        elif message_type == "unsubscribe_from_project":
            # Unsubscribe client from project updates
            project_id = message_data.get("data", {}).get("project_id")
            if project_id and project_id in self.project_connections:
                self.project_connections[project_id].discard(client_id)
                if not self.project_connections[project_id]:
                    del self.project_connections[project_id]

# Global WebSocket manager instance
websocket_manager = WebSocketManager()
