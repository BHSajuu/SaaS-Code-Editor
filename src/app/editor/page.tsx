"use client";

import EditorPanel from "./_components/EditorPanel";
import Header from "./_components/Header";
import OutputPanel from "./_components/OutputPanel";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        <Header />

        <div className=" grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
              <EditorPanel />
          </div>
          <div className="lg:col-span-1">
              <OutputPanel />
          </div>
        </div>
      </div>
    </div>
  );
}