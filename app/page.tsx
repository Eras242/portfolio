"use client";

import { useEffect, useRef } from "react";

// Declare YouTube IFrame API types
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
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
  const hasInteractedRef = useRef(false);

  // Function to start video playback
  const startPlayback = () => {
    if (playerRef.current) {
      try {
        const playerState = playerRef.current.getPlayerState();
        // Only play if video is not already playing or buffering
        if (
          playerState === window.YT.PlayerState.PAUSED ||
          playerState === window.YT.PlayerState.UNSTARTED ||
          playerState === window.YT.PlayerState.CUED
        ) {
          playerRef.current.playVideo();
          playerRef.current.mute();
        }
      } catch (e) {
        // Ignore errors
      }
    }
  };

  useEffect(() => {
    // Load YouTube IFrame API script
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
        return;
      }

      // Create script tag for YouTube IFrame API
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      // Callback when API is ready
      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    };

    const initializePlayer = () => {
      if (!containerRef.current && !window.YT) return;

      // Destroy existing player if it exists
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore errors
        }
      }

      // Create new player instance
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: videoId, // Required for looping
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            // Force play on mobile devices
            event.target.playVideo();
            // Ensure it stays muted
            event.target.mute();

            // Check if video actually started playing after a short delay
            setTimeout(() => {
              try {
                const state = event.target.getPlayerState();
                // If video didn't start (blocked by autoplay policy), wait for user interaction
                if (
                  state === window.YT.PlayerState.UNSTARTED ||
                  state === window.YT.PlayerState.CUED
                ) {
                  // Video will start on first user interaction
                }
              } catch (e) {
                // Ignore errors
              }
            }, 1000);
          },
          onStateChange: (event: any) => {
            // If video ends, restart it (for looping)
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    };

    loadYouTubeAPI();

    // Handle user interaction to start playback if autoplay was blocked
    const handleUserInteraction = () => {
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        startPlayback();
      }
    };

    // Add event listeners for user interaction
    const events = ["touchstart", "touchend", "click", "keydown"];
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, {
        once: true,
        passive: true,
      });
    });

    // Cleanup function
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction);
      });
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore errors
        }
      }
    };
  }, [videoId]);

  return (
    <div
      className="fixed inset-0 h-screen w-screen overflow-hidden"
      onClick={startPlayback}
      onTouchStart={startPlayback}
    >
      {/* YouTube Background Video Container */}
      <div
        ref={containerRef}
        className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full min-w-full w-[177.78vh] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          id="youtube-player"
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Optional: Add content overlay here if needed */}
    </div>
  );
}
