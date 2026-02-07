"use client";

import { useEffect, useRef } from "react";

// YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function Home() {
  // Replace with your YouTube video URL or video ID
  // Examples:
  // - Full URL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  // - Video ID: 'dQw4w9WgXcQ'
  const youtubeUrlOrId = "https://www.youtube.com/watch?v=r5MVPfAScl0";

  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);

  // Extract video ID from URL or use as-is if it's already an ID
  const getVideoId = (input: string): string => {
    if (!input) return "";

    // If it's already just an ID (no slashes or special chars), return it
    if (!input.includes("youtube.com") && !input.includes("youtu.be")) {
      return input;
    }

    // Extract from youtube.com/watch?v= format
    const watchMatch = input.match(/[?&]v=([^&]+)/);
    if (watchMatch) return watchMatch[1];

    // Extract from youtu.be/ format
    const shortMatch = input.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return shortMatch[1];

    // Extract from youtube.com/embed/ format
    const embedMatch = input.match(/embed\/([^?&]+)/);
    if (embedMatch) return embedMatch[1];

    return input;
  };

  const videoId = getVideoId(youtubeUrlOrId);

  useEffect(() => {
    // Load YouTube IFrame API script
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
        return;
      }

      // Check if script is already loading
      const existingScript = document.querySelector(
        'script[src*="youtube.com/iframe_api"]'
      );
      if (existingScript) {
        // Wait for API to be ready
        window.onYouTubeIframeAPIReady = initializePlayer;
        return;
      }

      // Load the script
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    };

    const initializePlayer = () => {
      if (!playerRef.current || playerInstanceRef.current) return;

      playerInstanceRef.current = new window.YT.Player(playerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: videoId, // Required for looping
          mute: 1, // Critical for mobile autoplay
          controls: 0,
          showinfo: 0,
          rel: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1, // Important for iOS
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            // Force play on mobile devices
            event.target.playVideo();
            event.target.mute();
          },
          onStateChange: (event: any) => {
            // Handle video end and manually restart for better mobile support
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    };

    loadYouTubeAPI();

    // Cleanup
    return () => {
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
        playerInstanceRef.current = null;
      }
    };
  }, [videoId]);

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      {/* YouTube Background Video */}
      <div
        ref={playerRef}
        className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full min-w-full w-[177.78vh] -translate-x-1/2 -translate-y-1/2"
        style={{
          pointerEvents: "none",
        }}
      />

      {/* Optional: Add content overlay here if needed */}
    </div>
  );
}
