"use client";

import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import SessionHeader from "./SessionHeader";
import SessionEditorPanel from "./SessionEditorPanel";
import OutputPanel from "../../_components/OutputPanel";
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs"; 
import { EditorPanelSkeleton, OutputPanelSkeleton } from "../../_components/EditorPanelSkeleton";
import SessionSignedOut from "./SessionSignedOut";
import useMounted from "@/hooks/useMounted";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ArrowLeftRight } from "lucide-react";
import { PanelResizeHandle } from "react-resizable-panels";

// This component now *only* runs for signed-in users
function LiveSession({ sessionId }: { sessionId: Id<"sessions"> }) {
  const join = useMutation(api.sessions.joinSession);
  const leave = useMutation(api.sessions.leaveSession);
  
  const [direction, setDirection] = useState<"horizontal" | "vertical">(
    "horizontal"
  );
  const mounted = useMounted();

  useEffect(() => {
    if (mounted) {
      const checkWidth = () => {
        setDirection(window.innerWidth < 1024 ? "vertical" : "horizontal");
      };
      checkWidth();
      window.addEventListener("resize", checkWidth);
      return () => window.removeEventListener("resize", checkWidth);
    }
  }, [mounted]);


  useEffect(() => {
    // Join the session when the component mounts
    join({ sessionId });

    // Leave the session when the component unmounts (e.g., tab close)
    return () => {
      leave({ sessionId });
    };
  }, [sessionId, join, leave]);
 
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="max-w-[1800px] mx-auto p-4">
          <SessionHeader sessionId={sessionId} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditorPanelSkeleton />
            <OutputPanelSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        <SessionHeader sessionId={sessionId} />

        <ResizablePanelGroup
          direction={direction}
          className="rounded-lg border border-gray-800/50 min-h-[600px] bg-[#0a0a0f]/80 backdrop-blur-xl overflow-hidden"
        >
          <ResizablePanel defaultSize={66}>
            <SessionEditorPanel sessionId={sessionId} />
          </ResizablePanel>
          
           <PanelResizeHandle 
           className="flex w-6  rounded-full items-center justify-center bg-gray-800/50 data-[resize-handle-active]:bg-gray-800 transition-colors
                       data-[orientation=vertical]:h-2 data-[orientation=vertical]:w-full" >
                <ArrowLeftRight className="h-8  text-gray-100 data-[orientation=vertical]:rotate-90" />
          </PanelResizeHandle>
          
          
          <ResizablePanel defaultSize={34}>
            <OutputPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}


export default function SessionUI({ sessionId }: { sessionId: Id<"sessions"> }) {
  const { isLoaded } = useUser();

  if (!isLoaded) {
  
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="max-w-[1800px] mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditorPanelSkeleton />
            <OutputPanelSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <LiveSession sessionId={sessionId} />
      </SignedIn>
      <SignedOut>
        <SessionSignedOut />
      </SignedOut>
    </>
  );
}