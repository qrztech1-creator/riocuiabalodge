import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    return NextResponse.json({
      id: session.id,
      email: session.email,
      role: session.role
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
