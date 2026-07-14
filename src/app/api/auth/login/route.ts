import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const success = await login(email, password);

    if (success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
