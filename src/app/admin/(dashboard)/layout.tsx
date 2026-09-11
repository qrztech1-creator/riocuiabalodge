'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { 
  LayoutDashboard, FileText, Calendar, LogOut, ArrowLeft, Fish, Users, Menu, X 
} from 'lucide-react';
import Link from 'next/link';

function Sidebar({ 
  mobileMenuOpen, 
  setMobileMenuOpen 
}: { 
  mobileMenuOpen: boolean; 
  setMobileMenuOpen: (open: boolean) => void;
}) {
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
    { name: 'Pescaria Agora', href: '/admin/stories', icon: Fish, category: null },
  ];

  if (role === 'SUPERADMIN') {
    navItems.push({ name: 'Usuários', href: '/admin/users', icon: Users, category: null as any });
  }

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col shadow-2xl md:shadow-sm
      transform transition-transform duration-300 ease-in-out
      md:relative md:translate-x-0 md:w-64 md:z-auto md:min-h-screen
      ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Drawer Header */}
      <div className="p-5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1B395A] rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
            RC
          </div>
          <div>
            <h2 className="font-bold text-gray-900 leading-tight">Rio Cuiabá</h2>
            <p className="text-xs text-gray-500">Painel Administrativo</p>
          </div>
        </div>

        {/* Close Button on Mobile */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1.5 mt-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.category 
            ? pathname.includes('/posts') && currentCategory === item.category
            : pathname === item.href || pathname.startsWith(item.href + '/');
            
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#1B395A] text-white shadow-sm font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-gray-200 mt-auto bg-gray-50/50">
        <Link 
          href="/" 
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors mb-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Ver site
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Top Bar for Mobile */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#1B395A] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
            RC
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm leading-tight">Rio Cuiabá</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Painel Admin</p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6 text-[#1B395A]" />
        </button>
      </header>

      {/* Backdrop for Mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Suspense fallback={<div className="hidden md:block w-64 bg-white border-r border-gray-200" />}>
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      </Suspense>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
