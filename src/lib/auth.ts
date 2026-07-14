import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.JWT_SECRET || 'pousada2026-super-secret-key-change-in-prod';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function login(email: string, passwordString: string) {
  // Encontra o usuário
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) return false;
  
  const isValid = await bcrypt.compare(passwordString, user.passwordHash);
  
  if (isValid) {
    const expires = new Date(Date.now() + 10 * 60 * 60 * 1000); // 10 hours
    const session = await encrypt({ id: user.id, email: user.email, role: user.role, expires });

    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires, httpOnly: true });
    
    return true;
  }
  return false;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) return null;

  try {
    const payload = await decrypt(sessionCookie);
    if (!payload || !payload.id) return null;

    // Retorna os dados diretamente do JWT para evitar chamadas lentas ao banco de dados a cada carregamento de página
    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as string
    };
  } catch (error) {
    return null;
  }
}
