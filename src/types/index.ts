import { editor } from "monaco-editor";
import { Id } from "../../convex/_generated/dataModel";

export interface Theme {
  id: string;
  label: string;
  color: string;
}

export interface Language {
  id: string;
  label: string;
  logoPath: string;
  monacoLanguage: string;
  defaultCode: string;
  pistonRuntime: LanguageRuntime;
}

export interface LanguageRuntime {
  language: string;
  version: string;
}

export interface ExecuteCodeResponse {
  compile?: {
    output: string;
  };
  run?: {
    output: string;
    stderr: string;
  };
}

export interface ExecutionResult {
  code: string;
  output: string;
  error: string | null;
}

export interface CodeEditorState {
  language: string;
  output: string;
  isRunning: boolean;
  error: string | null;
  theme: string;
  fontSize: number;
  editor: editor.IStandaloneCodeEditor | null;
  executionResult: ExecutionResult | null;

  setEditor: (editor: editor.IStandaloneCodeEditor) => void;
  getCode: () => string;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (fontSize: number) => void;
  runCode: () => Promise<void>;
}

export interface Snippet {
  _id: Id<"snippets">;
  _creationTime: number;
  userId: string;
  language: string;
  code: string;
  title: string;
  userName: string;
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  codeBlocks?: CodeBlock[];
}

export interface CodeBlock {
  language: string;
  code: string;
  id: string;
}


export interface GeminiRateLimitData {
  count: number;
  resetTime: number;
}

export interface GeminiState {
  dailyUsage: number;
  resetTime: number;
  maxDailyLimit: number;
  
  // Actions
  canMakeRequest: () => boolean;
  incrementUsage: () => void;
  getRemainingRequests: () => number;
  getResetTime: () => number;
  getCurrentCount: () => number;
  initializeFromStorage: () => void;
}

export interface RateLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  resetTime: number;
  currentCount: number;
  maxLimit: number;
}