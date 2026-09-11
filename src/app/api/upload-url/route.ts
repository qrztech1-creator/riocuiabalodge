import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createSignedUploadUrl } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { folder = 'stories', fileName = 'upload.bin' } = body;

    const data = await createSignedUploadUrl(folder, fileName);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json({ error: error?.message || 'Erro ao gerar URL de upload' }, { status: 500 });
  }
}
