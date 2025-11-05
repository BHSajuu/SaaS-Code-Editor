import { Boxes, Globe, Radio, RefreshCcw, Shield, Sparkles } from "lucide-react";

export const ENTERPRISE_FEATURES = [
  {
    icon: Radio,
    label: "Real-time Collaboration",
    desc: "Code together with shared sessions, live cursors, and synced editing.",
  },
  {
    icon: Sparkles,
    label: "AI-Powered",
    desc: "Get intelligent code suggestions and error detection powered by advanced AI.",
  },
  {
    icon: RefreshCcw,
    label: "Real-time Sync",
    desc: "Instant synchronization across all devices",
  },
  {
    icon: Boxes,
    label: "Unlimited Storage",
    desc: "Store unlimited snippets and projects",
  },
];

export const FEATURES = {
  development: [
    "AI-powered error fixing (Gemini API)",
    "AI Coding Buddy (Gemini API)",
    "10+ Language Support (JS, Python, Java, etc.)",
    "5 VSCode Themes (VS Dark, Monokai, etc.)",
    "Customizable Font Size",
    "Smart Output Handling (Success & Error states)",
  ],
  collaboration: [
    "Real-time pair programming (Live Sessions)",
    "Share session by link or email",
    "Public/Private session controls",
    "Live cursors and activity tracking",
  ],
  community: [
    "Community code snippet sharing",
    "Snippet starring system",
    "Advanced snippet search & filtering",
    "Snippet commenting/discussion",
    "Personal profile with execution history",
    "Comprehensive user statistics",
  ],
};