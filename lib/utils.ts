import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return formatDate(d);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    return new Promise((resolve, reject) => {
      if (document.execCommand('copy')) {
        resolve();
      } else {
        reject(new Error('Failed to copy text'));
      }
      document.body.removeChild(textArea);
    });
  }
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

export function calculateNoveltyScore(styleSpec: any, designMemory: any[]): number {
  // Simple novelty calculation based on color uniqueness and style combinations
  const colorHash = JSON.stringify(styleSpec.colors);
  const styleHash = JSON.stringify(styleSpec.trend_tags);
  
  const existingHashes = designMemory.map(m => m.novelty_hash);
  const currentHash = `${colorHash}-${styleHash}`;
  
  if (existingHashes.includes(currentHash)) {
    return 0.3; // Low novelty for exact matches
  }
  
  // Calculate similarity to existing styles
  let maxSimilarity = 0;
  for (const memory of designMemory) {
    const similarity = calculateStyleSimilarity(styleSpec, memory.style_spec);
    maxSimilarity = Math.max(maxSimilarity, similarity);
  }
  
  return Math.max(0.8, 1 - maxSimilarity);
}

export function calculateStyleSimilarity(style1: any, style2: any): number {
  // Simple similarity calculation based on color distance and style tags
  const colorDistance = calculateColorDistance(style1.colors, style2.colors);
  const tagSimilarity = calculateTagSimilarity(style1.trend_tags, style2.trend_tags);
  
  return (colorDistance + tagSimilarity) / 2;
}

export function calculateColorDistance(colors1: any, colors2: any): number {
  const colorKeys = Object.keys(colors1);
  let totalDistance = 0;
  
  for (const key of colorKeys) {
    if (colors2[key]) {
      const color1 = hexToRgb(colors1[key]);
      const color2 = hexToRgb(colors2[key]);
      
      if (color1 && color2) {
        const distance = Math.sqrt(
          Math.pow(color1.r - color2.r, 2) +
          Math.pow(color1.g - color2.g, 2) +
          Math.pow(color1.b - color2.b, 2)
        );
        totalDistance += distance / 441.67; // Normalize to 0-1
      }
    }
  }
  
  return totalDistance / colorKeys.length;
}

export function calculateTagSimilarity(tags1: string[], tags2: string[]): number {
  const set1 = new Set(tags1);
  const set2 = new Set(tags2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function generateStyleHash(styleSpec: any): string {
  const content = JSON.stringify({
    colors: styleSpec.colors,
    typography: styleSpec.typography,
    trend_tags: styleSpec.trend_tags,
  });
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + '...';
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

export function pascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
      return word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  return fn().catch(err => {
    if (retries > 0) {
      return sleep(delay).then(() => retry(fn, retries - 1, delay));
    }
    throw err;
  });
}

export function createEventEmitter<T = any>() {
  const listeners = new Map<string, Set<(data: T) => void>>();

  return {
    on(event: string, listener: (data: T) => void) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(listener);
    },
    
    off(event: string, listener: (data: T) => void) {
      listeners.get(event)?.delete(listener);
    },
    
    emit(event: string, data: T) {
      listeners.get(event)?.forEach(listener => listener(data));
    },
    
    clear() {
      listeners.clear();
    }
  };
}

export function createAsyncQueue<T, R>(
  processor: (item: T) => Promise<R>,
  concurrency: number = 1
) {
  const queue: Array<{ item: T; resolve: (result: R) => void; reject: (error: any) => void }> = [];
  let running = 0;

  const process = async () => {
    if (running >= concurrency || queue.length === 0) return;

    running++;
    const { item, resolve, reject } = queue.shift()!;

    try {
      const result = await processor(item);
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      running--;
      process();
    }
  };

  return {
    add(item: T): Promise<R> {
      return new Promise((resolve, reject) => {
        queue.push({ item, resolve, reject });
        process();
      });
    },
    
    get length() {
      return queue.length;
    },
    
    get running() {
      return running;
    }
  };
}