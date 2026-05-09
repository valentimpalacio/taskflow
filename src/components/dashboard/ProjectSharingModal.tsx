'use client';

import { useState } from 'react';
import { Share2, Copy, Trash2, Check } from 'lucide-react';
import { ProjectAccess, AccessRole, User } from '@/types';

interface ProjectSharingModalProps {
  projectId: string;
  projectName: string;
  access: ProjectAccess[];
  currentUser: User;
  onAddAccess: (email: string, role: AccessRole) => void;
  onRemoveAccess: (accessId: string) => void;
  onChangeRole: (accessId: string, role: AccessRole) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ROLE_DESCRIPTIONS: Record<AccessRole, string> = {
  OWNER: 'Controle total do projeto',
  EDITOR: 'Pode criar e editar tarefas',
  COMMENTER: 'Pode comentar e visualizar',
  VIEWER: 'Apenas leitura',
};

const ROLE_COLORS: Record<AccessRole, string> = {
  OWNER: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  EDITOR: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  COMMENTER: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  VIEWER: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
};

export default function ProjectSharingModal({
  projectId,
  projectName,
  access,
  currentUser,
  onAddAccess,
  onRemoveAccess,
  onChangeRole,
  isOpen,
  onClose,
}: ProjectSharingModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AccessRole>('VIEWER');
  const [copied, setCopied] = useState(false);

  const handleAddAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onAddAccess(email, role);
      setEmail('');
      setRole('VIEWER');
    }
  };

  const shareLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/projects/${projectId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Compartilhar "{projectName}"
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Copy link section */}
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
              Link de compartilhamento
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-grow rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Add access form */}
          <form onSubmit={handleAddAccess} className="space-y-3">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Adicionar pessoas
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@exemplo.com"
                className="flex-grow rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AccessRole)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                <option value="VIEWER">Visualizador</option>
                <option value="COMMENTER">Comentarista</option>
                <option value="EDITOR">Editor</option>
              </select>
              <button
                type="submit"
                disabled={!email.trim()}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
              >
                Adicionar
              </button>
            </div>
          </form>

          {/* Current access list */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Acesso atual ({access.length})
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {access.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {item.user?.email || 'Usuário'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {ROLE_DESCRIPTIONS[item.role]}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.userId !== currentUser.id && (
                      <>
                        <select
                          value={item.role}
                          onChange={(e) => onChangeRole(item.id, e.target.value as AccessRole)}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        >
                          <option value="VIEWER">Visualizador</option>
                          <option value="COMMENTER">Comentarista</option>
                          <option value="EDITOR">Editor</option>
                        </select>

                        <button
                          onClick={() => onRemoveAccess(item.id)}
                          className="text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {item.userId === currentUser.id && (
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${ROLE_COLORS[item.role]}`}>
                        {item.role === 'OWNER' ? 'Você (Proprietário)' : `Você (${item.role})`}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
