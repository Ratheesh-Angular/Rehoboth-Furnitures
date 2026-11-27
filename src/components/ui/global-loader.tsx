"use client";

import { useEffect, useState } from "react";
import { loadingService } from "@/lib/api/loading";
import { Loader } from "./loader";

export function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = loadingService.subscribe(setIsLoading);
    return () => {
      unsubscribe();
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-2xl flex flex-col items-center gap-4">
        <Loader size="lg" />
        <p className="text-gray-700 font-medium">Loading...</p>
      </div>
    </div>
  );
}
