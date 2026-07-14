'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, Save, Send, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import QuillEditor from '@/components/QuillEditor';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'ARTIGO',
    status: 'PUBLISHED',
    coverImage: '',
    thumbnailImage: '',
    content: '',
    createdAt: ''
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          title: data.title,
          slug: data.slug,
          category: data.category,
          status: data.status,
          coverImage: data.coverImage,
          thumbnailImage: data.thumbnailImage || '',
          content: data.content,
          createdAt: data.createdAt ? new Date(data.createdAt).toISOString().slice(0, 16) : ''
        });
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent, isDraft = false, redirect = true) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      ...form,
      createdAt: form.createdAt ? new Date(form.createdAt).toISOString() : undefined,
      status: isDraft ? 'DRAFT' : 'PUBLISHED'
    };

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      const data = await res.json();
      setForm(prev => ({ ...prev, slug: data.slug }));

      if (redirect) {
        router.push(`/admin/posts?category=${form.category}`);
      }
    } catch (err) {
      alert('Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(e, true, false);
    
    // Slug might have changed or just loaded, we will use a fallback logic 
    // but React state won't update instantly in this closure, so we recalculate slug just in case
    const slug = form.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    window.open(`/${slug}`, '_blank');
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href={`/admin/posts?category=${form.category}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Voltar para posts
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Editar Post</h1>
      </div>

      <form className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B395A] focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B395A] focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="NOTICIA">Notícia</option>
              <option value="ARTIGO">Artigo</option>
              <option value="EVENTO">Evento</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Publicação</label>
            <input
              type="datetime-local"
              value={form.createdAt}
              onChange={e => setForm({...form, createdAt: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B395A] focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Capa (Fundo do Cabeçalho)</label>
            <input
              type="text"
              value={form.coverImage}
              onChange={e => setForm({...form, coverImage: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B395A] focus:border-transparent outline-none transition-all mb-4"
              placeholder="/assets/asset_12.jpg ou https://..."
            />

            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer relative overflow-hidden"
            >
              {form.coverImage && (form.coverImage.startsWith('data:image') || form.coverImage.startsWith('/') || form.coverImage.startsWith('http')) && !form.coverImage.endsWith('.mp4') ? (
                <img src={form.coverImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
              ) : null}
              {form.coverImage && form.coverImage.endsWith('.mp4') ? (
                <video src={form.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-50" muted playsInline></video>
              ) : null}
              <input 
                type="file" 
                accept="image/*,video/mp4"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setForm({...form, coverImage: reader.result as string});
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <Upload className="w-8 h-8 mb-3 text-gray-400 relative z-20" />
              <p className="text-sm relative z-20 font-medium text-center">Fundo do Cabeçalho</p>
            </div>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Capa (Miniatura na Listagem)</label>
            <input
              type="text"
              value={form.thumbnailImage}
              onChange={e => setForm({...form, thumbnailImage: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B395A] focus:border-transparent outline-none transition-all mb-4"
              placeholder="URL ou carregue abaixo..."
            />
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer relative overflow-hidden"
            >
              {form.thumbnailImage && (form.thumbnailImage.startsWith('data:image') || form.thumbnailImage.startsWith('/') || form.thumbnailImage.startsWith('http')) ? (
                <img src={form.thumbnailImage} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-50" />
              ) : null}
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setForm({...form, thumbnailImage: reader.result as string});
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <Upload className="w-8 h-8 mb-3 text-gray-400 relative z-20" />
              <p className="text-sm relative z-20 font-medium text-center">Miniatura</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo do Post</label>
            <div className="bg-white">
              <QuillEditor 
                value={form.content} 
                onChange={(val) => setForm({...form, content: val})} 
                className="h-[400px] mb-12"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-6 border-t mt-8">
          <button
            type="button"
            onClick={(e) => handlePreview(e)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Preview
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors ml-auto"
          >
            <Save className="w-4 h-4" />
            Salvar Rascunho
          </button>
          
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1B395A] text-white font-medium rounded-lg hover:bg-[#132c47] transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
            Salvar e Publicar
          </button>
        </div>
      </form>
    </div>
  );
}
