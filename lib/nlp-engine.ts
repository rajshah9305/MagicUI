/**
 * Advanced NLP Engine for Magic UI Studio
 * Intelligent prompt analysis and task orchestration
 */

export interface DesignIntent {
  pageType: string;
  stylePreferences: string[];
  components: string[];
  layout: string;
  complexity: number;
  businessDomain: string;
  targetAudience: string;
  brandPersonality: string[];
  functionalRequirements: string[];
  technicalRequirements: string[];
  confidence: number;
}

export interface TaskAssignment {
  agentId: string;
  priority: number;
  estimatedDuration: number;
  dependencies: string[];
  parameters: Record<string, any>;
}

export class AdvancedNLPEngine {
  private designPatterns: Map<string, any>;
  private componentLibrary: Map<string, any>;
  private styleGuides: Map<string, any>;

  constructor() {
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase() {
    this.designPatterns = new Map([
      ['authentication', {
        components: ['login_form', 'social_auth', 'password_reset', 'two_factor'],
        layouts: ['centered', 'split_screen', 'modal'],
        complexity: 0.6
      }],
      ['dashboard', {
        components: ['sidebar', 'header', 'stats_cards', 'charts', 'tables', 'notifications'],
        layouts: ['sidebar_left', 'sidebar_right', 'top_nav'],
        complexity: 0.9
      }],
      ['landing', {
        components: ['hero', 'features', 'testimonials', 'pricing', 'cta', 'footer'],
        layouts: ['single_column', 'multi_section', 'parallax'],
        complexity: 0.7
      }],
      ['ecommerce', {
        components: ['product_grid', 'filters', 'cart', 'checkout', 'reviews'],
        layouts: ['grid_sidebar', 'masonry', 'list_view'],
        complexity: 0.8
      }]
    ]);

    this.styleGuides = new Map([
      ['glassmorphism', {
        characteristics: ['transparency', 'blur', 'gradient', 'modern'],
        complexity: 0.7,
        suitability: ['landing', 'portfolio', 'creative']
      }],
      ['minimalist', {
        characteristics: ['clean', 'whitespace', 'typography', 'simple'],
        complexity: 0.4,
        suitability: ['dashboard', 'blog', 'corporate']
      }],
      ['brutalist', {
        characteristics: ['bold', 'geometric', 'contrast', 'experimental'],
        complexity: 0.8,
        suitability: ['portfolio', 'creative', 'artistic']
      }]
    ]);
  }

  async analyzePrompt(prompt: string): Promise<DesignIntent> {
    const tokens = this.tokenizePrompt(prompt);
    const entities = this.extractEntities(tokens);
    const intent = this.classifyIntent(entities, prompt);
    
    return {
      pageType: intent.pageType,
      stylePreferences: intent.styles,
      components: intent.components,
      layout: intent.layout,
      complexity: this.calculateComplexity(intent),
      businessDomain: intent.domain,
      targetAudience: intent.audience,
      brandPersonality: intent.personality,
      functionalRequirements: intent.functional,
      technicalRequirements: intent.technical,
      confidence: intent.confidence
    };
  }

  private tokenizePrompt(prompt: string): string[] {
    return prompt.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2);
  }

  private extractEntities(tokens: string[]): any {
    const entities = {
      pageTypes: [],
      styles: [],
      components: [],
      layouts: [],
      domains: [],
      audiences: [],
      personalities: [],
      functional: [],
      technical: []
    };

    const patterns = {
      pageTypes: {
        'login|signin|auth|authentication': 'authentication',
        'dashboard|admin|panel|analytics': 'dashboard',
        'landing|home|hero|marketing': 'landing',
        'shop|store|ecommerce|product': 'ecommerce',
        'blog|article|news|content': 'blog',
        'portfolio|showcase|gallery': 'portfolio',
        'contact|form|inquiry': 'contact'
      },
      styles: {
        'glass|glassmorphism|transparent|blur': 'glassmorphism',
        'minimal|minimalist|clean|simple': 'minimalist',
        'brutal|brutalist|bold|geometric': 'brutalist',
        'dark|night|black': 'dark',
        'modern|contemporary|sleek': 'modern',
        'corporate|professional|business': 'corporate'
      },
      components: {
        'form|input|field': 'forms',
        'chart|graph|analytics': 'charts',
        'card|tile|widget': 'cards',
        'nav|navigation|menu': 'navigation',
        'button|cta|action': 'buttons',
        'image|photo|gallery': 'media'
      },
      domains: {
        'saas|software|tech': 'technology',
        'finance|bank|fintech': 'finance',
        'health|medical|healthcare': 'healthcare',
        'education|learning|course': 'education',
        'retail|fashion|commerce': 'retail'
      }
    };

    const text = tokens.join(' ');
    
    Object.entries(patterns).forEach(([category, categoryPatterns]) => {
      Object.entries(categoryPatterns).forEach(([pattern, value]) => {
        if (new RegExp(pattern).test(text)) {
          entities[category as keyof typeof entities].push(value);
        }
      });
    });

    return entities;
  }

  private classifyIntent(entities: any, originalPrompt: string): any {
    const pageType = entities.pageTypes[0] || 'landing';
    const pattern = this.designPatterns.get(pageType);
    
    return {
      pageType,
      styles: entities.styles.length > 0 ? entities.styles : ['modern'],
      components: pattern?.components || ['header', 'content', 'footer'],
      layout: pattern?.layouts[0] || 'single_column',
      domain: entities.domains[0] || 'general',
      audience: this.inferAudience(originalPrompt),
      personality: this.inferPersonality(entities.styles, entities.domains),
      functional: this.extractFunctionalRequirements(originalPrompt),
      technical: this.extractTechnicalRequirements(originalPrompt),
      confidence: this.calculateConfidence(entities, originalPrompt)
    };
  }

  private inferAudience(prompt: string): string {
    const audiencePatterns = {
      'professional|business|corporate': 'professionals',
      'young|millennial|gen': 'young_adults',
      'senior|elderly|mature': 'seniors',
      'developer|tech|programmer': 'developers',
      'creative|artist|designer': 'creatives'
    };

    for (const [pattern, audience] of Object.entries(audiencePatterns)) {
      if (new RegExp(pattern, 'i').test(prompt)) {
        return audience;
      }
    }
    return 'general';
  }

  private inferPersonality(styles: string[], domains: string[]): string[] {
    const personality = [];
    
    if (styles.includes('minimalist')) personality.push('sophisticated', 'clean');
    if (styles.includes('brutalist')) personality.push('bold', 'experimental');
    if (styles.includes('glassmorphism')) personality.push('modern', 'innovative');
    if (domains.includes('finance')) personality.push('trustworthy', 'professional');
    if (domains.includes('technology')) personality.push('cutting-edge', 'efficient');
    
    return personality.length > 0 ? personality : ['friendly', 'approachable'];
  }

  private extractFunctionalRequirements(prompt: string): string[] {
    const requirements = [];
    const patterns = {
      'responsive|mobile': 'responsive_design',
      'accessible|accessibility': 'accessibility',
      'fast|performance|speed': 'performance',
      'secure|security|safe': 'security',
      'search|seo': 'seo_optimized',
      'animation|motion|interactive': 'animations'
    };

    Object.entries(patterns).forEach(([pattern, requirement]) => {
      if (new RegExp(pattern, 'i').test(prompt)) {
        requirements.push(requirement);
      }
    });

    return requirements;
  }

  private extractTechnicalRequirements(prompt: string): string[] {
    const requirements = [];
    const patterns = {
      'react|nextjs|next': 'react_nextjs',
      'typescript|ts': 'typescript',
      'tailwind|css': 'tailwind_css',
      'api|backend': 'api_integration',
      'database|db': 'database',
      'auth|authentication': 'authentication'
    };

    Object.entries(patterns).forEach(([pattern, requirement]) => {
      if (new RegExp(pattern, 'i').test(prompt)) {
        requirements.push(requirement);
      }
    });

    return requirements.length > 0 ? requirements : ['react_nextjs', 'tailwind_css'];
  }

  private calculateComplexity(intent: any): number {
    let complexity = 0.5;
    
    complexity += intent.components.length * 0.05;
    complexity += intent.functional.length * 0.1;
    complexity += intent.technical.length * 0.08;
    
    if (intent.pageType === 'dashboard') complexity += 0.2;
    if (intent.pageType === 'ecommerce') complexity += 0.15;
    
    return Math.min(complexity, 1.0);
  }

  private calculateConfidence(entities: any, prompt: string): number {
    let confidence = 0.5;
    
    if (entities.pageTypes.length > 0) confidence += 0.3;
    if (entities.styles.length > 0) confidence += 0.2;
    if (prompt.length > 50) confidence += 0.1;
    if (prompt.length > 100) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  generateTaskAssignments(intent: DesignIntent): TaskAssignment[] {
    const assignments: TaskAssignment[] = [];
    
    // Architect - Always first
    assignments.push({
      agentId: 'architect',
      priority: 1,
      estimatedDuration: Math.ceil(intent.complexity * 3000),
      dependencies: [],
      parameters: {
        pageType: intent.pageType,
        components: intent.components,
        layout: intent.layout,
        complexity: intent.complexity
      }
    });

    // Style Curator - After architect
    assignments.push({
      agentId: 'style_curator',
      priority: 2,
      estimatedDuration: Math.ceil(intent.complexity * 2500),
      dependencies: ['architect'],
      parameters: {
        styles: intent.stylePreferences,
        personality: intent.brandPersonality,
        domain: intent.businessDomain
      }
    });

    // Code Generator - After style curator
    assignments.push({
      agentId: 'code_generator',
      priority: 3,
      estimatedDuration: Math.ceil(intent.complexity * 4000),
      dependencies: ['architect', 'style_curator'],
      parameters: {
        technical: intent.technicalRequirements,
        functional: intent.functionalRequirements
      }
    });

    // Previewer - After code generator
    assignments.push({
      agentId: 'previewer',
      priority: 4,
      estimatedDuration: 1500,
      dependencies: ['code_generator'],
      parameters: {
        interactive: true,
        responsive: intent.functionalRequirements.includes('responsive_design')
      }
    });

    // QA Engineer - After previewer
    assignments.push({
      agentId: 'qa_engineer',
      priority: 5,
      estimatedDuration: 2000,
      dependencies: ['previewer'],
      parameters: {
        accessibility: intent.functionalRequirements.includes('accessibility'),
        performance: intent.functionalRequirements.includes('performance')
      }
    });

    // Exporter - Final step
    assignments.push({
      agentId: 'exporter',
      priority: 6,
      estimatedDuration: 1000,
      dependencies: ['qa_engineer'],
      parameters: {
        format: 'production',
        deployment: 'vercel'
      }
    });

    return assignments;
  }
}