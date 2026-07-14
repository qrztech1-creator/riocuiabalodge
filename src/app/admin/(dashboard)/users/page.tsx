'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, User as UserIcon, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EDITOR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.status === 403) {
        router.push('/admin/dashboard');
        return;
      }
      if (!res.ok) throw new Error('Falha ao carregar usuários');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao criar usuário');
      }

      setShowModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setRole('EDITOR');
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao deletar usuário');
      }
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando usuários...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os acessos ao painel administrativo</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1B395A] hover:bg-[#132c47] text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
        >
          <UserPlus className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Função</th>
                <th className="px-6 py-4">Criado em</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1B395A]/10 flex items-center justify-center text-[#1B395A]">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name || 'Usuário'}</div>
                        <div className="text-gray-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.role === 'SUPERADMIN' 
                        ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      <Shield className="w-3.5 h-3.5" />
                      {user.role === 'SUPERADMIN' ? 'Super Admin' : 'Editor'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                      title="Excluir usuário"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Glassmorphism */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Criar Novo Usuário</h3>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B395A] focus:border-transparent outline-none transition-all"
                  placeholder="Nome do usuário"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B395A] focus:border-transparent outline-none transition-all"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B395A] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Função (Role)</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B395A] focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="EDITOR">Editor (Pode postar, não exclui)</option>
                  <option value="SUPERADMIN">Super Admin (Acesso total)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#1B395A] hover:bg-[#132c47] text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-70"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
