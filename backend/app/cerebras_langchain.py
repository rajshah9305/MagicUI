"""
LangChain integration for Cerebras AI
Custom LLM wrapper for CrewAI compatibility
"""

from typing import Any, Dict, List, Optional, Union
from langchain_core.language_models.llms import LLM
from langchain_core.callbacks.manager import CallbackManagerForLLMRun
from langchain_core.outputs import Generation, LLMResult
import asyncio
from .cerebras_client import CerebrasClient
import logging
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

class CerebrasLLM(LLM):
    """
    LangChain LLM wrapper for Cerebras AI
    Enables CrewAI integration with Cerebras inference
    """
    
    cerebras_client: Optional[CerebrasClient] = None
    model_name: str = "llama3.1-8b"
    temperature: float = 0.6
    max_completion_tokens: int = 32768
    top_p: float = 0.9
    
    def __init__(self, cerebras_client: Optional[CerebrasClient] = None, **kwargs):
        """
        Initialize Cerebras LLM wrapper
        
        Args:
            cerebras_client: Cerebras client instance
            **kwargs: Additional LangChain LLM parameters
        """
        super().__init__()
        if cerebras_client is None:
            from .cerebras_client import get_cerebras_client
            cerebras_client = get_cerebras_client()
        
        self.cerebras_client = cerebras_client
        
        # Override default parameters if provided
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
    
    @property
    def _llm_type(self) -> str:
        """Return type of LLM."""
        return "cerebras"
    
    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:
        """
        Call Cerebras AI to generate text
        
        Args:
            prompt: Input prompt
            stop: Stop sequences
            run_manager: Callback manager
            **kwargs: Additional parameters
            
        Returns:
            Generated text
        """
        try:
            # Convert prompt to messages format
            messages = [
                {"role": "user", "content": prompt}
            ]
            
            # Merge parameters
            params = {
                "temperature": self.temperature,
                "max_tokens": self.max_completion_tokens,  # litellm expects max_tokens
                "top_p": self.top_p,
                "model": self.model_name,  # litellm expects model
                **kwargs
            }
            
            # Handle stop sequences
            if stop:
                params["stop"] = stop
            
            # Use asyncio to call the async method
            loop = None
            try:
                loop = asyncio.get_event_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
            
            if loop.is_running():
                # If we're already in an event loop, create a new task
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    future = executor.submit(
                        lambda: loop.run_until_complete(
                            self.cerebras_client.generate_completion(messages, **params)
                        )
                    )
                    response = future.result()
            else:
                # If no event loop is running, we can use run_until_complete
                response = loop.run_until_complete(
                    self.cerebras_client.generate_completion(messages, **params)
                )
            
            # Post-process for stop sequences
            if stop and response:
                for stop_seq in stop:
                    if stop_seq in response:
                        response = response.split(stop_seq)[0]
            
            # Notify callback manager if provided
            if run_manager:
                run_manager.on_llm_end(LLMResult(generations=[[Generation(text=response)]]))
            
            return response
            
        except Exception as e:
            logger.error(f"Error in Cerebras LLM call: {str(e)}")
            if run_manager:
                run_manager.on_llm_error(e)
            raise
    
    async def _acall(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:
        """
        Async call to Cerebras AI
        
        Args:
            prompt: Input prompt
            stop: Stop sequences
            run_manager: Callback manager
            **kwargs: Additional parameters
            
        Returns:
            Generated text
        """
        try:
            # Convert prompt to messages format
            messages = [
                {"role": "user", "content": prompt}
            ]
            
            # Merge parameters
            params = {
                "temperature": self.temperature,
                "max_tokens": self.max_completion_tokens,  # litellm expects max_tokens
                "top_p": self.top_p,
                "model": self.model_name,  # litellm expects model
                **kwargs
            }
            
            # Handle stop sequences
            if stop:
                params["stop"] = stop
            
            response = await self.cerebras_client.generate_completion(messages, **params)
            
            # Post-process for stop sequences
            if stop and response:
                for stop_seq in stop:
                    if stop_seq in response:
                        response = response.split(stop_seq)[0]
            
            # Notify callback manager if provided
            if run_manager:
                run_manager.on_llm_end(LLMResult(generations=[[Generation(text=response)]]))
            
            return response
            
        except Exception as e:
            logger.error(f"Error in async Cerebras LLM call: {str(e)}")
            if run_manager:
                run_manager.on_llm_error(e)
            raise
    
    @property
    def _identifying_params(self) -> Dict[str, Any]:
        """Get the identifying parameters."""
        return {
            "model_name": self.model_name,
            "temperature": self.temperature,
            "max_completion_tokens": self.max_completion_tokens,
            "top_p": self.top_p,
        }


class CerebrasAgentLLM(CerebrasLLM):
    """
    Specialized Cerebras LLM for CrewAI agents
    Optimized for agent-specific tasks and workflows
    """
    
    agent_role: Optional[str] = None
    system_prompt: Optional[str] = None
    
    def __init__(
        self, 
        cerebras_client: Optional[CerebrasClient] = None,
        agent_role: Optional[str] = None,
        system_prompt: Optional[str] = None,
        **kwargs
    ):
        """
        Initialize agent-specific Cerebras LLM
        
        Args:
            cerebras_client: Cerebras client instance
            agent_role: Role of the agent (e.g., "Design Architect")
            system_prompt: System prompt for the agent
            **kwargs: Additional parameters
        """
        super().__init__(cerebras_client=cerebras_client, **kwargs)
        self.agent_role = agent_role
        self.system_prompt = system_prompt
    
    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:
        """
        Enhanced call method for agent-specific responses
        
        Args:
            prompt: Input prompt
            stop: Stop sequences
            run_manager: Callback manager
            **kwargs: Additional parameters
            
        Returns:
            Generated text optimized for agent workflows
        """
        try:
            # Use the specialized agent response method
            params = {
                "temperature": self.temperature,
                "max_tokens": self.max_completion_tokens,  # litellm expects max_tokens
                "top_p": self.top_p,
                "model": self.model_name,  # litellm expects model
                **kwargs
            }
            
            # Handle stop sequences
            if stop:
                params["stop"] = stop
            
            # Use asyncio to call the async method
            loop = None
            try:
                loop = asyncio.get_event_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
            
            if loop.is_running():
                # If we're already in an event loop, create a new task
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    future = executor.submit(
                        lambda: loop.run_until_complete(
                            self.cerebras_client.generate_agent_response(
                                system_prompt=self.system_prompt or "You are a helpful AI assistant.",
                                user_input=prompt,
                                agent_role=self.agent_role,
                                **params
                            )
                        )
                    )
                    response = future.result()
            else:
                response = loop.run_until_complete(
                    self.cerebras_client.generate_agent_response(
                        system_prompt=self.system_prompt or "You are a helpful AI assistant.",
                        user_input=prompt,
                        agent_role=self.agent_role,
                        **params
                    )
                )
            
            # Post-process for stop sequences
            if stop and response:
                for stop_seq in stop:
                    if stop_seq in response:
                        response = response.split(stop_seq)[0]
            
            # Notify callback manager if provided
            if run_manager:
                run_manager.on_llm_end(LLMResult(generations=[[Generation(text=response)]]))
            
            return response
            
        except Exception as e:
            logger.error(f"Error in Cerebras Agent LLM call: {str(e)}")
            if run_manager:
                run_manager.on_llm_error(e)
            raise
    
    async def _acall(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:
        """
        Async enhanced call method for agent-specific responses
        """
        try:
            params = {
                "temperature": self.temperature,
                "max_tokens": self.max_completion_tokens,  # litellm expects max_tokens
                "top_p": self.top_p,
                "model": self.model_name,  # litellm expects model
                **kwargs
            }
            
            # Handle stop sequences
            if stop:
                params["stop"] = stop
            
            response = await self.cerebras_client.generate_agent_response(
                system_prompt=self.system_prompt or "You are a helpful AI assistant.",
                user_input=prompt,
                agent_role=self.agent_role,
                **params
            )
            
            # Post-process for stop sequences
            if stop and response:
                for stop_seq in stop:
                    if stop_seq in response:
                        response = response.split(stop_seq)[0]
            
            # Notify callback manager if provided
            if run_manager:
                run_manager.on_llm_end(LLMResult(generations=[[Generation(text=response)]]))
            
            return response
            
        except Exception as e:
            logger.error(f"Error in async Cerebras Agent LLM call: {str(e)}")
            if run_manager:
                run_manager.on_llm_error(e)
            raise


def create_cerebras_llm(
    cerebras_client: Optional[CerebrasClient] = None,
    agent_role: Optional[str] = None,
    system_prompt: Optional[str] = None,
    **kwargs
) -> Union[CerebrasLLM, CerebrasAgentLLM]:
    """
    Factory function to create appropriate Cerebras LLM instance
    
    Args:
        cerebras_client: Cerebras client instance
        agent_role: Optional agent role for specialized behavior
        system_prompt: Optional system prompt
        **kwargs: Additional parameters
        
    Returns:
        CerebrasLLM or CerebrasAgentLLM instance
    """
    if agent_role or system_prompt:
        return CerebrasAgentLLM(
            cerebras_client=cerebras_client,
            agent_role=agent_role,
            system_prompt=system_prompt,
            **kwargs
        )
    else:
        return CerebrasLLM(cerebras_client=cerebras_client, **kwargs)