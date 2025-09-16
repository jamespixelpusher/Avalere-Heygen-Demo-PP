import {
  AvatarQuality,
  StreamingEvents,
  VoiceChatTransport,
  VoiceEmotion,
  StartAvatarRequest,
  STTProvider,
  ElevenLabsModel,
} from "@heygen/streaming-avatar";
import { useEffect, useRef, useState } from "react";
import { useMemoizedFn, useUnmount } from "ahooks";

import { AvatarVideo } from "./AvatarSession/AvatarVideo";
import { useStreamingAvatarSession } from "./logic/useStreamingAvatarSession";
import { useVoiceChat } from "./logic/useVoiceChat";
import { StreamingAvatarProvider, StreamingAvatarSessionState } from "./logic";
import { LoadingIcon } from "./Icons";

const DEFAULT_CONFIG: StartAvatarRequest = {
  quality: AvatarQuality.High,
  avatarName: "Judy_Lawyer_Sitting2_public",
  knowledgeId: "bfca337642ba4468a592b3b1eda1487c",
  voice: {
    rate: 1.5,
    emotion: VoiceEmotion.EXCITED,
    model: ElevenLabsModel.eleven_flash_v2_5,
  },
  language: "en",
  voiceChatTransport: VoiceChatTransport.WEBSOCKET,
  sttSettings: {
    provider: STTProvider.DEEPGRAM,
  },
};

function InteractiveAvatar() {
  const { initAvatar, startAvatar, stopAvatar, sessionState, stream } =
    useStreamingAvatarSession();
  const { startVoiceChat } = useVoiceChat();

  const [config, setConfig] = useState<StartAvatarRequest>(DEFAULT_CONFIG);
  const [hasStarted, setHasStarted] = useState(false);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false);

  const mediaStream = useRef<HTMLVideoElement>(null);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();

      console.log("Access Token:", token); // Log the token to verify

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  }

  const startSessionV2 = useMemoizedFn(async (isVoiceChat: boolean) => {
    try {
      const newToken = await fetchAccessToken();
      const avatar = initAvatar(newToken);

      avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
        console.log("Avatar started talking", e);
      });
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
        console.log("Avatar stopped talking", e);
      });
      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected");
      });
      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        console.log(">>>>> Stream ready:", event.detail);
      });
      avatar.on(StreamingEvents.USER_START, (event) => {
        console.log(">>>>> User started talking:", event);
      });
      avatar.on(StreamingEvents.USER_STOP, (event) => {
        console.log(">>>>> User stopped talking:", event);
      });
      avatar.on(StreamingEvents.USER_END_MESSAGE, (event) => {
        console.log(">>>>> User end message:", event);
      });
      avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (event) => {
        console.log(">>>>> User talking message:", event);
      });
      avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event) => {
        console.log(">>>>> Avatar talking message:", event);
      });
      avatar.on(StreamingEvents.AVATAR_END_MESSAGE, (event) => {
        console.log(">>>>> Avatar end message:", event);
      });

      await startAvatar(config);

      if (isVoiceChat) {
        await startVoiceChat();
      }
      
      setHasStarted(true);
    } catch (error) {
      console.error("Error starting avatar session:", error);
    }
  });

  useUnmount(() => {
    stopAvatar();
  });

  // Auto-start voice chat when component mounts
  useEffect(() => {
    if (!hasStarted && sessionState === StreamingAvatarSessionState.INACTIVE) {
      startSessionV2(true);
    }
  }, [hasStarted, sessionState, startSessionV2]);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = async () => {
        // Hint the browser for sharper rendering when supported
        try {
          const currentStream = mediaStream.current!.srcObject as MediaStream | null;
          const videoTrack = currentStream?.getVideoTracks?.()[0];
          if (videoTrack && ("contentHint" in videoTrack)) {
            // @ts-expect-error: contentHint is not in all TS DOM lib versions
            videoTrack.contentHint = "detail";
          }
        } catch {
          // no-op
        }
        try {
          await mediaStream.current!.play();
          // If play succeeds, allow audio
          mediaStream.current!.muted = false;
          setNeedsUserInteraction(false);
        } catch (err) {
          console.warn("Autoplay blocked, waiting for user interaction to start playback.", err);
          // Fall back to muted autoplay until user interacts
          mediaStream.current!.muted = true;
          setNeedsUserInteraction(true);
          try {
            await mediaStream.current!.play();
          } catch {
            // ignore, overlay will handle user gesture
          }
        }
      };
    }
  }, [mediaStream, stream]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 bg-zinc-900 overflow-hidden">
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          <AvatarVideo
            ref={mediaStream}
            muted={needsUserInteraction}
            onClose={() => {
              // no-op here; page-level close handles navigation
            }}
          />
          {needsUserInteraction && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <button
                className="px-4 py-2 rounded-md bg-zinc-800 text-white border border-zinc-600"
                onClick={async () => {
                  try {
                    if (mediaStream.current) {
                      mediaStream.current.muted = false;
                      await mediaStream.current.play();
                    }
                    setNeedsUserInteraction(false);
                  } catch (e) {
                    console.error("Failed to start audio after user interaction", e);
                  }
                }}
              >
                Enable audio
              </button>
            </div>
          )}
        </div>
        <div className="hidden"></div>
      </div>
    </div>
  );
}

export default function InteractiveAvatarWrapper() {
  return (
    <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_BASE_API_URL}>
      <InteractiveAvatar />
    </StreamingAvatarProvider>
  );
}
