import { GeminiRateLimitData, GeminiState } from "@/types";
import { create } from "zustand";

const DAILY_LIMIT = 5;
const RATE_LIMIT_KEY = 'gemini-api-rate-limit';

const getTomorrowMidnight = (): number => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
};

const getInitialState = (): Omit<GeminiRateLimitData, 'count'> & { dailyUsage: number } => {
  if (typeof window === 'undefined') {
    return { dailyUsage: 0, resetTime: getTomorrowMidnight() };
  }
  
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  if (!stored) {
    return { dailyUsage: 0, resetTime: getTomorrowMidnight() };
  }
  
  try {
    const data: GeminiRateLimitData = JSON.parse(stored);
    
    // Check if we need to reset (new day)
    if (Date.now() > data.resetTime) {
      return { dailyUsage: 0, resetTime: getTomorrowMidnight() };
    }
    
    // Return state compatible with the store
    return { dailyUsage: data.count, resetTime: data.resetTime };
  } catch {
    return { dailyUsage: 0, resetTime: getTomorrowMidnight() };
  }
};


const saveRateLimitDataToStorage = (data: GeminiRateLimitData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  }
};



export const useGeminiStore = create<GeminiState>((set, get) => {

  const initialState = getInitialState();

  return {
    ...initialState, 
    maxDailyLimit: DAILY_LIMIT,


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

      if (Date.now() > resetTime) {
        const newResetTime = getTomorrowMidnight();
        set({ dailyUsage: 0, resetTime: newResetTime });
        saveRateLimitDataToStorage({ count: 0, resetTime: newResetTime });
        return newResetTime;
      }
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

    initializeFromStorage: () => {
      const initialState = getInitialState();
      set({ dailyUsage: initialState.dailyUsage, resetTime: initialState.resetTime });
    },
  };
});