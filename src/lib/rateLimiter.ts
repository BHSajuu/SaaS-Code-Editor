interface RateLimitData {
  count: number;
  resetTime: number;
}

const DAILY_LIMIT = 2;
const RATE_LIMIT_KEY = 'gemini-api-rate-limit';

export class GeminiRateLimiter {
  private static instance: GeminiRateLimiter;
  
  private constructor() {}
  
  static getInstance(): GeminiRateLimiter {
    if (!GeminiRateLimiter.instance) {
      GeminiRateLimiter.instance = new GeminiRateLimiter();
    }
    return GeminiRateLimiter.instance;
  }
  
  private getRateLimitData(): RateLimitData {
    if (typeof window === 'undefined') {
      return { count: 0, resetTime: this.getTomorrowMidnight() };
    }
    
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (!stored) {
      return { count: 0, resetTime: this.getTomorrowMidnight() };
    }
    
    try {
      const data: RateLimitData = JSON.parse(stored);
      
      // Check if we need to reset (new day)
      if (Date.now() > data.resetTime) {
        return { count: 0, resetTime: this.getTomorrowMidnight() };
      }
      
      return data;
    } catch {
      return { count: 0, resetTime: this.getTomorrowMidnight() };
    }
  }
  
  private saveRateLimitData(data: RateLimitData): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
    }
  }
  
  private getTomorrowMidnight(): number {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime();
  }
  
  canMakeRequest(): boolean {
    const data = this.getRateLimitData();
    return data.count < DAILY_LIMIT;
  }
  
  incrementCount(): void {
    const data = this.getRateLimitData();
    data.count += 1;
    this.saveRateLimitData(data);
  }
  
  getRemainingRequests(): number {
    const data = this.getRateLimitData();
    return Math.max(0, DAILY_LIMIT - data.count);
  }
  
  getResetTime(): number {
    const data = this.getRateLimitData();
    return data.resetTime;
  }
  
  getCurrentCount(): number {
    const data = this.getRateLimitData();
    return data.count;
  }
}