"use client";

import { useEffect, useRef, useState } from "react";
import { getAssetUrls } from "@/lib/supabase/storage";

interface AssetUrls {
  desktopVideo: string | null;
  desktopPoster: string | null;
  mobileGif: string | null;
  mobilePoster: string | null;
}

export default function Home() {
  const [assetUrls, setAssetUrls] = useState<AssetUrls>({
    desktopVideo: null,
    desktopPoster: null,
    mobileGif: null,
    mobilePoster: null,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [desktopVideoLoaded, setDesktopVideoLoaded] = useState(false);
  const [mobileGifLoaded, setMobileGifLoaded] = useState(false);
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

  // Fetch asset URLs from Supabase
  useEffect(() => {
    const fetchAssets = () => {
      try {
        // Uses bucket name from env var NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET or defaults to "videos"
        const urls = getAssetUrls();
        console.log("Fetched asset URLs:", urls);
        setAssetUrls(urls);
      } catch (error) {
        console.error("Error fetching assets from Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
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
    if (isLoading || !assetUrls.desktopVideo || isMobile) return;

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
  }, [isLoading, assetUrls.desktopVideo, isMobile]);

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
      className="fixed inset-0 h-screen w-screen overflow-hidden bg-black"
      onClick={startPlayback}
      onTouchStart={startPlayback}
    >
      {/* Desktop Poster (placeholder while video loads) */}
      {assetUrls.desktopPoster && (
        <img
          src={assetUrls.desktopPoster}
          alt="Desktop background placeholder"
          className={`absolute left-1/2 top-1/2 h-[56.25vw] min-h-full min-w-full w-[177.78vh] -translate-x-1/2 -translate-y-1/2 hidden md:block transition-opacity duration-500 ${
            desktopVideoLoaded ? "opacity-0" : "opacity-100"
          }`}
          style={{
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Desktop Video */}
      {assetUrls.desktopVideo && (
        <video
          ref={desktopVideoRef}
          src={assetUrls.desktopVideo}
          className={`absolute left-1/2 top-1/2 h-[56.25vw] min-h-full min-w-full w-[177.78vh] -translate-x-1/2 -translate-y-1/2 hidden md:block transition-opacity duration-500 ${
            desktopVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
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
            setDesktopVideoLoaded(true);
          }}
        />
      )}

      {/* Mobile Poster (placeholder while gif loads) */}
      {assetUrls.mobilePoster && (
        <img
          src={assetUrls.mobilePoster}
          alt="Mobile background placeholder"
          className={`absolute left-1/2 top-1/2 h-[56.25vw] min-h-full min-w-full w-[177.78vh] -translate-x-1/2 -translate-y-1/2 block md:hidden transition-opacity duration-500 ${
            mobileGifLoaded ? "opacity-0" : "opacity-100"
          }`}
          style={{
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Mobile GIF */}
      {assetUrls.mobileGif && (
        <img
          src={assetUrls.mobileGif}
          alt="Mobile background"
          className={`absolute left-1/2 top-1/2 h-[56.25vw] min-h-full min-w-full w-[177.78vh] -translate-x-1/2 -translate-y-1/2 block md:hidden transition-opacity duration-500 ${
            mobileGifLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            objectFit: "cover",
            pointerEvents: "none",
          }}
          onError={(e) => {
            console.error("Mobile GIF error:", {
              src: e.currentTarget.src,
            });
          }}
          onLoad={() => {
            console.log("Mobile GIF loaded successfully");
            setMobileGifLoaded(true);
          }}
        />
      )}

      {/* Fallback if assets fail to load */}
      {!assetUrls.desktopVideo &&
        !assetUrls.mobileGif &&
        !assetUrls.desktopPoster &&
        !assetUrls.mobilePoster && (
          <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-black">
            <div className="text-white">Error loading assets</div>
          </div>
        )}
    </div>
  );
}
