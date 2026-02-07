import { supabase } from "./client";

/**
 * Get public URL for a file in Supabase Storage
 * @param bucketName - Name of the storage bucket (e.g., 'videos', 'assets')
 * @param fileName - Name of the file (e.g., 'desktopVideo.mp4')
 * @returns Public URL for the file
 */
export async function getPublicUrl(bucketName: string, fileName: string) {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Get public URLs for both desktop and mobile videos
 * @param bucketName - Name of the storage bucket containing the videos (defaults to env var or "videos")
 * @returns Object with desktop and mobile video URLs
 */
export async function getVideoUrls(
  bucketName: string = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "videos"
) {
  const [desktopUrl, mobileUrl] = await Promise.all([
    getPublicUrl(bucketName, "desktopVideo.mp4"),
    getPublicUrl(bucketName, "mobileVideo.mp4"),
  ]);

  return {
    desktop: desktopUrl,
    mobile: mobileUrl,
  };
}
