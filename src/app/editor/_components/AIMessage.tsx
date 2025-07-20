"use client";

import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import { Message } from '@/types';
import { Check, Code, Copy, Plus } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Define a custom GitHub dark theme
const githubDarkTheme = {
  ...oneDark,
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    color: '#c9d1d9',
    background: '#0d1117',
  },
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    color: '#c9d1d9',
    background: '#0d1117',
  },
};


 const AIMessage = ({message}: {message: Message}) => {
  let content = message.content;
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const {editor} = useCodeEditorStore();
  
  // Check if this is the initial welcome message
  const isInitialMessage = message.id === '1' && message.content.includes("Hello! I'm your AI coding assistant");
 

    // Insert code directly into the editor
   const handleInsertCode = (code: string) => {
      if (editor) {
        editor.setValue(code);
        toast.success('Code inserted into editor!');
        setIsOpen(false); // Close dialog after insertion
      } else {
        toast.error('Editor not available');
      }
    };
  
     // Copy code to clipboard
  const handleCopyCode = async (code: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeId(codeId);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };



  // Replace code block placeholders with actual code blocks
  message.codeBlocks?.forEach(block => {
    content = content.replace(`[CODE_BLOCK_${block.id}]`, '');
  });

  return (
    <div className="space-y-5">
      {/* Render content based on message type */}
      {content.trim() && (
        isInitialMessage ? (
          // For initial message, render full content with proper formatting
          <div className="text-gray-300 leading-relaxed space-y-3">
            {content.split('\n\n').map((paragraph, index) => {
              if (paragraph.includes('•')) {
                // This is the bullet points section
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 ml-4">
                    {paragraph.split('\n').map((line, lineIndex) => {
                      const trimmed = line.trim();
                      if (trimmed.startsWith('•')) {
                        return (
                          <li key={lineIndex} className="ml-4">{trimmed.substring(1).trim()}</li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                );
              } else {
                // Regular paragraph content
                return (
                  <p key={index} className="text-gray-300">
                    {paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-400 font-semibold">$1</strong>').split('<strong').map((part, i) => {
                      if (i === 0) return part;
                      const [strongPart, ...rest] = part.split('</strong>');
                      return (
                        <span key={i}>
                          <strong className="text-blue-400 font-semibold">{strongPart.replace(' class="text-blue-400 font-semibold">', '')}</strong>
                          {rest.join('</strong>')}
                        </span>
                      );
                    })}
                  </p>
                );
              }
            })}
          </div>
        ) : (
          // For AI responses, render only bullet points
          <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2">
            {content.split('\n').map((line, index) => {
              const trimmed = line.trim();
              if (trimmed.startsWith('•')) {
                return (
                  <li key={index} className="ml-4">{trimmed.substring(1).trim()}</li>
                );
              }
              return null; // Ignore non-bullet lines
            })}
          </ul>
        )
      )}

      {/* Render code blocks */}
      {message.codeBlocks?.map(block => (
        <div key={block.id} className="relative group mt-3">
          <div className="bg-[#0d1117] rounded-lg border border-gray-800/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-gray-800/50">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">{block.language}</span>
              </div>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => handleCopyCode(block.code, block.id)}
                  className="p-1.5 hover:bg-gray-800 rounded transition-colors hover:scale-105"
                  title="Copy code"
                >
                  {copiedCodeId === block.id ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => handleInsertCode(block.code)}
                  className="flex rounded-xl items-center gap-1 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400  text-xs transition-all hover:scale-105"
                  title="Insert into editor"
                >
                  <Plus className="w-3 h-3" />
                  Insert
                </button>
              </div>
            </div>
            <SyntaxHighlighter
              language={block.language.toLowerCase()}
              style={githubDarkTheme}
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: 'transparent',
                fontSize: '14px',
                lineHeight: '1.5',
              }}
              showLineNumbers={true}
              wrapLines={true}
            >
              {block.code}
            </SyntaxHighlighter>
          </div>
        </div>
      ))}
    </div>
  );
};


export default AIMessage;