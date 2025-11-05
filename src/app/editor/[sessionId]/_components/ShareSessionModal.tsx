"use client";

import { Check, Copy, Loader2, Lock, Users, X } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

interface ShareSessionModalProps {
  sessionId: string;
  onClose: () => void;
}

export default function ShareSessionModal({ sessionId, onClose }: ShareSessionModalProps) {
  const [sessionUrl, setSessionUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  
  // Get session data to check ownership and public status
  const { user } = useUser();
  const session = useQuery(api.sessions.get, { sessionId: sessionId as Id<"sessions"> });
  const updateAccess = useMutation(api.sessions.updateSessionAccess);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const isOwner = session?.ownerId === user?.id;
  const isPublic = session?.isPublic || false;

  useEffect(() => {
    setSessionUrl(window.location.href);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionUrl);
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAccessToggle = async () => {
    if (!isOwner) return;
    setIsUpdating(true);
    try {
      await updateAccess({
        sessionId: sessionId as Id<"sessions">,
        isPublic: !isPublic,
      });
      toast.success(
        `Session is now ${!isPublic ? "public (editable by all)" : "private"}`
      );
    } catch (error) {
      toast.error("Failed to update access.");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-[#0c0c18] rounded-4xl border border-gray-800/50 w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Share Session</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          

          {isOwner && (
            <div className="mb-4 p-4 bg-[#12121a] rounded-lg border border-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isPublic ? (
                    <Users className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-medium text-white">
                      {isPublic ? "Public Access" : "Private Session"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {isPublic
                        ? "Anyone with the link can edit."
                        : "Only you (the owner) can edit."}
                    </p>
                  </div>
                </div>
                {isUpdating ? (
                  <Loader2 className="w-5 h-5 text-gray-400 loader-spin" />
                ) : (
                  <button
                    onClick={handleAccessToggle}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isPublic ? "bg-blue-600" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isPublic ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-400 mb-2">
            Copy the link to invite others:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={sessionUrl}
              readOnly
              className="w-full px-3 py-2 bg-[#12121a] border border-[#313244] rounded-lg text-gray-300 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg transition-all text-white font-medium ${
                isCopied
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}