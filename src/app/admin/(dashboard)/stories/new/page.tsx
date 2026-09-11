'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Send, Clock, Infinity, Film, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function NewStoryPage() {
  const router = useRouter();
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [duration, setDuration] = useState('PERMANENT');
  const [loading, setLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    setMediaType(isVideo ? 'VIDEO' : 'IMAGE');

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setMediaUrl(result);
      setPreviewSrc(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!mediaUrl) {
      alert('Envie uma foto ou vídeo antes de publicar.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption, mediaUrl, mediaType, duration }),
      });

      if (res.ok) {
        router.push('/admin/stories');
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao publicar story');
      }
    } catch (err) {
      alert('Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  const durations = [
    { value: 'PERMANENT', label: 'Permanente', desc: 'Fica até você excluir', icon: Infinity, color: 'border-green-500 bg-green-50 text-green-700' },
    { value: '24H', label: '24 Horas', desc: 'Tipo story do Instagram', icon: Clock, color: 'border-amber-500 bg-amber-50 text-amber-700' },
    { value: '48H', label: '48 Horas', desc: '2 dias no ar', icon: Clock, color: 'border-orange-500 bg-orange-50 text-orange-700' },
    { value: '72H', label: '72 Horas', desc: '3 dias no ar', icon: Clock, color: 'border-red-500 bg-red-50 text-red-700' },
    { value: '1_WEEK', label: '1 Semana', desc: '7 dias no ar', icon: Clock, color: 'border-purple-500 bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/stories" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Voltar para Stories
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🐟 Novo Story — Pescaria Agora</h1>
        <p className="text-gray-500 mt-1">Poste o que está acontecendo na pescaria! Escolha quanto tempo quer deixar no ar.</p>
      </div>

      <div className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        {/* Upload de Mídia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Foto ou Vídeo *</label>
          <div className="relative">
            <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-gray-400 transition-colors cursor-pointer relative">
              {previewSrc ? (
                <div className="relative aspect-video bg-gray-900">
                  {mediaType === 'VIDEO' ? (
                    <video src={previewSrc} className="w-full h-full object-contain" controls muted playsInline />
                  ) : (
                    <img src={previewSrc} alt="Preview" className="w-full h-full object-contain" />
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {mediaType === 'VIDEO' ? <Film className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                    {mediaType === 'VIDEO' ? 'Vídeo' : 'Foto'}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <Upload className="w-12 h-12 mb-4 text-gray-300" />
                  <p className="text-sm font-medium">Clique ou arraste uma foto/vídeo aqui</p>
                  <p className="text-xs text-gray-400 mt-1">Suporta JPG, PNG, MP4, MOV</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*,video/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileUpload}
              />
            </div>
            {previewSrc && (
              <button
                type="button"
                onClick={() => { setPreviewSrc(''); setMediaUrl(''); }}
                className="mt-2 text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Remover e escolher outro
              </button>
            )}
          </div>

          {/* URL externa como alternativa */}
          <div className="mt-4">
            <label className="block text-xs text-gray-500 mb-1">Ou cole uma URL externa:</label>
            <input
              type="text"
              value={mediaUrl.startsWith('data:') ? '' : mediaUrl}
              onChange={e => {
                const url = e.target.value;
                setMediaUrl(url);
                setPreviewSrc(url);
                if (url.match(/\.(mp4|mov|webm)$/i)) {
                  setMediaType('VIDEO');
                } else {
                  setMediaType('IMAGE');
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B395A] focus:border-transparent outline-none transition-all text-sm"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Legenda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Legenda (opcional)</label>
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B395A] focus:border-transparent outline-none transition-all resize-none"
            rows={3}
            placeholder="Ex: Dourado de 8kg fisgado agora! 🐟🔥"
          />
        </div>

        {/* Duração */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Tempo no Ar</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {durations.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDuration(opt.value)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  duration === opt.value
                    ? opt.color + ' border-current shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <opt.icon className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-sm">{opt.label}</div>
                  <div className="text-xs opacity-70">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Botão de Publicar */}
        <div className="pt-6 border-t">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !mediaUrl}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1B395A] text-white font-medium rounded-lg hover:bg-[#132c47] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            <Send className="w-5 h-5" />
            {loading ? 'Publicando...' : 'Publicar Story'}
          </button>
        </div>
      </div>
    </div>
  );
}
