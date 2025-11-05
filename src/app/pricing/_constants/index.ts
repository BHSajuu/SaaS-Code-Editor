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
    "Advanced AI",
    "Custom theme builder",
    "Integrated debugging tools",
    "Multi-language support",
  ],
  collaboration: [
    "Real-time pair programming",
    "Team workspaces",
    "Version control integration",
    "Code review tools",
  ],
  deployment: [
    "One-click deployment",
    "CI/CD integration",
    "Container support",
    "Custom domain mapping",
  ],
};