import { useStreamingAvatarContext } from "./context";
import { useState } from "react";

export const useMessageHistory = () => {
  const { messages } = useStreamingAvatarContext();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadTranscript = async () => {
    if (isDownloading) return;
    
    try {
      setIsDownloading(true);
      const transcript = messages
        .map((message) => {
          const speaker = message.sender === "AVATAR" ? "Avatar" : "You";
          return `${speaker}: ${message.content}\n`;
        })
        .join("\n");

      const blob = new Blob([transcript], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chat-transcript-${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading transcript:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return { messages, downloadTranscript, isDownloading };
};
