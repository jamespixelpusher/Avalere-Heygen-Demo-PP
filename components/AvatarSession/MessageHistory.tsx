import React, { useEffect, useRef } from "react";
import { useMessageHistory, MessageSender } from "../logic";
import { Button } from "../Button";
import { LoadingIcon } from "../Icons";

export const MessageHistory: React.FC = () => {
  const { messages, downloadTranscript, isDownloading } = useMessageHistory();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || messages.length === 0) return;

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="w-[600px] overflow-y-auto flex flex-col gap-2 px-2 py-2 text-white self-center max-h-[150px]"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-1 max-w-[350px] ${
              message.sender === MessageSender.CLIENT
                ? "self-end items-end"
                : "self-start items-start"
            }`}
          >
            <p className="text-xs text-zinc-400">
              {message.sender === MessageSender.AVATAR ? "Avatar" : "You"}
            </p>
            <p className="text-sm">{message.content}</p>
          </div>
        ))}
      </div>
      {messages.length > 0 && (
        <Button
          onClick={downloadTranscript}
          className="!bg-zinc-700 !text-white"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <LoadingIcon className="animate-spin mr-2" size={16} />
              Downloading...
            </>
          ) : (
            "Download Transcript"
          )}
        </Button>
      )}
    </div>
  );
};
