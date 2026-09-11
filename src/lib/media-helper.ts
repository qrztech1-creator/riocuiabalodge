export interface MediaInfo {
  type: 'YOUTUBE' | 'VIDEO' | 'IMAGE';
  embedUrl?: string;
  isShort?: boolean;
}

export function parseMedia(url: string): MediaInfo {
  if (!url) return { type: 'IMAGE' };

  const cleanUrl = url.trim();

  // 1. Check YouTube
  // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID, m.youtube.com/...
  const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    const isShort = cleanUrl.includes('/shorts/');
    return {
      type: 'YOUTUBE',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&controls=1&modestbranding=1`,
      isShort,
    };
  }

  // 2. Check Vimeo
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'YOUTUBE',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&playsinline=1`,
      isShort: false,
    };
  }

  // 3. Check direct video file
  if (
    /\.(mp4|mov|webm|m4v|ogg)(\?.*)?$/i.test(cleanUrl) ||
    cleanUrl.startsWith('data:video/')
  ) {
    return { type: 'VIDEO' };
  }

  // 4. Default to Image (works for JPG, PNG, WEBP, GIF, SVG, Supabase Storage URLs, Unsplash, etc.)
  return { type: 'IMAGE' };
}
