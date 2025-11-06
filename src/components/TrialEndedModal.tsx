 

"use client";

import { useModalStore } from "@/store/useModalStore";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Zap } from "lucide-react";
import Link from "next/link";

export default function TrialEndedModal() {
  const { isTrialEndedModalOpen, closeAllModals } = useModalStore();

  return (
    <AnimatePresence>
      {isTrialEndedModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0  backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeAllModals}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative max-w-md w-full bg-gradient-to-br from-[#1a1a2e] to-[#12121a] rounded-2xl border border-red-500/20 p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeAllModals}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 mb-6">
              <Zap className="w-8 h-8 text-red-300" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">
              Your 5-Day Trial Has Ended
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Please upgrade to Pro to continue using AI features, Live
              Sessions, and all premium languages.
            </p>

            <Link
              href="/pricing"
              onClick={closeAllModals}
              className="inline-flex items-center justify-center gap-2 w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold text-base"
            >
              <Sparkles className="w-5 h-5" />
              Upgrade to Pro
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}