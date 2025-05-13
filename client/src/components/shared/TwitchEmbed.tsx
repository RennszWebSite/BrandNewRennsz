import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";

interface TwitchEmbedProps {
  channel: string;
  height?: string;
  width?: string;
  allowFullscreen?: boolean;
  muted?: boolean;
  theme?: "light" | "dark";
  onReady?: () => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

export default function TwitchEmbed({
  channel,
  height = "100%",
  width = "100%",
  allowFullscreen = true,
  muted = false,
  theme = "dark",
  onReady,
  onOffline,
  onOnline,
}: TwitchEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const { toast } = useToast();
  const uniqueId = `twitch-embed-${Math.random().toString(36).substring(2, 9)}`;

  useEffect(() => {
    // Load the Twitch embed script
    const script = document.createElement("script");
    script.src = "https://embed.twitch.tv/embed/v1.js";
    script.async = true;
    script.onload = initializeTwitchEmbed;
    script.onerror = handleScriptError;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error("Error destroying Twitch player:", error);
        }
      }
    };
  }, [channel]);

  const initializeTwitchEmbed = () => {
    try {
      if (!embedRef.current) return;
      
      if (window.Twitch && window.Twitch.Embed) {
        playerRef.current = new window.Twitch.Embed(uniqueId, {
          width: width,
          height: height,
          channel: channel,
          layout: "video",
          autoplay: true,
          muted: muted,
          theme: theme,
          allowfullscreen: allowFullscreen,
          parent: [window.location.hostname],
        });

        playerRef.current.addEventListener(window.Twitch.Embed.VIDEO_READY, () => {
          onReady && onReady();
        });

        playerRef.current.addEventListener(window.Twitch.Embed.ONLINE, () => {
          onOnline && onOnline();
        });

        playerRef.current.addEventListener(window.Twitch.Embed.OFFLINE, () => {
          onOffline && onOffline();
        });
      }
    } catch (error) {
      console.error("Error initializing Twitch embed:", error);
      toast({
        variant: "destructive",
        title: "Failed to load stream",
        description: "There was an error loading the Twitch stream. Please try refreshing the page.",
      });
    }
  };

  const handleScriptError = () => {
    console.error("Failed to load Twitch embed script");
    toast({
      variant: "destructive",
      title: "Failed to load Twitch",
      description: "There was an error loading the Twitch player. Please check your connection and try again.",
    });
  };

  if (!channel) {
    return <ErrorState message="Channel name is required to display the stream" />;
  }

  return (
    <div className="relative w-full h-full">
      <div ref={embedRef} id={uniqueId} className="w-full h-full absolute inset-0">
        <LoadingState message="Loading stream..." className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm" />
      </div>
    </div>
  );
}
