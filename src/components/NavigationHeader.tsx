
import HeaderProfileBtn from "@/app/editor/_components/HeaderProfileBtn";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {Blocks, Code2, Sparkles, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function NavigationHeader() {
  return (
    <div className="sticky ml-16 lg:ml-50 top-5 z-50 py-3 border-t-2 border-blue-300/30 rounded-full w-[85%] lg:w-[75%] bg-gray-950/50 backdrop-blur-sm  shadow-lg hover:shadow-2xl shadow-blue-400/30 hover:shadow-blue-300/30 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="relative h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group relative">
              {/* logo hover effect */}
              <div
                className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
              group-hover:opacity-100 transition-all duration-500 blur-xl"
              />

              {/* Logo */}
              <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                <Image
                  src="/logo.png"
                  alt="CodeNexta Logo"
                  width={40}
                  height={40}
                  className=" text-blue-400 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500"
                />
              </div>

              <div className="relative">
                <span
                  className="block text-2xl font-semibold bg-gradient-to-r
                 from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text"
                >
                  CodeNexta
                </span>
                <span className="block text-xs text-blue-400/60 font-medium">
                  Interactive Code Editor
                </span>
              </div>
            </Link>
          </div>

          {/* right rection */}
          <div className="flex items-center gap-8">
             {/* snippets Link */}
            <Link
              href="/snippets"
              className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 hover:bg-blue-500/10 
              border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 
              to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
              <span className="text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                Snippets
              </span>
            </Link>
            
              {/* editor Link */}
            <Link
              href="/editor"
              className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 hover:bg-blue-500/10 
              border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 
              to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Blocks className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
              <span className="text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                Editor
              </span>
            </Link>
             
               {/* profile Link */}
           <SignedIn>
             <Link
              href="/profile"
              className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 hover:bg-blue-500/10 
              border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 
              to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <User className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
              <span className="text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                Profile
              </span>
            </Link>
           </SignedIn>

            <SignedOut>
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20
                 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 
                to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 transition-all 
                duration-300"
              >
                <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
                <span className="text-sm font-medium text-amber-400/90 hover:text-amber-300">
                  Pro
                </span>
              </Link>
            </SignedOut>

            {/* profile button */}
            <HeaderProfileBtn />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationHeader;