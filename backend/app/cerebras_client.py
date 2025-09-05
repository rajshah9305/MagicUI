"""
Cerebras AI Client Integration
High-performance AI inference using Cerebras Cloud SDK
"""

import os
import asyncio
import httpx
import json
from typing import Dict, List, Any, Optional, AsyncGenerator
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class CerebrasClient:
    """
    Cerebras AI client for high-performance inference
    Integrates with CrewAI for enhanced AI agent capabilities
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Cerebras client
        
        Args:
            api_key: Cerebras API key (defaults to environment variable)
        """
        self.api_key = api_key or os.environ.get("CEREBRAS_API_KEY")
        
        if not self.api_key:
            raise ValueError("CEREBRAS_API_KEY is required")
        
        # Use direct HTTP client to bypass SDK issues
        self.base_url = "https://api.cerebras.ai/v1"
        self.model = "llama3.1-8b"  # Use a more stable model
        
        # HTTP client for direct API calls
        self.http_client = httpx.AsyncClient(
            timeout=httpx.Timeout(60.0),
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
        )
        
        # Default configuration optimized for CrewAI agents
        self.default_config = {
            "max_completion_tokens": 32768,
            "temperature": 0.6,
            "top_p": 0.9,
            "stream": False
        }
        
        logger.info("Cerebras client initialized successfully")
    
    async def generate_completion(
        self, 
        messages: List[Dict[str, str]], 
        **kwargs
    ) -> str:
        """
        Generate a single completion using Cerebras
        
        Args:
            messages: List of message objects with 'role' and 'content'
            **kwargs: Additional parameters for the completion
            
        Returns:
            Generated text completion
        """
        try:
            config = {**self.default_config, **kwargs}
            config["stream"] = False  # Ensure non-streaming for single completion
            
            payload = {
                "model": self.model,
                "messages": messages,
                **config
            }
            
            response = await self.http_client.post(
                f"{self.base_url}/chat/completions",
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"]
            else:
                error_msg = f"API request failed with status {response.status_code}: {response.text}"
                logger.error(error_msg)
                raise Exception(error_msg)
            
        except Exception as e:
            logger.error(f"Error generating completion: {str(e)}")
            raise
    
    async def generate_streaming_completion(
        self, 
        messages: List[Dict[str, str]], 
        **kwargs
    ) -> AsyncGenerator[str, None]:
        """
        Generate streaming completion using Cerebras
        
        Args:
            messages: List of message objects with 'role' and 'content'
            **kwargs: Additional parameters for the completion
            
        Yields:
            Streaming text chunks
        """
        try:
            config = {**self.default_config, **kwargs}
            config["stream"] = True
            
            payload = {
                "model": self.model,
                "messages": messages,
                **config
            }
            
            async with self.http_client.stream(
                "POST",
                f"{self.base_url}/chat/completions",
                json=payload
            ) as response:
                if response.status_code != 200:
                    error_msg = f"Streaming request failed with status {response.status_code}"
                    logger.error(error_msg)
                    raise Exception(error_msg)
                
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line[6:]  # Remove "data: " prefix
                        if data_str.strip() == "[DONE]":
                            break
                        try:
                            chunk_data = json.loads(data_str)
                            if (chunk_data.get("choices") and 
                                len(chunk_data["choices"]) > 0 and 
                                chunk_data["choices"][0].get("delta", {}).get("content")):
                                yield chunk_data["choices"][0]["delta"]["content"]
                        except json.JSONDecodeError:
                            continue
                    
        except Exception as e:
            logger.error(f"Error generating streaming completion: {str(e)}")
            raise
    
    async def generate_agent_response(
        self,
        system_prompt: str,
        user_input: str,
        context: Optional[str] = None,
        agent_role: Optional[str] = None,
        **kwargs
    ) -> str:
        """
        Generate response optimized for CrewAI agents
        
        Args:
            system_prompt: System message defining agent behavior
            user_input: User's input or task description
            context: Additional context for the agent
            agent_role: Specific role for the agent (e.g., "Design Architect")
            **kwargs: Additional parameters
            
        Returns:
            Agent's response
        """
        messages = [
            {
                "role": "system",
                "content": self._build_system_prompt(system_prompt, agent_role)
            }
        ]
        
        if context:
            messages.append({
                "role": "system",
                "content": f"Context: {context}"
            })
        
        messages.append({
            "role": "user",
            "content": user_input
        })
        
        # Optimize settings for agent responses
        agent_config = {
            "temperature": 0.7,  # Slightly higher for creativity
            "max_completion_tokens": 16384,  # Adequate for detailed responses
            **kwargs
        }
        
        return await self.generate_completion(messages, **agent_config)
    
    async def generate_code(
        self,
        requirements: str,
        language: str = "typescript",
        framework: str = "react",
        context: Optional[str] = None,
        **kwargs
    ) -> str:
        """
        Generate code using Cerebras optimized for code generation
        
        Args:
            requirements: Code requirements and specifications
            language: Programming language (default: typescript)
            framework: Framework (default: react)
            context: Additional context
            **kwargs: Additional parameters
            
        Returns:
            Generated code
        """
        system_prompt = f"""You are an expert {language} developer specializing in {framework}.
        Generate clean, production-ready code that follows best practices.
        Include proper error handling, type safety, and performance optimizations.
        Ensure the code is well-documented and maintainable."""
        
        user_prompt = f"Generate {language} code using {framework} for the following requirements:\n\n{requirements}"
        
        if context:
            user_prompt += f"\n\nAdditional context:\n{context}"
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        # Optimize for code generation
        code_config = {
            "temperature": 0.3,  # Lower temperature for more deterministic code
            "max_completion_tokens": 24576,  # Larger for complex code
            **kwargs
        }
        
        return await self.generate_completion(messages, **code_config)
    
    async def analyze_and_improve(
        self,
        content: str,
        analysis_type: str = "code_review",
        improvement_goals: Optional[List[str]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Analyze content and provide improvements
        
        Args:
            content: Content to analyze
            analysis_type: Type of analysis (code_review, design_review, etc.)
            improvement_goals: Specific goals for improvement
            **kwargs: Additional parameters
            
        Returns:
            Analysis results with improvements
        """
        goals_text = ""
        if improvement_goals:
            goals_text = f"Focus on these improvement goals: {', '.join(improvement_goals)}"
        
        system_prompt = f"""You are an expert analyst specializing in {analysis_type}.
        Provide detailed analysis with specific, actionable improvements.
        Structure your response as JSON with 'analysis', 'issues', 'improvements', and 'score' fields.
        {goals_text}"""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Analyze the following content:\n\n{content}"}
        ]
        
        response = await self.generate_completion(messages, **kwargs)
        
        try:
            import json
            return json.loads(response)
        except json.JSONDecodeError:
            # Fallback if response isn't valid JSON
            return {
                "analysis": response,
                "issues": [],
                "improvements": [],
                "score": 0.8
            }
    
    def _build_system_prompt(self, base_prompt: str, agent_role: Optional[str] = None) -> str:
        """
        Build enhanced system prompt for CrewAI agents
        
        Args:
            base_prompt: Base system prompt
            agent_role: Specific agent role
            
        Returns:
            Enhanced system prompt
        """
        enhanced_prompt = base_prompt
        
        if agent_role:
            enhanced_prompt = f"You are a {agent_role} with specialized expertise. {enhanced_prompt}"
        
        # Add CrewAI-specific instructions
        enhanced_prompt += """
        
        Instructions for CrewAI integration:
        - Provide detailed, actionable responses
        - Structure your output clearly and professionally
        - Include specific technical details when relevant
        - Consider the collaborative nature of multi-agent workflows
        - Ensure your response can be effectively used by other agents in the workflow
        """
        
        return enhanced_prompt
    
    async def health_check(self) -> Dict[str, Any]:
        """
        Perform health check on Cerebras client
        
        Returns:
            Health status information
        """
        try:
            test_messages = [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'OK' to confirm you're working."}
            ]
            
            start_time = datetime.utcnow()
            response = await self.generate_completion(
                test_messages, 
                max_completion_tokens=10,
                temperature=0.1
            )
            end_time = datetime.utcnow()
            
            response_time = (end_time - start_time).total_seconds()
            
            return {
                "status": "healthy",
                "model": self.model,
                "response_time_seconds": response_time,
                "test_response": response.strip(),
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    async def __aenter__(self):
        """Async context manager entry"""
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        await self.http_client.aclose()

# Singleton instance for global use
_cerebras_client: Optional[CerebrasClient] = None

def get_cerebras_client() -> CerebrasClient:
    """Get singleton Cerebras client instance"""
    global _cerebras_client
    
    if _cerebras_client is None:
        _cerebras_client = CerebrasClient()
    
    return _cerebras_client

async def initialize_cerebras_client(api_key: Optional[str] = None) -> CerebrasClient:
    """Initialize Cerebras client with health check"""
    global _cerebras_client
    
    _cerebras_client = CerebrasClient(api_key)
    
    # Perform health check
    health = await _cerebras_client.health_check()
    
    if health["status"] != "healthy":
        logger.error(f"Cerebras client health check failed: {health}")
        raise Exception(f"Cerebras client initialization failed: {health.get('error', 'Unknown error')}")
    
    logger.info(f"Cerebras client initialized successfully - Response time: {health['response_time_seconds']:.2f}s")
    return _cerebras_client
