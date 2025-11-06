"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { AlertTriangle, CheckCircle, Clock, Copy, Loader, Sparkles, Terminal, Zap } from "lucide-react";
import { useState } from "react";
import RunningCodeSkeleton from "./RunningCodeSkeleton";
import toast from "react-hot-toast";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import LoginButton from "@/components/LoginButton";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useGeminiStore } from "@/store/useGeminiStore";
import RateLimitModal from "@/components/RateLimitModal";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useModalStore } from "@/store/useModalStore";


const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

function OutputPanel() {
  const { output, error, isRunning, editor } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);
  const [isAIruning, setIsAIruning] = useState(false);
  const [aiFixComplete, setAiFixComplete] = useState(false);
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);

  const { 
    canMakeRequest, 
    incrementUsage, 
    getResetTime, 
    getCurrentCount, 
    maxDailyLimit,
  } = useGeminiStore();
 
  const { user } = useUser(); 
  const convexUser = useQuery(api.users.getUser, { 
    userId: user?.id || "",
  });

  const trialEndsAt = convexUser?.trialEndsAt ?? 0;
  const isPro = convexUser?.isPro ?? false;
  const isInTrial = trialEndsAt > Date.now();
  const hasAccess = isPro || isInTrial;

  const hasContent = error || output;
  
  const { openTrialEnded } = useModalStore();

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(error || output);
    toast.success("Copied!");
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };


  const handleAIforError = async () => {
    if (!hasAccess) {
     openTrialEnded();
      return;
    }
    
    if (!hasContent) return;
    
     // Check rate limit before making request
    if (!canMakeRequest()) {
      setShowRateLimitModal(true);
      return;
    }

    setIsAIruning(true);
    setAiFixComplete(false);

    try {
      incrementUsage();

      const errorMsg = error || "";
      const language = localStorage.getItem("editor-language") || "javascript";
      const code = localStorage.getItem(`editor-code-${language}`);

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-001",
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
        },
      });

      const prompt = `
      You are an expert ${language} developer.
      You will be given a snippet of ${language} code and the exact compiler/runtime error message it produces.
      Your job is to correct the code so that it compiles/runs without changing its original behavior.

      Language: ${language}

      Original Code:
      \`\`\`${language}
      ${code}
      \`\`\`

      Error Message:
      \`\`\`
      ${errorMsg}
      \`\`\`

      Return only the corrected ${language} code, with no explanations or markdown formatting.
    `;

      const aiResult = await model.generateContent(prompt);

      
      const raw = await aiResult.response.text();

    
      const match = raw.match(/```(?:\w+)?\n([\s\S]*?)```$/);
      const onlyCode = match ? match[1].trim() : raw.trim();

     
      editor?.setValue(onlyCode);

      
      setAiFixComplete(true);

      
      setTimeout(() => {
        setAiFixComplete(false);
      }, 4000);


    } catch (e) {
      console.error("AI error fixer failed:", e);
      toast.error("Failed to fix error. Please try again.");
    } finally {
      setIsAIruning(false);
    }
  };



  return (
  <>
     <div className="relative bg-[#181825] rounded-xl p-4 ring-1 ring-gray-800/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#1e1e2e] ring-1 ring-gray-800/50">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-sm font-medium text-gray-300">Output</span>
        </div>

        {/* Enhanced AI Error Fix Button */}

        {hasContent === error && (
          <Button
            onClick={handleAIforError}
            disabled={isAIruning}
            className={`
               animated-border-button h-12 w-auto hover:scale-105 active:scale-95 transition-all duration-300`}
          >
            <style>{`
                @property --angle {
                  syntax: "<angle>";
                  initial-value: 0deg;
                  inherits: false;
                }

                @keyframes fadeInUp {
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                @keyframes spin {
                  from { --angle: 0deg; }
                  to   { --angle: 360deg; }
                }

                .animated-border-button {
                  position: relative;
                  padding: 3px;
                  border-radius: 1rem;
                  opacity: 0;
                  animation: fadeInUp 0.6s ease-out forwards;
                  isolation: isolate;
                }

                .animated-border-button::before,
                .animated-border-button::after {
                  content: "";
                  position: absolute;
                  inset: 0;
                  padding: 3px;
                  border-radius: 1rem;
                  background-image: conic-gradient(from var(--angle), #ff4545, #00ff99, #006aff, #ff0095, #ff4545);
                  animation: spin 2.5s linear infinite;
                  z-index: -1;
                }

                .animated-border-button::before {
                  filter: blur(1.5rem);
                  opacity: 0.5;
                }

                .button-content {
                  position: relative;
                  z-index: 1;
                  background: #000; 
                  height: 100%;
                  padding: 1rem 1rem;
                  display: flex;
                  border-radius: 1rem;
                  align-items: center;
                  justify-content: space-between;
                  gap: 1rem;
                }
                .loader{
                  width: 1em;
                  height: 1em;
                  margin-right: 0.5em;
                  border-radius: 50%;
                  border-width: 0.2em;
                  border-style: solid;
                  border-color: transparent rgba(255, 255, 255, 0.3);
                  animation-name: loader-animation;
                  animation-duration: 1s;
                  animation-timing-function: cubic-bezier(.4,.0,.6,1);
                  animation-fill-mode: both;
                }
              `}</style>

            <div className="button-content">
              {aiFixComplete ? (
                <>
                  <div className="flex items-center justify-center w-5 h-5 rounded-full animate-bounce">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-green-500 font-medium">
                    Error Fixed! Check editor & run again
                  </span>
                </>
              ) : isAIruning ? (
                <>
                 
                  <div className="flex items-center justify-center w-7 h-7">
                    <Loader className="w-7 h-7 text-blue-100 loader-spin" />
                  </div>
                  <span className="text-blue-300 font-medium">
                    Fixing the error<span className=" animate-pulse">.....</span>
                  </span>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center w-5 h-5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-200 group-hover:text-pink-100" />
                  </div>
                  <span className="text-pink-50 font-medium group-hover:text-white transition-colors">
                    Fix Error with AI
                  </span>
                  <Zap className="w-3.5 h-3.5 text-pink-200 group-hover:text-pink-100 opacity-70 group-hover:opacity-100 transition-all" />
                </>
              )}
            </div>
          </Button>
        )}


        {hasContent && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-300 bg-[#1e1e2e] 
            rounded-lg ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all"
          >
            {isCopied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Output Area */}
      <div className="relative">
        <div
          className="relative bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] 
        rounded-xl p-4 h-[600px] overflow-auto font-mono text-sm"
        >
          <SignedIn>
            {isRunning ? (
              <RunningCodeSkeleton />
            ) : error ? (
              <div className="flex items-start gap-3 text-red-400">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="font-medium">Execution Error</div>
                  <pre className="whitespace-pre-wrap text-red-400/80">{error}</pre>
                </div>
              </div>
            ) : output ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 mb-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Execution Successful</span>
                </div>
                <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-center">Run your code to see the output here...</p>
              </div>
            )}
          </SignedIn>
          <SignedOut>
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p className="text-center mb-5 ">Sign in to Run your code and see the output here...</p>
              <LoginButton />
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
    <div className="fixed bottom-0.5  right-[32%] z-50 ">
      <RateLimitModal
        isOpen={showRateLimitModal} 
        onClose={() => setShowRateLimitModal(false)}
        resetTime={getResetTime()}
        currentCount={getCurrentCount()}
        maxLimit={maxDailyLimit}
      />
    </div>
  </>
  ); 
}

export default OutputPanel;