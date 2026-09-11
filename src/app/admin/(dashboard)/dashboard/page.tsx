'use client';

import { useEffect, useState } from 'react';
import { Eye, Edit3, Search, Folder, Scale, CalendarDays, FileText, Fish } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    noticiasPublicadas: 0,
    rascunhos: 0,
    eventos: 0,
    artigos: 0,
    storiesAtivos: 0
  });

  useEffect(() => {
    fetch('/api/posts?all=true')
      .then(r => r.json())
      .then(data => {
        const publishedNoticias = data.filter((p: any) => p.category === 'NOTICIA' && p.status === 'PUBLISHED').length;
        const draftNoticias = data.filter((p: any) => p.category === 'NOTICIA' && p.status === 'DRAFT').length;
        const artigos = data.filter((p: any) => p.category === 'ARTIGO').length;
        const eventos = data.filter((p: any) => p.category === 'EVENTO').length;
        
        setStats(s => ({
          ...s,
          noticiasPublicadas: publishedNoticias,
          rascunhos: draftNoticias,
          artigos: artigos,
          eventos: eventos
        }));
      });
    
    fetch('/api/stories')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStats(s => ({ ...s, storiesAtivos: data.length }));
        }
      })
      .catch(console.error);
  }, []);

  const metricCards = [
    { label: 'Notícias Publicadas', value: stats.noticiasPublicadas, icon: Eye },
    { label: 'Artigos', value: stats.artigos, icon: FileText },
    { label: 'Eventos', value: stats.eventos, icon: CalendarDays },
    { label: 'Pescaria Agora', value: stats.storiesAtivos, icon: Fish },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8 border-b pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bem-vindo, Admin</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Painel de gerenciamento do site Rio Cuiabá Lodge.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {metricCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 text-gray-500 mb-3 sm:mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                <card.icon className="w-5 h-5 text-[#1B395A]" />
              </div>
              <span className="font-medium text-xs sm:text-sm">{card.label}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 sm:gap-4">
        <Link href="/admin/posts?category=NOTICIA" className="px-5 py-3 bg-[#1B395A] text-white rounded-xl font-medium hover:bg-[#132c47] transition-colors shadow-sm text-center text-sm">
          Gerenciar Notícias
        </Link>
        <Link href="/admin/posts?category=ARTIGO" className="px-5 py-3 bg-[#1B395A] text-white rounded-xl font-medium hover:bg-[#132c47] transition-colors shadow-sm text-center text-sm">
          Gerenciar Artigos
        </Link>
        <Link href="/admin/posts?category=EVENTO" className="px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center text-sm">
          Gerenciar Eventos
        </Link>
        <Link href="/admin/stories" className="px-5 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors shadow-sm text-center text-sm">
          🐟 Pescaria Agora
        </Link>
      </div>
    </div>
  );
}
