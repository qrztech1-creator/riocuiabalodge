'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Send, Clock, Infinity, Film, Image as ImageIcon, Video, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { uploadToSupabase } from '@/lib/client-upload';
import { parseMedia } from '@/lib/media-helper';

export default function NewStoryPage() {
  const router = useRouter();
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [duration, setDuration] = useState('PERMANENT');
  const [loading, setLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const parsedMedia = parseMedia(previewSrc || mediaUrl);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploading(true);
    setUploadProgress(0);

    const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v)$/i.test(file.name);
    setMediaType(isVideo ? 'VIDEO' : 'IMAGE');

    // Show temporary local preview while uploading
    const localPreview = URL.createObjectURL(file);
    setPreviewSrc(localPreview);

    try {
      const result = await uploadToSupabase(file, 'stories', (percent) => {
        setUploadProgress(percent);
      });

      setMediaUrl(result.publicUrl);
      setPreviewSrc(result.publicUrl);
      setMediaType(result.mediaType);
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Erro ao enviar arquivo para o armazenamento.');
      setPreviewSrc('');
      setMediaUrl('');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setMediaUrl(url);
    setPreviewSrc(url);
    setUploadError('');

    const parsed = parseMedia(url);
    if (parsed.type === 'YOUTUBE' || parsed.type === 'VIDEO') {
      setMediaType('VIDEO');
    } else {
      setMediaType('IMAGE');
    }
  };

  const handleSubmit = async () => {
    if (!mediaUrl) {
      alert('Envie uma foto/vídeo ou cole um link antes de publicar.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          caption, 
          mediaUrl: mediaUrl.trim(), 
          mediaType: (parsedMedia.type === 'YOUTUBE' || parsedMedia.type === 'VIDEO') ? 'VIDEO' : 'IMAGE', 
          duration 
        }),
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
        <p className="text-gray-500 mt-1">Poste fotos, vídeos ou links do YouTube da pescaria! A mídia adapta-se ao tamanho original sem cortes.</p>
      </div>

      <div className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        {/* Upload de Mídia ou Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Foto, Vídeo ou Link do YouTube *</label>

          {uploadError && (
            <div className="mb-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Erro no arquivo</p>
                <p className="mt-0.5">{uploadError}</p>
              </div>
            </div>
          )}

          {/* Área de Preview Adaptativa (sem cortar imagens) */}
          <div className="relative">
            <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-gray-400 transition-colors cursor-pointer relative bg-neutral-950">
              {previewSrc ? (
                <div className="relative w-full min-h-[220px] max-h-[550px] flex items-center justify-center p-2">
                  {parsedMedia.type === 'YOUTUBE' ? (
                    <div className={`w-full ${parsedMedia.isShort ? 'aspect-[9/16] max-w-sm' : 'aspect-video max-w-2xl'} rounded-lg overflow-hidden`}>
                      <iframe
                        src={parsedMedia.embedUrl}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : parsedMedia.type === 'VIDEO' ? (
                    <video
                      src={previewSrc}
                      className="w-full max-h-[500px] object-contain rounded-lg"
                      controls
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={previewSrc}
                      alt="Preview"
                      className="w-full max-h-[500px] object-contain rounded-lg"
                    />
                  )}

                  {/* Badge de tipo */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/75 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm z-10">
                    {parsedMedia.type === 'YOUTUBE' ? (
                      <Video className="w-3.5 h-3.5 text-red-400" />
                    ) : parsedMedia.type === 'VIDEO' ? (
                      <Film className="w-3.5 h-3.5 text-blue-400" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    {parsedMedia.type === 'YOUTUBE' ? 'YouTube' : parsedMedia.type === 'VIDEO' ? 'Vídeo' : 'Foto'}
                  </div>

                  {uploading && (
                    <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-6 text-white backdrop-blur-sm z-20">
                      <Loader2 className="w-8 h-8 animate-spin mb-3 text-amber-400" />
                      <p className="font-semibold text-sm mb-2">Otimizando e enviando mídia... {uploadProgress}%</p>
                      <div className="w-full max-w-xs bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-white">
                  <Upload className="w-12 h-12 mb-4 text-gray-300" />
                  <p className="text-sm font-medium text-gray-700">Clique ou arraste uma foto ou vídeo aqui</p>
                  <p className="text-xs text-gray-400 mt-1">Fotos são compactadas automaticamente • Vídeos de até 50 MB</p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">Ou cole um link do YouTube / link direto abaixo</p>
                </div>
              )}
              
              <input
                type="file"
                disabled={uploading}
                accept="image/*,video/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                onChange={handleFileUpload}
              />
            </div>

            {previewSrc && !uploading && (
              <button
                type="button"
                onClick={() => { setPreviewSrc(''); setMediaUrl(''); setUploadError(''); }}
                className="mt-2 text-sm text-red-500 hover:text-red-700 transition-colors font-medium"
              >
                ✕ Remover e escolher outro
              </button>
            )}
          </div>

          {/* Campo para colar URL do YouTube ou Link Direto */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Cole um Link do YouTube (vídeo ou Shorts) ou link direto de foto/vídeo:
            </label>
            <input
              type="text"
              value={mediaUrl}
              onChange={e => handleUrlChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B395A] focus:border-transparent outline-none transition-all text-sm"
              placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/... ou https://youtube.com/shorts/..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Suporta links normais do YouTube, YouTube Shorts, Vimeo e links diretos (.mp4, .jpg, .png, etc.).
            </p>
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
            placeholder="Ex: Dourado de 8kg fisgado agora nas corredeiras! 🐟🔥"
          />
        </div>

        {/* Duração */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Tempo de Permanência</label>
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
            disabled={loading || uploading || !mediaUrl}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1B395A] text-white font-medium rounded-lg hover:bg-[#132c47] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            <Send className="w-5 h-5" />
            {loading ? 'Publicando...' : uploading ? 'Aguarde o envio...' : 'Publicar Story'}
          </button>
        </div>
      </div>
    </div>
  );
}
