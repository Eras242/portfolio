export default function Home() {
  // Replace with your YouTube video URL or video ID
  // Examples:
  // - Full URL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  // - Video ID: 'dQw4w9WgXcQ'
  const youtubeUrlOrId = "https://www.youtube.com/watch?v=r5MVPfAScl0";

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

  // YouTube embed URL with autoplay, loop, and mute parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`;

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      {/* YouTube Background Video */}
      <iframe
        src={embedUrl}
        className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full min-w-full w-[177.78vh] -translate-x-1/2 -translate-y-1/2"
        style={{
          pointerEvents: "none",
          border: "none",
        }}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Background Video"
      />

      {/* Optional: Add content overlay here if needed */}
    </div>
  );
}
