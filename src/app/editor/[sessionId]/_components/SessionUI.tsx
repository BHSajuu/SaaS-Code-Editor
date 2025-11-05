"use client";

import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import SessionHeader from "./SessionHeader";
import SessionEditorPanel from "./SessionEditorPanel";
import OutputPanel from "../../_components/OutputPanel";
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs"; 
import { EditorPanelSkeleton, OutputPanelSkeleton } from "../../_components/EditorPanelSkeleton";
import SessionSignedOut from "./SessionSignedOut";

// This component now *only* runs for signed-in users
function LiveSession({ sessionId }: { sessionId: Id<"sessions"> }) {
  const join = useMutation(api.sessions.joinSession);
  const leave = useMutation(api.sessions.leaveSession);

  useEffect(() => {
    // Join the session when the component mounts
    join({ sessionId });

    // Leave the session when the component unmounts (e.g., tab close)
    return () => {
      leave({ sessionId });
    };
  }, [sessionId, join, leave]);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        <SessionHeader sessionId={sessionId} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SessionEditorPanel sessionId={sessionId} />
          <OutputPanel />
        </div>
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