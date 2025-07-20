"use client";

import { RateLimitModalProps } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, AlertTriangle, Calendar, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";



function RateLimitModal({ isOpen, onClose, resetTime, currentCount, maxLimit }: RateLimitModalProps) {
  const [timeUntilReset, setTimeUntilReset] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const updateCountdown = () => {
      const now = Date.now();
      const timeLeft = resetTime - now;

      if (timeLeft <= 0) {
        setTimeUntilReset("Ready to reset!");
        return;
      }

      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isOpen, resetTime]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className=" inset-0  flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative max-w-md w-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl border border-red-500/20 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-yellow-500/10" />
            
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-2xl border border-red-500/30 animate-pulse" />
            
            <div className="relative p-8">
              {/* Header with animated icon */}
              <div className="text-center mb-6">
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 mb-4"
                >
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-white mb-2">
                  Daily Limit Reached
                </h2>
                <p className="text-gray-400">
                  You've used all your AI assistant requests for today
                </p>
              </div>

              {/* Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <Zap className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Requests Used</p>
                      <p className="text-lg font-semibold text-white">
                        {currentCount} / {maxLimit}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentCount / maxLimit) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Resets In</p>
                      <p className="text-lg font-semibold text-white font-mono">
                        {timeUntilReset}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-5 h-5 text-blue-400" />
                  </motion.div>
                </div>
              </div>

              {/* Info section */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-400 mb-1">
                      Daily Reset Schedule
                    </h3>
                    <p className="text-xs text-gray-400">
                      Your AI assistant quota resets every day at midnight. 
                      You'll get {maxLimit} fresh requests to use.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl transition-all duration-200 font-medium"
                >
                  Got It
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-red-400/30 rounded-full"
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -100, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${80}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RateLimitModal;