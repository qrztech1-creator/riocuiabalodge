import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCachedPosts, clearPostsCache } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const all = url.searchParams.get('all') === 'true';
    
    const posts = await getCachedPosts(all);
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error('Error fetching posts in /api/posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts', message: error?.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, content, coverImage, thumbnailImage, readTime, status, createdAt } = body;

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        category,
        content,
        status: status || 'PUBLISHED',
        coverImage: coverImage || '/assets/asset_12.jpg',
        thumbnailImage: thumbnailImage || null,
        readTime: Number(readTime) || 2,
        ...(createdAt && { createdAt: new Date(createdAt) })
      }
    });

    clearPostsCache();
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
