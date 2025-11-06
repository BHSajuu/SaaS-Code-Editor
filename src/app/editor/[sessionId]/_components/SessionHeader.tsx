"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, Share2 } from "lucide-react";
import { SignedIn, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";

import ThemeSelector from "../../_components/ThemeSelector";
import RunButton from "../../_components/RunButton";
import CodingBuddy from "../../_components/CodingBuddy";
import ActiveUsers from "./ActiveUsers";
import { useState } from "react";
import ShareSessionModal from "./ShareSessionModal";

export default function SessionHeader({ sessionId }: { sessionId: Id<"sessions"> }) {
  const session = useQuery(api.sessions.get, { sessionId });
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);

  const handleLeaveSession = () => {
    router.push("/editor");
  };
const { user } = useUser();
  const convexUser = useQuery(api.users.getUser, {
    userId: user?.id || "", 
  });
  
  const trialEndsAt = convexUser?.trialEndsAt ?? 0;
  const isPro = convexUser?.isPro ?? false;
  const isInTrial = trialEndsAt > Date.now();
  const hasAccess = isPro || isInTrial;
  return (
    <>
      <div className="relative z-10">
        <div className="flex items-center lg:justify-between justify-center bg-[#0a0a0f]/80 backdrop-blur-xl p-6 mb-4 rounded-lg">
          <div className="hidden lg:flex items-center gap-20">
            <Link href="/" className="flex items-center gap-3 group relative">
              <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                <Image
                  src="/logo.png"
                  alt="CodeNexta Logo"
                  width={40}
                  height={40}
                  className=" text-blue-400 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col">
                <span className="block text-2xl font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                  CodeNexta
                </span>
                <span className="block text-xs text-blue-400/60 font-medium">
                  Live Session
                </span>
              </div>
            </Link>
            <nav className="flex items-center space-x-10">
              <CodingBuddy  hasAccess={hasAccess}/>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <ThemeSelector />
            </div>


            <SignedIn>

              <button
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
                title="Share Session"
              >
                <Share2 className="size-4 text-white" />
                <span className="text-sm font-medium text-white">Share</span>
              </button>

              <button
                onClick={handleLeaveSession}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r from-red-500 to-red-600 opacity-90 hover:opacity-100 transition-opacity"
                title="Leave Live Session"
              >
                <LogOut className="size-4 text-white" />
                <span className="text-sm font-medium text-white">Leave</span>
              </button>
              <RunButton />
            </SignedIn>

            <ActiveUsers activeUsers={session?.activeUsers || []} />

          </div>
        </div>
      </div>
      {showShareModal && (
        <ShareSessionModal
          sessionId={sessionId}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
}