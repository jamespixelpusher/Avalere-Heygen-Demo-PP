import React, { forwardRef } from "react";
import { ConnectionQuality } from "@heygen/streaming-avatar";

// Connection quality overlay removed per requirement
import { useStreamingAvatarSession } from "../logic/useStreamingAvatarSession";
import { StreamingAvatarSessionState } from "../logic";
import { CloseIcon } from "../Icons";
import { Button } from "../Button";

type AvatarVideoProps = {
  muted?: boolean;
  onClose?: () => void;
};

export const AvatarVideo = forwardRef<HTMLVideoElement, AvatarVideoProps>(({ muted = false, onClose }, ref) => {
  const { sessionState, stopAvatar } = useStreamingAvatarSession();

  const isLoaded = sessionState === StreamingAvatarSessionState.CONNECTED;

  return (
    <>
      {/* Connection Quality overlay removed */}
      {isLoaded && (
        <Button
          className="absolute top-3 right-3 !p-2 bg-zinc-700 bg-opacity-50 z-10"
          onClick={() => {
            stopAvatar();
            onClose?.();
          }}
        >
          <CloseIcon />
        </Button>
      )}
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={muted}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      >
        <track kind="captions" />
      </video>
      {!isLoaded && (
        <div className="w-full h-full flex items-center justify-center absolute top-0 left-0">
          Loading...
        </div>
      )}
    </>
  );
});
AvatarVideo.displayName = "AvatarVideo";
