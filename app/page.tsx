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
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
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
    const fetchVideos = async () => {
      try {
        // Uses bucket name from env var NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET or defaults to "videos"
        const urls = await getVideoUrls();
        setVideoUrls(urls);
      } catch (error) {
        console.error("Error fetching videos from Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Function to start video playback
  const startPlayback = () => {
    if (hasInteractedRef.current) return;
    hasInteractedRef.current = true;

    const activeVideo = isMobile
      ? mobileVideoRef.current
      : desktopVideoRef.current;
    if (activeVideo) {
      activeVideo.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  };

  // Handle video loading and autoplay
  useEffect(() => {
    if (isLoading || (!videoUrls.desktop && !videoUrls.mobile)) return;

    const activeVideo = isMobile
      ? mobileVideoRef.current
      : desktopVideoRef.current;
    const inactiveVideo = isMobile
      ? desktopVideoRef.current
      : mobileVideoRef.current;

    // Pause inactive video
    if (inactiveVideo) {
      inactiveVideo.pause();
      inactiveVideo.currentTime = 0;
    }

    // Try to play active video
    if (activeVideo) {
      activeVideo.muted = true;
      activeVideo.loop = true;
      activeVideo.playsInline = true;

      const playPromise = activeVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Autoplay was prevented, will start on user interaction
          console.log("Autoplay prevented, waiting for user interaction");
        });
      }
    }
  }, [isLoading, videoUrls, isMobile]);

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
        <div className="text-white">Loading videos...</div>
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
        />
      )}

      {/* Mobile Video */}
      {videoUrls.mobile && (
        <video
          ref={mobileVideoRef}
          src={videoUrls.mobile}
          className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full min-w-full w-[177.78vh] -translate-x-1/2 -translate-y-1/2 block md:hidden"
          autoPlay
          loop
          muted
          playsInline
          style={{
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Fallback if videos fail to load */}
      {!videoUrls.desktop && !videoUrls.mobile && (
        <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-black">
          <div className="text-white">Error loading videos</div>
        </div>
      )}
    </div>
  );
}
