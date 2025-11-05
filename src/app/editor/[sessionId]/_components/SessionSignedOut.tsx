"use client";

import LoginButton from "@/components/LoginButton";
import { Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SessionSignedOut() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 left-16 p-6">
        <Link href="/" className="flex items-center gap-3 group relative">
          <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1 ring-white/10">
            <Image
              src="/logo.png"
              alt="CodeNexta Logo"
              width={40}
              height={40}
              className="transform -rotate-45"
            />
          </div>
          <span className="block text-2xl font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
            CodeNexta
          </span>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center relative max-w-md w-full text-center bg-[#12121a]/90 backdrop-blur rounded-2xl border border-white/[0.05] p-10 shadow-lg hover:shadow-2xl shadow-blue-400/30 hover:shadow-blue-300/30 transition-all duration-300">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
          <Lock className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-red-300 mb-3">Access Denied</h1>
        <p className="text-gray-400 mb-8 text-lg">
          This is a private collaboration session. Please sign in to join.
        </p>
        <LoginButton />
        <p className="text-sm text-gray-500 mt-6">
          After signing in, you will be redirected back to this session.
        </p>
      </div>
    </div>
  );
}