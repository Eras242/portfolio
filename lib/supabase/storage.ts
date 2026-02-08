import { supabase } from "./client";

/**
 * Get public URL for a file in Supabase Storage
 * @param bucketName - Name of the storage bucket (e.g., 'videos', 'assets')
 * @param fileName - Name of the file (e.g., 'desktopVideo.mp4')
 * @returns Public URL for the file
 */
export function getPublicUrl(bucketName: string, fileName: string): string {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);

  if (!data?.publicUrl) {
    throw new Error(
      `No public URL returned for ${fileName} from bucket ${bucketName}`
    );
  }

  console.log(`Generated URL for ${fileName}:`, data.publicUrl);
  return data.publicUrl;
}

/**
 * Get public URLs for all assets (videos, gifs, and poster images)
 * @param bucketName - Name of the storage bucket containing the assets (defaults to env var or "videos")
 * @returns Object with all asset URLs
 */
export function getAssetUrls(
  bucketName: string = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    "videos"
) {
  console.log(`Fetching assets from bucket: ${bucketName}`);

  return {
    desktopVideo: getPublicUrl(bucketName, "desktopVideo.mp4"),
    desktopPoster: getPublicUrl(bucketName, "desktopPoster.png"),
    mobileGif: getPublicUrl(bucketName, "mobileGif.gif"),
    mobilePoster: getPublicUrl(bucketName, "mobilePoster.png"),
  };
}

// Keep for backwards compatibility
export function getVideoUrls(
  bucketName: string = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    "videos"
) {
  const assets = getAssetUrls(bucketName);
  return {
    desktop: assets.desktopVideo,
    mobile: assets.mobileGif,
  };
}
