import { GeminiRateLimitData, GeminiState } from "@/types";
import { create } from "zustand";

const DAILY_LIMIT = 1;
const RATE_LIMIT_KEY = 'gemini-api-rate-limit';

const getTomorrowMidnight = (): number => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
};

const getRateLimitDataFromStorage = (): GeminiRateLimitData => {
  if (typeof window === 'undefined') {
    return { count: 0, resetTime: getTomorrowMidnight() };
  }
  
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  if (!stored) {
    return { count: 0, resetTime: getTomorrowMidnight() };
  }
  
  try {
    const data: GeminiRateLimitData = JSON.parse(stored);
    
    // Check if we need to reset (new day)
    if (Date.now() > data.resetTime) {
      return { count: 0, resetTime: getTomorrowMidnight() };
    }
    
    return data;
  } catch {
    return { count: 0, resetTime: getTomorrowMidnight() };
  }
};

const saveRateLimitDataToStorage = (data: GeminiRateLimitData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  }
};

export const useGeminiStore = create<GeminiState>((set, get) => ({
  dailyUsage: 0,
  resetTime: getTomorrowMidnight(),
  maxDailyLimit: DAILY_LIMIT,

  initializeFromStorage: () => {
    const data = getRateLimitDataFromStorage();
    set({
      dailyUsage: data.count,
      resetTime: data.resetTime,
    });
  },

  canMakeRequest: () => {
    const { dailyUsage, maxDailyLimit, resetTime } = get();
    
    // Check if we need to reset
    if (Date.now() > resetTime) {
      const newResetTime = getTomorrowMidnight();
      set({ dailyUsage: 0, resetTime: newResetTime });
      saveRateLimitDataToStorage({ count: 0, resetTime: newResetTime });
      return true;
    }
    
    return dailyUsage < maxDailyLimit;
  },

  incrementUsage: () => {
    const { dailyUsage, resetTime } = get();
    const newCount = dailyUsage + 1;
    
    set({ dailyUsage: newCount });
    saveRateLimitDataToStorage({ count: newCount, resetTime });
  },

  getRemainingRequests: () => {
    const { dailyUsage, maxDailyLimit, resetTime } = get();
    
    // Check if we need to reset
    if (Date.now() > resetTime) {
      const newResetTime = getTomorrowMidnight();
      set({ dailyUsage: 0, resetTime: newResetTime });
      saveRateLimitDataToStorage({ count: 0, resetTime: newResetTime });
      return maxDailyLimit;
    }
    
    return Math.max(0, maxDailyLimit - dailyUsage);
  },

  getResetTime: () => {
    const { resetTime } = get();
    return resetTime;
  },

  getCurrentCount: () => {
    const { dailyUsage, resetTime } = get();
    
    // Check if we need to reset
    if (Date.now() > resetTime) {
      const newResetTime = getTomorrowMidnight();
      set({ dailyUsage: 0, resetTime: newResetTime });
      saveRateLimitDataToStorage({ count: 0, resetTime: newResetTime });
      return 0;
    }
    
    return dailyUsage;
  },
}));