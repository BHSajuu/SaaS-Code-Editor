
"use client";

import { useModalStore } from "@/store/useModalStore";
import { useMutation } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { api } from "../../convex/_generated/api";


export default function WelcomeTrialModal() {
  const { isTrialWelcomeModalOpen, closeAllModals } = useModalStore();
  const markAsSeen = useMutation(api.users.markTrialModalAsSeen);

  const handleClose = () => {
    markAsSeen();
    closeAllModals();
  };

  return (
    <AnimatePresence>
      {isTrialWelcomeModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0  backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative max-w-lg w-full bg-gradient-to-br from-[#1a1a2e] to-[#12121a] rounded-2xl border border-blue-500/20 p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6">
              <Gift className="w-8 h-8 text-blue-300" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">
              Welcome to CodeNexta!
            </h2>
            <p className="text-lg text-gray-400 mb-6">
              Your <strong>5-Day Free Trial</strong> has started. Enjoy
              full access to all premium features, including:
            </p>

            <ul className="text-left space-y-2 text-gray-300 mb-8 w-fit mx-auto">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                AI Coding Assistant & Error Fixing
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Live Collaboration Sessions
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                All 10+ Programming Languages
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-16 justify-center">
              
              <Link
                href="/pricing"
                onClick={handleClose}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold"
              >
                <Sparkles className="w-4 h-4" />
                Upgrade Now (Optional)
              </Link>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-gray-600/50 text-white rounded-lg hover:bg-gray-600/80 transition-all font-medium"
              >
                Skip
              </button>
              
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}