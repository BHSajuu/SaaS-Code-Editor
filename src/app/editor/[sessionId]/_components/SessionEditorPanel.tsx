"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useState, useRef } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../../_constants";
import { OnChange, type Monaco } from "@monaco-editor/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { EditorPanelSkeleton } from "../../_components/EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { editor as MonacoEditor } from "monaco-editor";
import { useUser } from "@clerk/nextjs";
import { ShareIcon, TypeIcon } from "lucide-react";
import { motion } from "framer-motion";
import ShareSnippetDialog from "../../_components/ShareSnippetDialog";


const DynamicEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => <EditorPanelSkeleton />,
  }
);

export default function SessionEditorPanel({ sessionId }: { sessionId: Id<"sessions"> }) {
  const { theme, fontSize, setFontSize, setEditor } = useCodeEditorStore();
  const session = useQuery(api.sessions.get, { sessionId });
  const updateCode = useMutation(api.sessions.updateCode);
  const mounted = useMounted();
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  const { user } = useUser();
  const updateActivity = useMutation(api.sessions.updateUserActivity);
  const remoteDecorationsRef = useRef<string[]>([]);
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const codeUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const monacoRef = useRef<Monaco | null>(null);
  const [localCode, setLocalCode] = useState(session?.code || "");
  

  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const language = session?.language || "javascript";
  const sessionCode = session?.code;

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  const handleEditorDidMount = (
    editor: MonacoEditor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
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

  useEffect(() => {
    if (!session || !user || !editorRef.current) return;
    
    const isOwner = session.ownerId === user.id;
    const isPublic = session.isPublic;

    const isAllowed = session.allowedUsers.includes(user.id);

    const readOnly = !isOwner && !isPublic && !isAllowed;

    setIsReadOnly(readOnly);
    editorRef.current.updateOptions({ readOnly: readOnly });

  }, [session, user, editorRef.current]);

  const handleEditorChange: OnChange = (value) => {
    if (isReadOnly) {
      editorRef.current?.setValue(sessionCode || "");
      return;
    }

    const newCode = value || "";
    setLocalCode(newCode); 

    if (codeUpdateTimerRef.current) {
      clearTimeout(codeUpdateTimerRef.current);
    }

    codeUpdateTimerRef.current = setTimeout(() => {
      updateCode({ sessionId, code: newCode });
    }, 300);
  };

  useEffect(() => {
    if (sessionCode !== undefined && editorRef.current) {
      const currentEditorCode = editorRef.current.getValue();
      if (sessionCode !== currentEditorCode) {
        const selection = editorRef.current.getSelection();
        editorRef.current.setValue(sessionCode);
        if (selection) {
          editorRef.current.setSelection(selection);
        }
        setLocalCode(sessionCode);
      }
    }
  }, [sessionCode]); 

  useEffect(() => {
    if (!editorRef.current || !sessionId) return;

    const editor = editorRef.current;

    const handleActivity = () => {
      if (activityTimerRef.current) return;
      
   
      if (isReadOnly) return; 
      

      activityTimerRef.current = setTimeout(() => {
        const cursorPosition = editor.getPosition();
        const selectionRange = editor.getSelection();

        const cursor = cursorPosition ? {
          lineNumber: cursorPosition.lineNumber,
          column: cursorPosition.column,
        } : null;

        const selection = selectionRange ? {
          startLineNumber: selectionRange.startLineNumber,
          startColumn: selectionRange.startColumn,
          endLineNumber: selectionRange.endLineNumber,
          endColumn: selectionRange.endColumn,
        } : null;

        updateActivity({ sessionId, cursor, selection });
        
        activityTimerRef.current = null;
      }, 100);
    };

    const positionListener = editor.onDidChangeCursorPosition(handleActivity);
    const selectionListener = editor.onDidChangeCursorSelection(handleActivity);

    return () => {
      positionListener.dispose();
      selectionListener.dispose();
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
    };
  }, [editorRef.current, sessionId, updateActivity, isReadOnly]); 


  useEffect(() => {
    if (!editorRef.current || !session?.activeUsers || !user?.id || !monacoRef.current) {
      return;
    }

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const otherUsers = session.activeUsers.filter((u) => u.userId !== user.id);
    
    const newDecorations: MonacoEditor.IModelDeltaDecoration[] = [];

    otherUsers.forEach((u, index) => {
      const colorClass = `user-${index % 3}`;

    
      if (
        u.selection &&
        (u.selection.startLineNumber !== u.selection.endLineNumber ||
          u.selection.startColumn !== u.selection.endColumn)
      ) {
        newDecorations.push({
          range: new monaco.Range(
            u.selection.startLineNumber,
            u.selection.startColumn,
            u.selection.endLineNumber,
            u.selection.endColumn
          ),
          options: { className: `remote-selection-${colorClass}` },
        });
      }

  
      if (u.cursor) {
        newDecorations.push({
          range: new monaco.Range(
            u.cursor.lineNumber,
            u.cursor.column,
            u.cursor.lineNumber,
            u.cursor.column
          ),
          options: {
            className: `remote-cursor-${colorClass}`,
          },
        });
      }
    });

    remoteDecorationsRef.current = editor.deltaDecorations(
      remoteDecorationsRef.current,
      newDecorations
    );

  }, [session?.activeUsers, user?.id, monacoRef]);


  useEffect(() => {
    return () => {
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
      if (codeUpdateTimerRef.current) {
        clearTimeout(codeUpdateTimerRef.current);
      }
      if (editorRef.current) {
        editorRef.current.deltaDecorations(remoteDecorationsRef.current, []);
      }
    };
  }, []);

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };


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

          <div className="flex items-center gap-3">
            {/* Font Size Slider */}
            <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                  className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsShareDialogOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
            >
              <ShareIcon className="size-4 text-white" />
              <span className="text-sm font-medium text-white ">Share</span>
            </motion.button>
          </div>

        </div>

        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          <DynamicEditor
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
              readOnly: isReadOnly,
            }}
          />
        </div>
      </div>
       {isShareDialogOpen && <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />}
    </div>
  );
}