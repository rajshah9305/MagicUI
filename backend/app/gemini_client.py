import os
import json
import asyncio
from typing import Dict, List, Optional, Any
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiClient:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        
        # Configure safety settings
        self.safety_settings = {
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        }

    async def generate_ui_schema(self, brief: str, mood: str = "futuristic") -> Dict[str, Any]:
        """Generate UI schema from user brief using Gemini"""
        prompt = f"""
        You are a UI Design Architect. Convert this user brief into a framework-agnostic UI_SCHEMA.json.

        User Brief: {brief}
        Mood: {mood}

        Output a JSON "UI_SCHEMA.json" with:
        - page_type: string
        - title: string
        - sections: array of sections with id, type, layout, components
        - states: array of semantic states (loading, empty, error)
        - accessibility_notes: array of accessibility requirements

        Component types: heading, subheading, hero, navbar, sidebar, card, stat, chart, form, input, modal, button, list, grid

        Use a 12-column grid reference and responsive breakpoints (sm, md, lg).

        Output ONLY valid JSON, no markdown formatting or explanations.
        """

        try:
            response = self.model.generate_content(
                prompt,
                safety_settings=self.safety_settings,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=2048,
                )
            )
            
            # Extract JSON from response
            content = response.text.strip()
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            
            schema = json.loads(content)
            logger.info(f"Generated UI schema for brief: {brief[:50]}...")
            return schema
            
        except Exception as e:
            logger.error(f"Error generating UI schema: {e}")
            raise Exception(f"Failed to generate UI schema: {str(e)}")

    async def generate_style_spec(self, ui_schema: Dict[str, Any], style_name: str, design_memory: List[Dict] = None) -> Dict[str, Any]:
        """Generate style specification using Gemini"""
        prompt = f"""
        You are a Style Curator. Create a STYLE_SPEC.json based on the UI_SCHEMA.

        UI Schema: {json.dumps(ui_schema, indent=2)}
        Style Name: {style_name}
        
        Create a unique style specification with:
        - style_name: string (e.g., "retro-futurism-mesh", "glass-aurora", "brutalist-editorial")
        - novelty_score: float (0.0-1.0, aim for ≥0.8)
        - trend_tags: array of trending design tags
        - colors: object with bg, surface, text, primary, accent, muted (hex colors)
        - typography: object with font_heading, font_body, scale
        - radii: object with sm, md, lg (pixel values)
        - spacing: object with unit, sectionY (pixel values)
        - shadows: object with e1 (box-shadow value)
        - effects: array of CSS effects (e.g., "aurora-bg:enabled", "glass-blur:10px")
        - component_variants: object mapping component types to variant names
        - a11y: object with min_contrast (e.g., "AA")

        IMPORTANT:
        - Avoid purple defaults unless explicitly requested
        - Use cyan (#00d4ff) and neon green (#00ff88) as primary colors
        - Ensure high contrast for accessibility
        - Make it unique and trendy (glassmorphism, gradient mesh, brutalism, etc.)
        - Add a one-line style description

        Output ONLY valid JSON, no markdown formatting.
        """

        try:
            response = self.model.generate_content(
                prompt,
                safety_settings=self.safety_settings,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.8,
                    max_output_tokens=1024,
                )
            )
            
            content = response.text.strip()
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            
            style_spec = json.loads(content)
            logger.info(f"Generated style spec: {style_name}")
            return style_spec
            
        except Exception as e:
            logger.error(f"Error generating style spec: {e}")
            raise Exception(f"Failed to generate style spec: {str(e)}")

    async def generate_code(self, ui_schema: Dict[str, Any], style_spec: Dict[str, Any], variant_id: str) -> Dict[str, str]:
        """Generate Next.js + Tailwind code using Gemini"""
        prompt = f"""
        You are a Frontend Engineer. Convert UI_SCHEMA + STYLE_SPEC to runnable Next.js + Tailwind code.

        UI Schema: {json.dumps(ui_schema, indent=2)}
        Style Spec: {json.dumps(style_spec, indent=2)}
        Variant ID: {variant_id}

        Generate:
        1. A complete Next.js page component (page.tsx)
        2. CSS variables file (tokens.css) with design tokens
        3. Tailwind config extension (tailwind.config.js)
        4. Component files for each component type

        Requirements:
        - Use design tokens as CSS variables
        - Wire tokens into Tailwind config
        - Generate modular components in /components
        - Ensure accessibility (semantic HTML, ARIA attributes, keyboard navigation)
        - Use the exact colors and styles from style_spec
        - Make it responsive with the breakpoints from ui_schema
        - Include proper TypeScript types

        Output a JSON object with file paths as keys and file contents as values:
        {{
            "page.tsx": "...",
            "tokens.css": "...",
            "tailwind.config.js": "...",
            "components/Button.tsx": "...",
            "components/Card.tsx": "...",
            // ... other component files
        }}

        Output ONLY valid JSON, no markdown formatting.
        """

        try:
            response = self.model.generate_content(
                prompt,
                safety_settings=self.safety_settings,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.6,
                    max_output_tokens=4096,
                )
            )
            
            content = response.text.strip()
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            
            code_files = json.loads(content)
            logger.info(f"Generated code for variant: {variant_id}")
            return code_files
            
        except Exception as e:
            logger.error(f"Error generating code: {e}")
            raise Exception(f"Failed to generate code: {str(e)}")

    async def generate_chat_response(self, message: str, context: Dict[str, Any] = None) -> str:
        """Generate chat response using Gemini"""
        prompt = f"""
        You are an AI assistant for Magic UI Elite, a premium UI generation platform. 
        You help users create stunning user interfaces through AI orchestration.

        User Message: {message}
        Context: {json.dumps(context or {}, indent=2)}

        Respond as a helpful, professional AI assistant. You can:
        - Help with UI design decisions
        - Explain design patterns and best practices
        - Suggest improvements to generated designs
        - Answer questions about the platform
        - Provide creative inspiration

        Keep responses concise, helpful, and professional. Use emojis sparingly.
        """

        try:
            response = self.model.generate_content(
                prompt,
                safety_settings=self.safety_settings,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=512,
                )
            )
            
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Error generating chat response: {e}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again."

    async def analyze_design_quality(self, ui_schema: Dict[str, Any], style_spec: Dict[str, Any]) -> Dict[str, float]:
        """Analyze design quality using Gemini"""
        prompt = f"""
        You are a Design QA Engineer. Analyze the quality of this UI design.

        UI Schema: {json.dumps(ui_schema, indent=2)}
        Style Spec: {json.dumps(style_spec, indent=2)}

        Rate each aspect from 0.0 to 1.0:
        - accessibility_score: WCAG compliance, semantic HTML, keyboard navigation
        - usability_score: user experience, navigation flow, information hierarchy
        - visual_appeal: aesthetics, color harmony, typography, spacing
        - responsiveness: mobile-first design, breakpoint handling
        - performance: code efficiency, asset optimization
        - innovation: uniqueness, trend alignment, creativity

        Output ONLY a JSON object with these scores.
        """

        try:
            response = self.model.generate_content(
                prompt,
                safety_settings=self.safety_settings,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,
                    max_output_tokens=256,
                )
            )
            
            content = response.text.strip()
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            
            scores = json.loads(content)
            logger.info(f"Analyzed design quality: {scores}")
            return scores
            
        except Exception as e:
            logger.error(f"Error analyzing design quality: {e}")
            return {
                "accessibility_score": 0.8,
                "usability_score": 0.8,
                "visual_appeal": 0.8,
                "responsiveness": 0.8,
                "performance": 0.8,
                "innovation": 0.8
            }

    async def generate_patch_suggestions(self, current_schema: Dict[str, Any], user_request: str) -> List[Dict[str, Any]]:
        """Generate patch suggestions for UI modifications"""
        prompt = f"""
        You are a UI Refinement Expert. Suggest patches to modify the UI based on user request.

        Current UI Schema: {json.dumps(current_schema, indent=2)}
        User Request: {user_request}

        Generate JSON Patch operations to modify the schema:
        - op: "add", "remove", "replace", "move", "copy", "test"
        - path: JSON pointer to the element
        - value: new value (for add/replace operations)

        Output an array of patch operations that would fulfill the user's request.
        """

        try:
            response = self.model.generate_content(
                prompt,
                safety_settings=self.safety_settings,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.6,
                    max_output_tokens=1024,
                )
            )
            
            content = response.text.strip()
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            
            patches = json.loads(content)
            logger.info(f"Generated {len(patches)} patch suggestions")
            return patches
            
        except Exception as e:
            logger.error(f"Error generating patch suggestions: {e}")
            return []

    def get_usage_stats(self) -> Dict[str, Any]:
        """Get API usage statistics"""
        return {
            "model": "gemini-pro",
            "timestamp": datetime.now().isoformat(),
            "status": "active"
        }

# Global instance
gemini_client = GeminiClient()
