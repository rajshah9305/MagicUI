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
from app.models import DesignIntentResponse

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
            
        except Exception as e:
            logger.error(f"Error in prompt analysis: {str(e)}")
            # Return default analysis on error
            return self._get_default_analysis()
    
    def _tokenize_prompt(self, prompt: str) -> List[str]:
        """Tokenize and clean the input prompt"""
        # Convert to lowercase and remove special characters
        cleaned = re.sub(r'[^\w\s]', ' ', prompt.lower())
        
        # Split into tokens and filter short words
        tokens = [token for token in cleaned.split() if len(token) > 2]
        
        return tokens
    
    def _extract_entities(self, tokens: List[str], original_prompt: str) -> Dict[str, List[str]]:
        """Extract entities from tokens"""
        entities = {
            'page_types': [],
            'styles': [],
            'components': [],
            'domains': [],
            'audiences': [],
            'functional': [],
            'technical': []
        }
        
        text = ' '.join(tokens)
        original_lower = original_prompt.lower()
        
        # Extract page types
        for page_type, pattern_data in self.design_patterns.items():
            for keyword in pattern_data['keywords']:
                if keyword in original_lower:
                    entities['page_types'].append(page_type)
                    break
        
        # Extract styles
        for style, style_data in self.style_guides.items():
            for keyword in style_data['keywords']:
                if keyword in original_lower:
                    entities['styles'].append(style)
                    break
        
        # Extract business domains
        for domain, domain_data in self.domain_knowledge.items():
            for keyword in domain_data['keywords']:
                if keyword in original_lower:
                    entities['domains'].append(domain)
                    break
        
        # Extract functional requirements
        functional_patterns = {
            'responsive': ['responsive', 'mobile', 'tablet', 'device'],
            'accessible': ['accessible', 'accessibility', 'a11y', 'wcag'],
            'performance': ['fast', 'performance', 'speed', 'optimize'],
            'secure': ['secure', 'security', 'safe', 'ssl'],
            'seo': ['seo', 'search', 'google', 'optimization'],
            'animations': ['animation', 'motion', 'transition', 'interactive']
        }
        
        for requirement, keywords in functional_patterns.items():
            if any(keyword in original_lower for keyword in keywords):
                entities['functional'].append(requirement)
        
        # Extract technical requirements
        technical_patterns = {
            'react_nextjs': ['react', 'nextjs', 'next.js', 'jsx'],
            'typescript': ['typescript', 'ts', 'type'],
            'tailwind': ['tailwind', 'css', 'styling'],
            'api_integration': ['api', 'backend', 'server', 'database'],
            'authentication': ['auth', 'login', 'user', 'session']
        }
        
        for requirement, keywords in technical_patterns.items():
            if any(keyword in original_lower for keyword in keywords):
                entities['technical'].append(requirement)
        
        return entities
    
    def _classify_intent(self, entities: Dict[str, List[str]], prompt: str) -> Dict[str, Any]:
        """Classify the design intent based on extracted entities"""
        
        # Determine page type
        page_type = entities['page_types'][0] if entities['page_types'] else 'landing'
        
        # Get pattern data
        pattern = self.design_patterns.get(page_type, self.design_patterns['landing'])
        
        # Determine styles
        styles = entities['styles'] if entities['styles'] else ['modern']
        
        # Determine domain
        domain = entities['domains'][0] if entities['domains'] else 'general'
        
        # Infer audience
        audience = self._infer_audience(domain, prompt)
        
        # Infer personality
        personality = self._infer_personality(styles, domain)
        
        # Get functional requirements
        functional = entities['functional'] if entities['functional'] else ['responsive']
        
        # Get technical requirements
        technical = entities['technical'] if entities['technical'] else ['react_nextjs', 'tailwind']
        
        return {
            'page_type': page_type,
            'styles': styles,
            'components': pattern['components'],
            'layout': pattern['layouts'][0],
            'domain': domain,
            'audience': audience,
            'personality': personality,
            'functional': functional,
            'technical': technical
        }
    
    def _infer_audience(self, domain: str, prompt: str) -> str:
        """Infer target audience from domain and prompt"""
        if domain in self.domain_knowledge:
            return self.domain_knowledge[domain]['audience']
        
        # Pattern-based audience detection
        audience_patterns = {
            'professionals': ['business', 'corporate', 'professional', 'enterprise'],
            'developers': ['developer', 'tech', 'programmer', 'code'],
            'students': ['student', 'learn', 'education', 'course'],
            'consumers': ['customer', 'user', 'buyer', 'consumer'],
            'creatives': ['artist', 'designer', 'creative', 'portfolio']
        }
        
        prompt_lower = prompt.lower()
        for audience, keywords in audience_patterns.items():
            if any(keyword in prompt_lower for keyword in keywords):
                return audience
        
        return 'general'
    
    def _infer_personality(self, styles: List[str], domain: str) -> List[str]:
        """Infer brand personality from styles and domain"""
        personality = []
        
        # Style-based personality
        style_personalities = {
            'minimalist': ['sophisticated', 'clean', 'professional'],
            'brutalist': ['bold', 'experimental', 'edgy'],
            'glassmorphism': ['modern', 'innovative', 'elegant'],
            'dark': ['sophisticated', 'dramatic', 'premium'],
            'colorful': ['energetic', 'playful', 'vibrant']
        }
        
        for style in styles:
            if style in style_personalities:
                personality.extend(style_personalities[style])
        
        # Domain-based personality
        if domain in self.domain_knowledge:
            personality.extend(self.domain_knowledge[domain]['characteristics'])
        
        # Remove duplicates and return
        return list(set(personality)) if personality else ['friendly', 'approachable']
    
    def _calculate_complexity(self, intent: Dict[str, Any], prompt: str) -> float:
        """Calculate design complexity score"""
        base_complexity = 0.5
        
        # Page type complexity
        page_type = intent['page_type']
        if page_type in self.design_patterns:
            base_complexity = self.design_patterns[page_type]['complexity']
        
        # Style complexity
        for style in intent['styles']:
            if style in self.style_guides:
                base_complexity += self.style_guides[style]['complexity'] * 0.1
        
        # Component count complexity
        component_count = len(intent['components'])
        base_complexity += (component_count - 3) * 0.05
        
        # Functional requirements complexity
        functional_count = len(intent['functional'])
        base_complexity += functional_count * 0.08
        
        # Technical requirements complexity
        technical_count = len(intent['technical'])
        base_complexity += technical_count * 0.06
        
        # Prompt length complexity
        prompt_length = len(prompt.split())
        if prompt_length > 50:
            base_complexity += 0.1
        elif prompt_length > 100:
            base_complexity += 0.2
        
        return min(base_complexity, 1.0)
    
    def _calculate_confidence(self, entities: Dict[str, List[str]], prompt: str) -> float:
        """Calculate confidence score for the analysis"""
        confidence = 0.5
        
        # Entity detection confidence
        if entities['page_types']:
            confidence += 0.3
        if entities['styles']:
            confidence += 0.2
        if entities['domains']:
            confidence += 0.1
        
        # Prompt quality confidence
        prompt_length = len(prompt.split())
        if prompt_length > 10:
            confidence += 0.1
        if prompt_length > 25:
            confidence += 0.1
        
        # Specificity confidence
        specific_terms = ['create', 'build', 'design', 'make', 'generate']
        if any(term in prompt.lower() for term in specific_terms):
            confidence += 0.1
        
        return min(confidence, 1.0)
    
    def _get_default_analysis(self) -> DesignIntentResponse:
        """Return default analysis when processing fails"""
        return DesignIntentResponse(
            page_type="landing",
            style_preferences=["modern"],
            components=["header", "hero", "features", "footer"],
            layout="single_column",
            complexity=0.5,
            business_domain="general",
            target_audience="general",
            brand_personality=["friendly", "approachable"],
            functional_requirements=["responsive"],
            technical_requirements=["react_nextjs", "tailwind"],
            confidence=0.3
        )