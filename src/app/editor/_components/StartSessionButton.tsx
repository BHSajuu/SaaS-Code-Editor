"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, Radio } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StartSessionButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { getCode, language } = useCodeEditorStore();
  const createSession = useMutation(api.sessions.createSession);

  const handleStartSession = async () => {
    setIsLoading(true);
    try {
      const code = getCode();
      const sessionId = await createSession({ code, language });
      toast.success("Live session created!");
      router.push(`/editor/${sessionId}`);
    } catch (error) {
      console.error("Failed to create session:", error);
      toast.error("Failed to create session");
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleStartSession}
      disabled={isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r from-green-500 to-green-600 opacity-90 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="size-4 text-white loader-spin" />
      ) : (
        <Radio className="size-4 text-white" />
      )}
      <span className="text-sm font-medium text-white">
        {isLoading ? "Starting..." : "Go Live"}
      </span>
    </motion.button>
  );
}