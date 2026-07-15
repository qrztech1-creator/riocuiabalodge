import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const STATIC_PAGES: Record<string, string> = {
  '/': '/pages/inicio.html',
  '/pousada': '/pages/pousada.html',
  '/pescaria': '/pages/pescaria.html',
  '/depoimentos': '/pages/depoimentos.html',
  '/contato': '/pages/contato.html',
  '/eventos': '/pages/eventos.html',
};

const secretKey = 'pousada2026-super-secret-key-change-in-prod';
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 1. Handle Static Pages Routing
  const staticPage = STATIC_PAGES[pathname];
  if (staticPage) {
    return NextResponse.rewrite(new URL(staticPage, request.url));
  }
  
  // 2. Handle Admin Auth Protection
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const sessionCookie = request.cookies.get('session')?.value;
    let isAuthenticated = false;
    let payload: any = null;

    if (sessionCookie) {
      try {
        const { payload: decoded } = await jwtVerify(sessionCookie, key, { algorithms: ['HS256'] });
        payload = decoded;
        isAuthenticated = true;
      } catch (e) {
        isAuthenticated = false;
      }
    }

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Role check for /admin/users
    if (pathname.startsWith('/admin/users') && payload?.role !== 'SUPERADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // Same for API routes that write data (POST/PUT/DELETE)
  if (
    (pathname.startsWith('/api/posts') && request.method !== 'GET') ||
    pathname.startsWith('/api/users')
  ) {
    const sessionCookie = request.cookies.get('session')?.value;
    let isAuthenticated = false;
    let payload: any = null;
    
    if (sessionCookie) {
      try {
        const { payload: decoded } = await jwtVerify(sessionCookie, key, { algorithms: ['HS256'] });
        payload = decoded;
        isAuthenticated = true;
      } catch (e) {
        isAuthenticated = false;
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (pathname.startsWith('/api/users') && payload?.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', '/pousada', '/pescaria', '/eventos', '/depoimentos', '/contato', '/blog-list',
    '/admin/:path*', '/api/posts/:path*', '/api/users/:path*'
  ],
};
