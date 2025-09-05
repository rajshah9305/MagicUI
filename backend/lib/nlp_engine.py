"""
Advanced NLP Engine for Magic UI Studio Pro
Enhanced intelligent prompt analysis and task orchestration
"""

from typing import Dict, List, Any, Optional
import re
import asyncio
import json
from datetime import datetime
import logging
from ..app.models import DesignIntentResponse

logger = logging.getLogger(__name__)

class AdvancedNLPEngine:
    def __init__(self):
        self.design_patterns = self._initialize_design_patterns()
        self.style_guides = self._initialize_style_guides()
        self.component_library = self._initialize_component_library()
        self.domain_knowledge = self._initialize_domain_knowledge()
    
    def _initialize_design_patterns(self) -> Dict[str, Any]:
        """Initialize design pattern knowledge base"""
        return {
            'authentication': {
                'components': ['login_form', 'social_auth', 'password_reset', 'two_factor'],
                'layouts': ['centered', 'split_screen', 'modal'],
                'complexity': 0.6,
                'keywords': ['login', 'signin', 'auth', 'authentication', 'sign in']
            },
            'dashboard': {
                'components': ['sidebar', 'header', 'stats_cards', 'charts', 'tables', 'notifications'],
                'layouts': ['sidebar_left', 'sidebar_right', 'top_nav'],
                'complexity': 0.9,
                'keywords': ['dashboard', 'admin', 'panel', 'analytics', 'stats', 'control']
            },
            'landing': {
                'components': ['hero', 'features', 'testimonials', 'pricing', 'cta', 'footer'],
                'layouts': ['single_column', 'multi_section', 'parallax'],
                'complexity': 0.7,
                'keywords': ['landing', 'home', 'hero', 'marketing', 'saas', 'product']
            },
            'ecommerce': {
                'components': ['product_grid', 'filters', 'cart', 'checkout', 'reviews'],
                'layouts': ['grid_sidebar', 'masonry', 'list_view'],
                'complexity': 0.8,
                'keywords': ['shop', 'store', 'ecommerce', 'product', 'buy', 'sell', 'cart']
            },
            'blog': {
                'components': ['article_list', 'sidebar', 'search', 'categories', 'pagination'],
                'layouts': ['two_column', 'masonry', 'list_view'],
                'complexity': 0.5,
                'keywords': ['blog', 'article', 'post', 'news', 'content', 'writing']
            },
            'portfolio': {
                'components': ['project_grid', 'hero', 'about', 'contact', 'gallery'],
                'layouts': ['masonry', 'grid', 'showcase'],
                'complexity': 0.6,
                'keywords': ['portfolio', 'showcase', 'gallery', 'work', 'projects', 'creative']
            },
            'contact': {
                'components': ['contact_form', 'map', 'info_cards', 'social_links'],
                'layouts': ['split', 'centered', 'form_info'],
                'complexity': 0.4,
                'keywords': ['contact', 'form', 'get in touch', 'reach out', 'inquiry']
            }
        }
    
    def _initialize_style_guides(self) -> Dict[str, Any]:
        """Initialize style guide knowledge base"""
        return {
            'glassmorphism': {
                'characteristics': ['transparency', 'blur', 'gradient', 'modern'],
                'complexity': 0.7,
                'suitability': ['landing', 'portfolio', 'creative'],
                'keywords': ['glass', 'glassmorphism', 'transparent', 'blur', 'frosted']
            },
            'minimalist': {
                'characteristics': ['clean', 'whitespace', 'typography', 'simple'],
                'complexity': 0.4,
                'suitability': ['dashboard', 'blog', 'corporate'],
                'keywords': ['minimal', 'minimalist', 'clean', 'simple', 'white']
            },
            'brutalist': {
                'characteristics': ['bold', 'geometric', 'contrast', 'experimental'],
                'complexity': 0.8,
                'suitability': ['portfolio', 'creative', 'artistic'],
                'keywords': ['brutal', 'brutalist', 'bold', 'geometric', 'raw']
            },
            'modern': {
                'characteristics': ['contemporary', 'sleek', 'professional', 'polished'],
                'complexity': 0.6,
                'suitability': ['landing', 'corporate', 'saas'],
                'keywords': ['modern', 'contemporary', 'sleek', 'professional', 'polished']
            },
            'dark': {
                'characteristics': ['dark_theme', 'contrast', 'dramatic', 'sophisticated'],
                'complexity': 0.5,
                'suitability': ['dashboard', 'gaming', 'tech'],
                'keywords': ['dark', 'night', 'black', 'shadow', 'dramatic']
            },
            'colorful': {
                'characteristics': ['vibrant', 'energetic', 'playful', 'bold'],
                'complexity': 0.6,
                'suitability': ['creative', 'children', 'entertainment'],
                'keywords': ['colorful', 'vibrant', 'bright', 'energetic', 'playful']
            }
        }
    
    def _initialize_component_library(self) -> Dict[str, Any]:
        """Initialize component library knowledge base"""
        return {
            'forms': {
                'components': ['input', 'textarea', 'select', 'checkbox', 'radio', 'button'],
                'keywords': ['form', 'input', 'field', 'submit', 'validation']
            },
            'navigation': {
                'components': ['navbar', 'menu', 'breadcrumbs', 'pagination', 'tabs'],
                'keywords': ['nav', 'navigation', 'menu', 'header', 'breadcrumb']
            },
            'data_display': {
                'components': ['table', 'list', 'card', 'grid', 'carousel'],
                'keywords': ['table', 'list', 'data', 'display', 'grid', 'carousel']
            },
            'feedback': {
                'components': ['alert', 'toast', 'modal', 'tooltip', 'progress'],
                'keywords': ['alert', 'notification', 'modal', 'popup', 'progress']
            },
            'media': {
                'components': ['image', 'video', 'gallery', 'slider', 'lightbox'],
                'keywords': ['image', 'photo', 'video', 'gallery', 'media']
            }
        }
    
    def _initialize_domain_knowledge(self) -> Dict[str, Any]:
        """Initialize business domain knowledge base"""
        return {
            'technology': {
                'characteristics': ['innovative', 'cutting_edge', 'efficient', 'scalable'],
                'keywords': ['saas', 'software', 'tech', 'ai', 'machine learning', 'cloud'],
                'audience': 'developers'
            },
            'finance': {
                'characteristics': ['trustworthy', 'professional', 'secure', 'reliable'],
                'keywords': ['finance', 'bank', 'fintech', 'investment', 'trading', 'crypto'],
                'audience': 'professionals'
            },
            'healthcare': {
                'characteristics': ['caring', 'professional', 'accessible', 'trustworthy'],
                'keywords': ['health', 'medical', 'healthcare', 'doctor', 'patient', 'wellness'],
                'audience': 'patients'
            },
            'education': {
                'characteristics': ['inspiring', 'accessible', 'engaging', 'supportive'],
                'keywords': ['education', 'learning', 'course', 'school', 'university', 'training'],
                'audience': 'students'
            },
            'retail': {
                'characteristics': ['appealing', 'trustworthy', 'convenient', 'trendy'],
                'keywords': ['retail', 'fashion', 'commerce', 'shopping', 'store', 'brand'],
                'audience': 'consumers'
            },
            'entertainment': {
                'characteristics': ['exciting', 'engaging', 'fun', 'immersive'],
                'keywords': ['entertainment', 'gaming', 'media', 'streaming', 'content', 'fun'],
                'audience': 'general'
            }
        }
    
    async def analyze_prompt(self, prompt: str) -> DesignIntentResponse:
        """Analyze user prompt and extract design intent"""
        try:
            # Tokenize and clean prompt
            tokens = self._tokenize_prompt(prompt)
            
            # Extract entities
            entities = self._extract_entities(tokens, prompt)
            
            # Classify intent
            intent = self._classify_intent(entities, prompt)
            
            # Calculate complexity
            complexity = self._calculate_complexity(intent, prompt)
            
            # Calculate confidence
            confidence = self._calculate_confidence(entities, prompt)
            
            return DesignIntentResponse(
                page_type=intent['page_type'],
                style_preferences=intent['styles'],
                components=intent['components'],
                layout=intent['layout'],
                complexity=complexity,
                business_domain=intent['domain'],
                target_audience=intent['audience'],
                brand_personality=intent['personality'],
                functional_requirements=intent['functional'],
                technical_requirements=intent['technical'],
                confidence=confidence
            )
            
        except Exception as e:\n            logger.error(f\"Error in prompt analysis: {str(e)}\")\n            # Return default analysis on error\n            return self._get_default_analysis()\n    \n    def _tokenize_prompt(self, prompt: str) -> List[str]:\n        \"\"\"Tokenize and clean the input prompt\"\"\"\n        # Convert to lowercase and remove special characters\n        cleaned = re.sub(r'[^\\w\\s]', ' ', prompt.lower())\n        \n        # Split into tokens and filter short words\n        tokens = [token for token in cleaned.split() if len(token) > 2]\n        \n        return tokens\n    \n    def _extract_entities(self, tokens: List[str], original_prompt: str) -> Dict[str, List[str]]:\n        \"\"\"Extract entities from tokens\"\"\"\n        entities = {\n            'page_types': [],\n            'styles': [],\n            'components': [],\n            'domains': [],\n            'audiences': [],\n            'functional': [],\n            'technical': []\n        }\n        \n        text = ' '.join(tokens)\n        original_lower = original_prompt.lower()\n        \n        # Extract page types\n        for page_type, pattern_data in self.design_patterns.items():\n            for keyword in pattern_data['keywords']:\n                if keyword in original_lower:\n                    entities['page_types'].append(page_type)\n                    break\n        \n        # Extract styles\n        for style, style_data in self.style_guides.items():\n            for keyword in style_data['keywords']:\n                if keyword in original_lower:\n                    entities['styles'].append(style)\n                    break\n        \n        # Extract business domains\n        for domain, domain_data in self.domain_knowledge.items():\n            for keyword in domain_data['keywords']:\n                if keyword in original_lower:\n                    entities['domains'].append(domain)\n                    break\n        \n        # Extract functional requirements\n        functional_patterns = {\n            'responsive': ['responsive', 'mobile', 'tablet', 'device'],\n            'accessible': ['accessible', 'accessibility', 'a11y', 'wcag'],\n            'performance': ['fast', 'performance', 'speed', 'optimize'],\n            'secure': ['secure', 'security', 'safe', 'ssl'],\n            'seo': ['seo', 'search', 'google', 'optimization'],\n            'animations': ['animation', 'motion', 'transition', 'interactive']\n        }\n        \n        for requirement, keywords in functional_patterns.items():\n            if any(keyword in original_lower for keyword in keywords):\n                entities['functional'].append(requirement)\n        \n        # Extract technical requirements\n        technical_patterns = {\n            'react_nextjs': ['react', 'nextjs', 'next.js', 'jsx'],\n            'typescript': ['typescript', 'ts', 'type'],\n            'tailwind': ['tailwind', 'css', 'styling'],\n            'api_integration': ['api', 'backend', 'server', 'database'],\n            'authentication': ['auth', 'login', 'user', 'session']\n        }\n        \n        for requirement, keywords in technical_patterns.items():\n            if any(keyword in original_lower for keyword in keywords):\n                entities['technical'].append(requirement)\n        \n        return entities\n    \n    def _classify_intent(self, entities: Dict[str, List[str]], prompt: str) -> Dict[str, Any]:\n        \"\"\"Classify the design intent based on extracted entities\"\"\"\n        \n        # Determine page type\n        page_type = entities['page_types'][0] if entities['page_types'] else 'landing'\n        \n        # Get pattern data\n        pattern = self.design_patterns.get(page_type, self.design_patterns['landing'])\n        \n        # Determine styles\n        styles = entities['styles'] if entities['styles'] else ['modern']\n        \n        # Determine domain\n        domain = entities['domains'][0] if entities['domains'] else 'general'\n        \n        # Infer audience\n        audience = self._infer_audience(domain, prompt)\n        \n        # Infer personality\n        personality = self._infer_personality(styles, domain)\n        \n        # Get functional requirements\n        functional = entities['functional'] if entities['functional'] else ['responsive']\n        \n        # Get technical requirements\n        technical = entities['technical'] if entities['technical'] else ['react_nextjs', 'tailwind']\n        \n        return {\n            'page_type': page_type,\n            'styles': styles,\n            'components': pattern['components'],\n            'layout': pattern['layouts'][0],\n            'domain': domain,\n            'audience': audience,\n            'personality': personality,\n            'functional': functional,\n            'technical': technical\n        }\n    \n    def _infer_audience(self, domain: str, prompt: str) -> str:\n        \"\"\"Infer target audience from domain and prompt\"\"\"\n        if domain in self.domain_knowledge:\n            return self.domain_knowledge[domain]['audience']\n        \n        # Pattern-based audience detection\n        audience_patterns = {\n            'professionals': ['business', 'corporate', 'professional', 'enterprise'],\n            'developers': ['developer', 'tech', 'programmer', 'code'],\n            'students': ['student', 'learn', 'education', 'course'],\n            'consumers': ['customer', 'user', 'buyer', 'consumer'],\n            'creatives': ['artist', 'designer', 'creative', 'portfolio']\n        }\n        \n        prompt_lower = prompt.lower()\n        for audience, keywords in audience_patterns.items():\n            if any(keyword in prompt_lower for keyword in keywords):\n                return audience\n        \n        return 'general'\n    \n    def _infer_personality(self, styles: List[str], domain: str) -> List[str]:\n        \"\"\"Infer brand personality from styles and domain\"\"\"\n        personality = []\n        \n        # Style-based personality\n        style_personalities = {\n            'minimalist': ['sophisticated', 'clean', 'professional'],\n            'brutalist': ['bold', 'experimental', 'edgy'],\n            'glassmorphism': ['modern', 'innovative', 'elegant'],\n            'dark': ['sophisticated', 'dramatic', 'premium'],\n            'colorful': ['energetic', 'playful', 'vibrant']\n        }\n        \n        for style in styles:\n            if style in style_personalities:\n                personality.extend(style_personalities[style])\n        \n        # Domain-based personality\n        if domain in self.domain_knowledge:\n            personality.extend(self.domain_knowledge[domain]['characteristics'])\n        \n        # Remove duplicates and return\n        return list(set(personality)) if personality else ['friendly', 'approachable']\n    \n    def _calculate_complexity(self, intent: Dict[str, Any], prompt: str) -> float:\n        \"\"\"Calculate design complexity score\"\"\"\n        base_complexity = 0.5\n        \n        # Page type complexity\n        page_type = intent['page_type']\n        if page_type in self.design_patterns:\n            base_complexity = self.design_patterns[page_type]['complexity']\n        \n        # Style complexity\n        for style in intent['styles']:\n            if style in self.style_guides:\n                base_complexity += self.style_guides[style]['complexity'] * 0.1\n        \n        # Component count complexity\n        component_count = len(intent['components'])\n        base_complexity += (component_count - 3) * 0.05\n        \n        # Functional requirements complexity\n        functional_count = len(intent['functional'])\n        base_complexity += functional_count * 0.08\n        \n        # Technical requirements complexity\n        technical_count = len(intent['technical'])\n        base_complexity += technical_count * 0.06\n        \n        # Prompt length complexity\n        prompt_length = len(prompt.split())\n        if prompt_length > 50:\n            base_complexity += 0.1\n        elif prompt_length > 100:\n            base_complexity += 0.2\n        \n        return min(base_complexity, 1.0)\n    \n    def _calculate_confidence(self, entities: Dict[str, List[str]], prompt: str) -> float:\n        \"\"\"Calculate confidence score for the analysis\"\"\"\n        confidence = 0.5\n        \n        # Entity detection confidence\n        if entities['page_types']:\n            confidence += 0.3\n        if entities['styles']:\n            confidence += 0.2\n        if entities['domains']:\n            confidence += 0.1\n        \n        # Prompt quality confidence\n        prompt_length = len(prompt.split())\n        if prompt_length > 10:\n            confidence += 0.1\n        if prompt_length > 25:\n            confidence += 0.1\n        \n        # Specificity confidence\n        specific_terms = ['create', 'build', 'design', 'make', 'generate']\n        if any(term in prompt.lower() for term in specific_terms):\n            confidence += 0.1\n        \n        return min(confidence, 1.0)\n    \n    def _get_default_analysis(self) -> DesignIntentResponse:\n        \"\"\"Return default analysis when processing fails\"\"\"\n        return DesignIntentResponse(\n            page_type=\"landing\",\n            style_preferences=[\"modern\"],\n            components=[\"header\", \"hero\", \"features\", \"footer\"],\n            layout=\"single_column\",\n            complexity=0.5,\n            business_domain=\"general\",\n            target_audience=\"general\",\n            brand_personality=[\"friendly\", \"approachable\"],\n            functional_requirements=[\"responsive\"],\n            technical_requirements=[\"react_nextjs\", \"tailwind\"],\n            confidence=0.3\n        )
