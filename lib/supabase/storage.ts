import { supabase } from "./client";

/**
 * Get public URL for a file in Supabase Storage
 * @param bucketName - Name of the storage bucket (e.g., 'videos', 'assets')
 * @param fileName - Name of the file (e.g., 'desktopVideo.mp4')
 * @returns Public URL for the file
 */
export function getPublicUrl(bucketName: string, fileName: string): string {
  try {
    const { data, error } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    
    if (error) {
      console.error(`Error getting public URL for ${fileName} from bucket ${bucketName}:`, error);
      throw error;
    }
    
    if (!data?.publicUrl) {
      throw new Error(`No public URL returned for ${fileName} from bucket ${bucketName}`);
    }
    
    console.log(`Generated URL for ${fileName}:`, data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error(`Failed to get public URL for ${fileName}:`, error);
    throw error;
  }
}

/**
 * Get public URLs for desktop video and mobile poster image
 * @param bucketName - Name of the storage bucket containing the assets (defaults to env var or "videos")
 * @returns Object with desktop video URL and mobile poster image URL
 */
export function getVideoUrls(
  bucketName: string = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "videos"
) {
  console.log(`Fetching assets from bucket: ${bucketName}`);
  
  const desktopUrl = getPublicUrl(bucketName, "desktopVideo.mp4");
  const mobilePosterUrl = getPublicUrl(bucketName, "mobilePoster.png");

  return {
    desktop: desktopUrl,
    mobile: mobilePosterUrl,
  };
}
