import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function DELETE(request: Request, context: any) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { id } = await context.params;

    if (session.id === id) {
      return NextResponse.json({ error: 'Você não pode excluir a si mesmo' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 });
  }
}
