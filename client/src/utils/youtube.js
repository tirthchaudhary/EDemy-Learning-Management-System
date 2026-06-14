/**
 * Extracts the 11-character YouTube Video ID from various YouTube URL formats.
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 * - VIDEO_ID (already a raw ID)
 * 
 * @param {string} url - The YouTube URL or raw ID.
 * @returns {string} The extracted YouTube Video ID, or the original string if not matched.
 */
export const getYouTubeId = (url) => {
  if (!url) return '';
  
  // 1. Try standard parsing if it's a valid URL
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('youtube.com')) {
      // Handle watch query param (e.g., ?v=VIDEO_ID)
      const videoId = parsedUrl.searchParams.get('v');
      if (videoId) return videoId;
      
      // Handle embeds, v/, shorts (e.g., /embed/VIDEO_ID, /shorts/VIDEO_ID)
      const pathParts = parsedUrl.pathname.split('/');
      if (pathParts.includes('embed') || pathParts.includes('v') || pathParts.includes('shorts')) {
        return pathParts[pathParts.length - 1];
      }
    } else if (parsedUrl.hostname.includes('youtu.be')) {
      // Handle short link (e.g., https://youtu.be/VIDEO_ID)
      return parsedUrl.pathname.slice(1);
    }
  } catch (e) {
    // Not a valid URL, fallback to regex / raw string checking
  }

  // 2. Regex fallback for any other format
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }
  
  // 3. Return trimmed input as fallback (could be raw ID)
  return url.trim();
};
