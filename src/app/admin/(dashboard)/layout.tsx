'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LayoutDashboard, FileText, Calendar, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Suspense } from 'react';

import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.role) setRole(data.role);
      })
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, category: null },
    { name: 'Notícias', href: '/admin/posts?category=NOTICIA', icon: FileText, category: 'NOTICIA' },
    { name: 'Artigos', href: '/admin/posts?category=ARTIGO', icon: FileText, category: 'ARTIGO' },
    { name: 'Eventos', href: '/admin/posts?category=EVENTO', icon: Calendar, category: 'EVENTO' },
  ];

  if (role === 'SUPERADMIN') {
    navItems.push({ name: 'Usuários', href: '/admin/users', icon: Users, category: null as any });
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#1B395A] rounded-md flex items-center justify-center text-white font-bold">
          RC
        </div>
        <div>
          <h2 className="font-bold text-gray-900 leading-tight">Rio Cuiabá</h2>
          <p className="text-xs text-gray-500">Painel Administrativo</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = item.category 
            ? pathname.includes('/posts') && currentCategory === item.category
            : pathname === item.href;
            
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#1B395A] text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mb-2">
          <ArrowLeft className="w-5 h-5" />
          Ver site
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Suspense fallback={<aside className="w-64 bg-white border-r border-gray-200 shadow-sm"></aside>}>
        <Sidebar />
      </Suspense>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
