import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from './api';
import { 
  ChatMessage, 
  PreviewManifest, 
  Variant, 
  Agent, 
  GenerationRequest, 
  GenerationResponse,
  PerformanceMetrics,
  WebSocketMessage
} from './types';
import toast from 'react-hot-toast';

// WebSocket Hook
export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connect = async () => {
      try {
        await api.connectWebSocket();
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect');
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      api.disconnect();
    };
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (api.ws && api.ws.readyState === WebSocket.OPEN) {
      api.ws.send(JSON.stringify(message));
    }
  }, []);

  return { isConnected, error, sendMessage };
}

// Chat Hook
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string, agent?: string) => {
    const newMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      role: 'user',
      text,
      agent,
    };

    setMessages(prev => [...prev, { ...newMessage, id: Date.now().toString(), timestamp: new Date() }]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.sendChatMessage(newMessage);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);
  
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await api.getChatHistory();
        setMessages(history);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    loadHistory();
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}

// Preview Manifest Hook
export function usePreviewManifest() {
  const [manifest, setManifest] = useState<PreviewManifest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshManifest = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getPreviewManifest();
      setManifest(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load preview manifest';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshManifest();
  }, [refreshManifest]);

  return {
    manifest,
    isLoading,
    error,
    refreshManifest,
  };
}

// Generation Hook
export function useGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (request: GenerationRequest) => {
    setIsGenerating(true);
    setProgress(0);
    setCurrentStep('Initializing...');
    setError(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      const response = await api.generateUI(request);

      clearInterval(progressInterval);
      setProgress(100);
      setCurrentStep('Complete!');

      toast.success('UI generated successfully!');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate UI';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setProgress(0);
        setCurrentStep('');
      }, 2000);
    }
  }, []);

  return {
    isGenerating,
    progress,
    currentStep,
    error,
    generate,
  };
}

// Agents Hook
export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAgents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getAgents();
      setAgents(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load agents';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAgents();
  }, [refreshAgents]);

  return {
    agents,
    isLoading,
    error,
    refreshAgents,
  };
}

// Performance Metrics Hook
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getPerformanceMetrics();
      setMetrics(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load metrics';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMetrics();
    const interval = setInterval(refreshMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [refreshMetrics]);

  return {
    metrics,
    isLoading,
    error,
    refreshMetrics,
  };
}

// Variant Selection Hook
export function useVariantSelection() {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [pinnedVariants, setPinnedVariants] = useState<Set<string>>(new Set());

  const selectVariant = useCallback((variantId: string) => {
    setSelectedVariant(variantId);
  }, []);

  const pinVariant = useCallback((variantId: string) => {
    setPinnedVariants(prev => new Set([...prev, variantId]));
  }, []);

  const unpinVariant = useCallback((variantId: string) => {
    setPinnedVariants(prev => {
      const newSet = new Set(prev);
      newSet.delete(variantId);
      return newSet;
    });
  }, []);

  const togglePin = useCallback((variantId: string) => {
    if (pinnedVariants.has(variantId)) {
      unpinVariant(variantId);
      } else {
      pinVariant(variantId);
    }
  }, [pinnedVariants, pinVariant, unpinVariant]);

  return {
    selectedVariant,
    pinnedVariants,
    selectVariant,
    pinVariant,
    unpinVariant,
    togglePin,
  };
}

// Local Storage Hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

// Debounce Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Intersection Observer Hook
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return isIntersecting;
}

// Previous Value Hook
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}