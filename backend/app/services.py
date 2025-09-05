import os
import uuid
from typing import Dict, List, Any
from datetime import datetime

class UIGenerationService:
    def __init__(self):
        self.generation_cache = {}
    
    async def generate_variants(self, brief: str, mood: str = "futuristic") -> Dict[str, Any]:
        return {"brief": brief, "mood": mood, "variants": []}

class ChatService:
    def __init__(self):
        self.chat_history = []
    
    async def save_message(self, message: Dict[str, Any]) -> str:
        message_id = str(uuid.uuid4())
        message["id"] = message_id
        message["timestamp"] = datetime.now()
        self.chat_history.append(message)
        return message_id
    
    async def get_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        return self.chat_history[-limit:]

class PreviewService:
    def __init__(self):
        self.previews_dir = "previews"
        os.makedirs(self.previews_dir, exist_ok=True)
    
    async def create_preview(self, variant_id: str, code_files: Dict[str, str], style_spec: Dict[str, Any]) -> str:
        return f"/previews/{variant_id}/index.html"
    
    async def create_export(self, variants: List[Dict[str, Any]], format: str, include_assets: bool, optimize: bool) -> str:
        return f"{uuid.uuid4()}.zip"