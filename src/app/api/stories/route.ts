import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function calculateExpiresAt(duration: string): Date | null {
  if (duration === 'PERMANENT') return null;
  
  const now = new Date();
  switch (duration) {
    case '24H':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case '48H':
      return new Date(now.getTime() + 48 * 60 * 60 * 1000);
    case '72H':
      return new Date(now.getTime() + 72 * 60 * 60 * 1000);
    case '1_WEEK':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
}

export async function GET() {
  try {
    const now = new Date();

    // Delete expired stories automatically
    await prisma.story.deleteMany({
      where: {
        expiresAt: {
          not: null,
          lte: now,
        },
      },
    });

    // Return active stories (non-expired)
    const stories = await prisma.story.findMany({
      where: {
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(stories);
  } catch (error: any) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ error: 'Failed to fetch stories', message: error?.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { caption, mediaUrl, mediaType, duration } = body;

    if (!mediaUrl) {
      return NextResponse.json({ error: 'mediaUrl is required' }, { status: 400 });
    }

    const expiresAt = calculateExpiresAt(duration || 'PERMANENT');

    const story = await prisma.story.create({
      data: {
        caption: caption || null,
        mediaUrl,
        mediaType: mediaType || 'IMAGE',
        duration: duration || 'PERMANENT',
        expiresAt,
      },
    });

    return NextResponse.json(story, { status: 201 });
  } catch (error: any) {
    console.error('Error creating story:', error);
    return NextResponse.json({ error: 'Failed to create story', message: error?.message }, { status: 500 });
  }
}
