"use client";

import { useEffect, useRef, useState } from "react";
import { getVideoUrls } from "@/lib/supabase/storage";

export default function Home() {
  const [videoUrls, setVideoUrls] = useState<{
    desktop: string | null;
    mobile: string | null;
  }>({ desktop: null, mobile: null });
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const hasInteractedRef = useRef(false);

  // Detect mobile device and set up responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch video URLs from Supabase
  useEffect(() => {
    const fetchVideos = () => {
      try {
        // Uses bucket name from env var NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET or defaults to "videos"
        const urls = getVideoUrls();
        console.log("Fetched video URLs:", urls);
        setVideoUrls(urls);
      } catch (error) {
        console.error("Error fetching videos from Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Function to start video playback (desktop only)
  const startPlayback = () => {
    if (hasInteractedRef.current || isMobile) return;
    hasInteractedRef.current = true;

    if (desktopVideoRef.current) {
      desktopVideoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  };

  // Handle video loading and autoplay (desktop only)
  useEffect(() => {
    if (isLoading || !videoUrls.desktop || isMobile) return;

    // Try to play desktop video
    if (desktopVideoRef.current) {
      desktopVideoRef.current.muted = true;
      desktopVideoRef.current.loop = true;
      desktopVideoRef.current.playsInline = true;

      const playPromise = desktopVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Autoplay was prevented, will start on user interaction
          console.log("Autoplay prevented, waiting for user interaction");
        });
      }
    }
  }, [isLoading, videoUrls.desktop, isMobile]);

  // Handle user interaction to start playback if autoplay was blocked
  useEffect(() => {
    const handleUserInteraction = () => {
      startPlayback();
    };

    const events = ["touchstart", "touchend", "click", "keydown"];
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 h-screen w-screen overflow-hidden"
      onClick={startPlayback}
      onTouchStart={startPlayback}
    >
      {/* Desktop Video */}
      {videoUrls.desktop && (
        <video
          ref={desktopVideoRef}
          src={videoUrls.desktop}
          className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full min-w-full w-[177.78vh] -translate-x-1/2 -translate-y-1/2 hidden md:block"
          autoPlay
          loop
          muted
          playsInline
          style={{
            objectFit: "cover",
            pointerEvents: "none",
          }}
          onError={(e) => {
            const video = e.currentTarget;
            console.error("Desktop video error:", {
              error: video.error,
              networkState: video.networkState,
              readyState: video.readyState,
              src: video.src,
            });
          }}
          onLoadedData={() => {
            console.log("Desktop video loaded successfully");
          }}
        />
      )}

      {/* Mobile Poster Image */}
      {videoUrls.mobile && (
        <img
          src={videoUrls.mobile}
          alt="Mobile background"
          className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full min-w-full w-[177.78vh] -translate-x-1/2 -translate-y-1/2 block md:hidden"
          style={{
            objectFit: "cover",
            pointerEvents: "none",
          }}
          onError={(e) => {
            console.error("Mobile poster image error:", {
              src: e.currentTarget.src,
            });
          }}
          onLoad={() => {
            console.log("Mobile poster image loaded successfully");
          }}
        />
      )}

      {/* Fallback if assets fail to load */}
      {!videoUrls.desktop && !videoUrls.mobile && (
        <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-black">
          <div className="text-white">Error loading assets</div>
        </div>
      )}
    </div>
  );
}
