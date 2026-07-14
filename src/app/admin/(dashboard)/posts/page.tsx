'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ExternalLink, Edit, Trash2, Plus } from 'lucide-react';

import { Suspense } from 'react';

function PostsList() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'NOTICIA';
  let title = 'Notícias';
  if (category === 'ARTIGO') title = 'Artigos';
  if (category === 'EVENTO') title = 'Eventos';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    setLoading(true);
    fetch('/api/posts?all=true')
      .then(r => r.json())
      .then(data => {
        setPosts(data.filter((p: any) => p.category === category));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      fetchPosts();
    }
  };

  const handleToggleStatus = async (post: any) => {
    const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, status: newStatus })
    });
    fetchPosts();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-1">Gerencie os registros do site.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href={`/admin/posts/new?category=${category}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1B395A] text-white rounded-lg font-medium hover:bg-[#132c47] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Post
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Data</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                posts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{post.title}</div>
                      <div className="text-xs text-gray-500 mt-1">Por Admin</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'PUBLISHED' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {post.status === 'PUBLISHED' ? 'Publicado' : 'Oculto'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 text-gray-400">
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleToggleStatus(post); }} className={`p-1.5 rounded transition-colors ${post.status === 'PUBLISHED' ? 'hover:text-amber-600 hover:bg-amber-50 text-gray-400' : 'text-gray-900 bg-gray-100 hover:bg-gray-200'}`} title={post.status === 'PUBLISHED' ? 'Ocultar' : 'Publicar'}>
                          {post.status === 'PUBLISHED' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        {post.status === 'PUBLISHED' && (
                          <Link href={`/${post.slug}`} target="_blank" className="p-1.5 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Visualizar página">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link href={`/admin/posts/${post.id}`} className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Editar">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }} className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Excluir">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function PostsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Carregando...</div>}>
      <PostsList />
    </Suspense>
  );
}
