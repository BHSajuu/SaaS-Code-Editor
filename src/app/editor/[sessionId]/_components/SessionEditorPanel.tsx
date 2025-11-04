"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useState, useRef } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../../_constants";
import { Editor, OnChange } from "@monaco-editor/react";
import Image from "next/image";
import { EditorPanelSkeleton } from "../../_components/EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { editor as MonacoEditor } from "monaco-editor";

export default function SessionEditorPanel({ sessionId }: { sessionId: Id<"sessions"> }) {
  const { theme, fontSize, setFontSize, setEditor } = useCodeEditorStore();
  const session = useQuery(api.sessions.get, { sessionId });
  const updateCode = useMutation(api.sessions.updateCode);
  const mounted = useMounted();
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);


  const [localCode, setLocalCode] = useState(session?.code || "");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const language = session?.language || "javascript";
  const sessionCode = session?.code;


  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  // Set initial code value when session data loads
  const handleEditorDidMount = (editor: MonacoEditor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    setEditor(editor);
    if (sessionCode) {
      editor.setValue(sessionCode);
      setLocalCode(sessionCode);
    }
  };


  useEffect(() => {
    if (session) {
      useCodeEditorStore.getState().setLanguage(session.language);
    }
  }, [session]);

  // --- REAL-TIME SYNC LOGIC ---

  // 1. Listen for local editor changes and send them to Convex (debounced)
  const handleEditorChange: OnChange = (value) => {
    const newCode = value || "";
    setLocalCode(newCode); 

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      updateCode({ sessionId, code: newCode });
    }, 300); 
  };

  // 2. Listen for remote code changes from Convex and update the editor
  useEffect(() => {
    if (sessionCode !== undefined && editorRef.current) {
      // Only update if the remote code is different from our local code
      // This prevents our own debounced changes from overwriting our typing
      if (sessionCode !== localCode) {
        // We preserve the cursor position/selection when updating
        const selection = editorRef.current.getSelection();
        editorRef.current.setValue(sessionCode);
        if (selection) {
          editorRef.current.setSelection(selection);
        }
        setLocalCode(sessionCode); 
      }
    }
  }, [sessionCode]); 

  // ------------------------------

  if (!mounted || !session) return <EditorPanelSkeleton />;

  return (
    <div className="relative">
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
       
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image src={"/" + language + ".png"} alt="Logo" width={24} height={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">Live Code Editor</h2>
              <p className="text-xs text-gray-500">You are in a live session</p>
            </div>
          </div>
        </div>

       
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          <Editor
            height="600px"
            language={LANGUAGE_CONFIG[language].monacoLanguage}
            value={localCode} 
            theme={theme}
            beforeMount={defineMonacoThemes}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange} 
            options={{
              minimap: { enabled: false },
              fontSize,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },

            }}
          />
        </div>
      </div>
    </div>
  );
}