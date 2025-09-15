"use client";

import { useRouter } from "next/navigation";
import InteractiveAvatar from "@/components/InteractiveAvatar";
import { useEffect } from "react";

export default function ChatPage() {
  const router = useRouter();

  // Ensure we stop the avatar when leaving this page (safety)
  useEffect(() => {
    return () => {
      // InteractiveAvatar handles stopping on unmount inside its provider
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <div className="absolute bottom-4 right-4 z-10">
        <button
          className="px-4 py-2 rounded-md bg-white text-black border border-zinc-600"
          onClick={() => {
            router.push("/");
          }}
        >
          Close
        </button>
      </div>
      <div className="flex-1">
        <InteractiveAvatar />
      </div>
    </div>
  );
}


