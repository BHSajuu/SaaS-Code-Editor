"use client";

import useMounted from "@/hooks/useMounted";
import EditorPanel from "./_components/EditorPanel";
import Header from "./_components/Header";
import OutputPanel from "./_components/OutputPanel";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ArrowLeftRight } from "lucide-react";
import { PanelResizeHandle } from "react-resizable-panels";

export default function Home() {
  
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

  if (!mounted) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        <Header />

        <ResizablePanelGroup
          direction={direction}
          className="rounded-lg border border-gray-800/50 min-h-[600px] bg-[#0a0a0f]/80 backdrop-blur-xl overflow-hidden"
        >
          <ResizablePanel defaultSize={66}>
            <EditorPanel />
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