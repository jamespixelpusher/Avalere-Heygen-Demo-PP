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
      <button
        className="absolute z-10"
        style={{ bottom: "1%", right: "1%" }}
        onClick={() => {
          router.push("/");
        }}
        aria-label="Close"
      >
        <img src="/close_button.png" alt="Close" style={{ transform: "scale(0.5)", transformOrigin: "center" }} />
      </button>
      <div className="flex-1">
        <InteractiveAvatar />
      </div>
    </div>
  );
}


