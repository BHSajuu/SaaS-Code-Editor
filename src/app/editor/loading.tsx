import { EditorPanelSkeleton, OutputPanelSkeleton } from "./_components/EditorPanelSkeleton";

function HeaderSkeleton() {
  return (
    <div className="flex items-center lg:justify-between justify-center bg-[#0a0a0f]/80 backdrop-blur-xl p-6 mb-4 rounded-lg">
      <div className="hidden lg:flex items-center gap-8">
        {/* Logo Skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-[56px] h-[56px] bg-gray-800/80 rounded-xl animate-pulse" />
          <div className="space-y-1">
            <div className="w-24 h-5 bg-gray-800/80 rounded animate-pulse" />
            <div className="w-32 h-3 bg-gray-800/80 rounded animate-pulse" />
          </div>
        </div>
        {/* Nav Skeleton */}
        <div className="flex items-center space-x-10">
          <div className="w-28 h-8 bg-gray-800/80 rounded-lg animate-pulse" />
          <div className="w-32 h-8 bg-gray-800/80 rounded-lg animate-pulse" />
        </div>
      </div>
      
      {/* Right Side Skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-48 h-10 bg-gray-800/80 rounded-lg animate-pulse" />
        <div className="w-48 h-10 bg-gray-800/80 rounded-lg animate-pulse" />
        <div className="w-24 h-10 bg-gray-800/80 rounded-lg animate-pulse" />
        <div className="w-10 h-10 bg-gray-800/80 rounded-full animate-pulse" />
      </div>
    </div>
  );
}


export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        {/* 1. Show the Header skeleton */}
        <HeaderSkeleton />
        
        {/* 2. Show the Panel skeletons you already built */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditorPanelSkeleton />
          <OutputPanelSkeleton />
        </div>
      </div>
    </div>
  );
}