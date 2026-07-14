import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Apenas Administradores podem excluir posts' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, category, content, coverImage, thumbnailImage, readTime, status, createdAt } = body;

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        category,
        content,
        status: status || 'PUBLISHED',
        coverImage: coverImage || '/assets/asset_12.jpg',
        ...(thumbnailImage !== undefined && { thumbnailImage }),
        readTime: Number(readTime) || 2,
        ...(createdAt && { createdAt: new Date(createdAt) })
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get post' }, { status: 500 });
  }
}
