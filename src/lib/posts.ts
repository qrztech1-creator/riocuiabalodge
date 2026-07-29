import { prisma } from '@/lib/prisma';

interface CacheEntry {
  data: any[];
  timestamp: number;
}

let postsCache: CacheEntry | null = null;
const CACHE_TTL = 60 * 1000; // 60 seconds TTL

export function clearPostsCache() {
  postsCache = null;
}

export async function getCachedPosts(all = false) {
  const now = Date.now();
  
  if (postsCache && (now - postsCache.timestamp < CACHE_TTL)) {
    const data = postsCache.data;
    return all ? data : data.filter((p: any) => p.status === 'PUBLISHED');
  }

  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    postsCache = { data: posts, timestamp: now };
    return all ? posts : posts.filter((p: any) => p.status === 'PUBLISHED');
  } catch (error) {
    console.error('Error fetching posts in getCachedPosts:', error);
    if (postsCache) {
      return all ? postsCache.data : postsCache.data.filter((p: any) => p.status === 'PUBLISHED');
    }
    return [];
  }
}

export async function getCachedPostBySlug(slug: string) {
  const posts = await getCachedPosts(true);
  let post = posts.find((p: any) => p.slug === slug);
  if (!post) {
    try {
      post = await prisma.post.findUnique({ where: { slug } });
    } catch (e) {
      console.error('Error in getCachedPostBySlug:', e);
    }
  }
  return post || null;
}
