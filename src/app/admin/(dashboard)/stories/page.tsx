'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Clock, Infinity, Film, Image as ImageIcon, Video } from 'lucide-react';
import { parseMedia } from '@/lib/media-helper';

interface Story {
  id: string;
  caption: string | null;
  mediaUrl: string;
  mediaType: string;
  duration: string;
  expiresAt: string | null;
  createdAt: string;
}

function getTimeRemaining(expiresAt: string | null): string {
  if (!expiresAt) return 'Permanente';
  
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expirado';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h restantes`;
  }
  
  return `${hours}h ${minutes}min restantes`;
}

function getDurationLabel(duration: string): string {
  switch (duration) {
    case '24H': return '24 horas';
    case '48H': return '48 horas';
    case '72H': return '72 horas';
    case '1_WEEK': return '1 semana';
    case 'PERMANENT': return 'Permanente';
    default: return duration;
  }
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = () => {
    setLoading(true);
    fetch('/api/stories')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStories(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStories();
    // Auto-refresh every 60 seconds to update time remaining
    const interval = setInterval(fetchStories, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este story?')) {
      await fetch(`/api/stories/${id}`, { method: 'DELETE' });
      fetchStories();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 border-b pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">🐟 Pescaria Acontecendo Agora</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Gerencie as postagens ao vivo da pescaria. As fotos e vídeos adaptam-se ao tamanho original e stories temporários expiram automaticamente.</p>
        </div>
        <Link
          href="/admin/stories/new"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1B395A] text-white rounded-lg font-medium hover:bg-[#132c47] transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Novo Story
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Carregando...</div>
      ) : stories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Film className="w-16 h-16 mx-auto opacity-50" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum story ativo</h3>
          <p className="text-gray-500 mb-6 text-sm">Comece postando o que está acontecendo na pescaria agora!</p>
          <Link
            href="/admin/stories/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1B395A] text-white rounded-lg font-medium hover:bg-[#132c47] transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Criar Primeiro Story
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-start">
          {stories.map((story) => {
            const media = parseMedia(story.mediaUrl);

            return (
              <div key={story.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
                {/* Media Preview - Adapta-se ao tamanho da imagem/vídeo sem cortes indesejados */}
                <div className="relative w-full bg-neutral-950 overflow-hidden flex items-center justify-center min-h-[220px]">
                  {media.type === 'YOUTUBE' ? (
                    <div className={`w-full ${media.isShort ? 'aspect-[9/16]' : 'aspect-video'}`}>
                      <iframe
                        src={media.embedUrl}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : media.type === 'VIDEO' ? (
                    <video
                      src={story.mediaUrl}
                      className="w-full h-auto max-h-[520px] object-contain block bg-black"
                      controls
                      muted
                      playsInline
                      loop
                    />
                  ) : (
                    <img
                      src={story.mediaUrl}
                      alt={story.caption || 'Story'}
                      className="w-full h-auto max-h-[520px] object-contain block bg-neutral-900"
                      loading="lazy"
                    />
                  )}
                  
                  {/* Badge de tipo */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
                    {media.type === 'YOUTUBE' ? (
                      <Video className="w-3.5 h-3.5 text-red-400" />
                    ) : media.type === 'VIDEO' ? (
                      <Film className="w-3.5 h-3.5 text-blue-400" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    {media.type === 'YOUTUBE' ? 'YouTube' : media.type === 'VIDEO' ? 'Vídeo' : 'Foto'}
                  </div>

                  {/* Badge de duração */}
                  <div className={`absolute top-3 right-3 flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm z-10 ${
                    story.duration === 'PERMANENT' 
                      ? 'bg-green-500/85 text-white' 
                      : 'bg-amber-500/85 text-white'
                  }`}>
                    {story.duration === 'PERMANENT' ? <Infinity className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {story.duration === 'PERMANENT' ? 'Fixo' : getDurationLabel(story.duration)}
                  </div>

                  {/* Delete overlay */}
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="absolute bottom-3 right-3 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md z-10"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4 bg-white flex flex-col flex-1 justify-between">
                  {story.caption && (
                    <p className="text-sm text-gray-800 font-medium mb-3 line-clamp-3">{story.caption}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 mt-auto">
                    <span>{new Date(story.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    <span className={`font-semibold ${
                      story.duration === 'PERMANENT' ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      {getTimeRemaining(story.expiresAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
