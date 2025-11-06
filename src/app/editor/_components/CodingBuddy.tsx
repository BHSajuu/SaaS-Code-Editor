"use client";

import { Button } from '@/components/ui/button';
import { Brain, X, Send, Loader, CircleX, Sparkles } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { CodeBlock, Message } from '@/types';
import AIMessage from './AIMessage';
import RateLimitModal from '@/components/RateLimitModal';
import { useGeminiStore } from '@/store/useGeminiStore';
import Link from 'next/link';
import { useModalStore } from '@/store/useModalStore';


const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

function CodingBuddy({hasAccess}:{hasAccess : boolean}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  
  // Refs for auto-scrolling and input focus
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { language } = useCodeEditorStore();
    const { 
    canMakeRequest, 
    incrementUsage, 
    getResetTime, 
    getCurrentCount, 
    maxDailyLimit,
  } = useGeminiStore();
  
  const { openTrialEnded } = useModalStore();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
 

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        content: `Hello! I'm your AI coding assistant. I can help you with:\n\n• Code explanations and debugging\n• Algorithm implementations\n• Best practices and optimization\n• Language-specific questions\n• Code reviews and suggestions\n\nCurrently, you're working with **${language.toUpperCase()}**. How can I assist you today?`,
        isUser: false,
        timestamp: new Date(),
      }]);
    }
  }, [language]);

  // Extract code blocks from AI response using regex
  const extractCodeBlocks = (text: string): { cleanText: string; codeBlocks: CodeBlock[] } => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const codeBlocks: CodeBlock[] = [];
    let match;
    let cleanText = text;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const [fullMatch, lang, code] = match;
      const blockId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      codeBlocks.push({
        language: lang || language,
        code: code.trim(),
        id: blockId,
      });

      // Replace code block with placeholder in clean text
      cleanText = cleanText.replace(fullMatch, `\n\n[CODE_BLOCK_${blockId}]\n\n`);
    }

    return { cleanText, codeBlocks };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    if (!hasAccess) {
      openTrialEnded();
      return;
    }

    // Check rate limit before making request
    if (!canMakeRequest()) {
      setShowRateLimitModal(true);
      return;
    }


    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
        incrementUsage();
      
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-001",
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 2048,
        },
      });

      // Create context-aware prompt
      const prompt = `You are an expert coding assistant. The user is currently working with ${language.toUpperCase()}.

      User question: ${inputMessage}

      Respond with the following strict format:
      - Start with bullet points explaining the concept clearly (no headings, no paragraphs, no numbered lists).
      - Then provide a single complete code block with proper syntax highlighting.
      - Include comments in the code when helpful.
      - Include a printing statement to show output where applicable.
      - Do NOT include any heading or title in the response.
      - Do NOT split the code into multiple blocks.
      - Do NOT include any paragraph or numbered explanation.

      Only use:
      • for bullet points  
      \`\`\`${language} for code block syntax

      Keep it concise, helpful, and easy to read.
      `;


      // Get AI response
      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      // Extract code blocks from response
      const { cleanText, codeBlocks } = extractCodeBlocks(aiResponse);

      // Create AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: cleanText,
        isUser: false,
        timestamp: new Date(),
        codeBlocks,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try asking your question again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([{
      id: '1',
      content: `Hello! I'm your AI coding assistant. I can help you with:\n\n• Code explanations and debugging\n• Algorithm implementations\n• Best practices and optimization\n• Language-specific questions\n• Code reviews and suggestions\n\nCurrently, you're working with **${language.toUpperCase()}**. How can I assist you today?`,
      isUser: false,
      timestamp: new Date(),
    }]);
    toast.success('Chat cleared');
  };


  return (
    <>
      <Button
        className="animated-brdr-button"
        onClick={() => {
          if (!hasAccess) { 
            openTrialEnded();
            return;
          }
          setIsOpen(true);
        }}
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

          .animated-brdr-button {
            position: relative;
            padding: 3px;
            border-radius: 1rem;
            opacity: 0;
            animation: fadeInUp 0.6s ease-out forwards;
            isolation: isolate;
          }

          .animated-brdr-button:hover::before,
          .animated-brdr-button:hover::after {
            content: "";
            position: absolute;
            inset: 0;
            padding: 3px;
            border-radius: 1rem;
            background-image: conic-gradient(from var(--angle), #ff4545, #00ff99, #006aff, #ff0095, #ff4545);
            animation: spin 2.5s linear infinite;
            z-index: -1;
          }

          .animated-brdr-button:hover::before {
            filter: blur(1.5rem);
            opacity: 0.5;
          }

          .button-content {
            position: relative;
            z-index: 1;
            background: #000; 
            border-color: #555879;
            height: 100%;
            padding: 1rem 1rem;
            display: flex;
            border-radius: 1rem;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
          }
        `}</style>
        <div className="button-content">
          <Brain className="w-5 h-5 text-sky-400" />
          <span className="text-white font-medium">Coding Buddy</span>
        </div>
      </Button>

      {/* AI Chat Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-96 fixed inset-0  z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1e1e2e] rounded-2xl border border-gray-800/50 w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Dialog Header */}
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-800/50 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                    <Brain className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">AI Coding Assistant</h2>
                    <p className="text-sm text-gray-400">
                      Currently working with <span className="text-blue-400 font-medium">{language.toUpperCase()}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Clear chat button */}
                  <button
                    onClick={handleClearChat}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-300"
                    title="Clear chat"
                  >
                    <CircleX className="w-5 h-5" />
                  </button>
                  
                  {/* Close button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.isUser
                          ? 'bg-blue-500/10 border border-blue-500/20 text-blue-100'
                          : 'bg-gray-800/50 border border-gray-700/50 text-gray-100'
                      }`}
                    >
                      {message.isUser ? (
                        <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                          {message.content}
                        </div>
                      ) : (
                        <AIMessage message={message} />
                      )}
                      <div className="mt-3 text-xs text-gray-500 border-t border-gray-700/30 pt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 max-w-[80%]">
                      <div className="flex items-center gap-3 text-gray-400">
                        {/* Enhanced thinking animation */}
                        <div className="relative loader-spin">
                          <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 w-8 h-8 border-2 border-purple-400/20 border-b-purple-400 rounded-full animate-spin animation-delay-150"></div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-blue-300 font-medium">AI is thinking</span>
                          <div className="flex gap-1">
                            <span className="animate-bounce animation-delay-0">.</span>
                            <span className="animate-bounce animation-delay-150">.</span>
                            <span className="animate-bounce animation-delay-300">.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-gray-800/50 bg-gray-900/20">
                {hasAccess? (
                  <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Ask me anything about ${language} or coding in general...`}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      rows={3}
                      disabled={isLoading}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      Press Enter to send, Shift+Enter for new line
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="relative bottom-8 border-2 hover:border-lime-300 p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl transition-colors"
                  >
                    {isLoading ? (
                      <Loader className="w-5 h-5 text-white loader-spin" />
                    ) : (
                      <Send className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
                ):(
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">
                      Upgrade to Pro to use the AI Coding Assistant.
                    </p>
                    <Link href="/pricing">
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all py-3 px-6 text-base font-semibold shadow-lg">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Upgrade Now
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
       <div className='fixed z-50 top-[80%] left-[32%]'>
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

export default CodingBuddy;