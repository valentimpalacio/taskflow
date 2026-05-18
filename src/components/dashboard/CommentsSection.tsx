'use client';

import { useState } from 'react';
import { Send, Trash2, Reply } from 'lucide-react';
import { Comment, User } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';
import { useLocale } from 'next-intl';

interface CommentsSectionProps {
  comments: Comment[];
  currentUser: User;
  onAddComment: (content: string, mentions?: string[]) => void;
  onDeleteComment: (id: string) => void;
}

const localeMap = {
  pt: ptBR,
  en: enUS,
  es: es,
};

export default function CommentsSection({
  comments,
  currentUser,
  onAddComment,
  onDeleteComment,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const locale = useLocale() as 'pt' | 'en' | 'es';

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Extract mentions (@username)
      const mentions = Array.from(
        newComment.matchAll(/@(\w+)/g),
        (match) => match[1]
      );

      onAddComment(newComment, mentions.length > 0 ? mentions : undefined);
      setNewComment('');
      setReplyTo(null);
    }
  };

  const renderCommentContent = (content: string) => {
    return content.replace(/@(\w+)/g, '<mark class="bg-yellow-200 dark:bg-yellow-800">@$1</mark>');
  };

  const topLevelComments = comments.filter((c) => !c.parentId);

  return (
    <div className="mt-6 space-y-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
      <h3 className="font-semibold text-slate-900 dark:text-white">
        Comentários ({comments.length})
      </h3>

      <form onSubmit={handleAddComment} className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            replyTo
              ? 'Responder ao comentário... (use @nome para mencionar)'
              : 'Adicionar comentário... (use @nome para mencionar)'
          }
          className="w-full min-h-[80px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Enviar
          </button>
          {replyTo && (
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium dark:border-slate-600"
            >
              Cancelar resposta
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {topLevelComments.map((comment) => (
          <div key={comment.id} className="rounded-lg bg-white p-3 dark:bg-slate-700">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-sm font-bold">
                {comment.user?.name?.[0].toUpperCase() || 'U'}
              </div>

              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {comment.user?.name || 'Usuário'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: localeMap[locale],
                      })}
                    </p>
                  </div>

                  {comment.userId === currentUser.id && (
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <p
                  className="mt-2 text-sm text-slate-700 dark:text-slate-300"
                  dangerouslySetInnerHTML={{
                    __html: renderCommentContent(comment.content),
                  }}
                />

                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="mt-2 flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Reply className="h-3 w-3" />
                  Responder
                </button>
              </div>
            </div>

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 space-y-2 border-l-2 border-slate-200 pl-3 dark:border-slate-600">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="text-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {reply.user?.name || 'Usuário'}
                      </p>
                      {reply.userId === currentUser.id && (
                        <button
                          onClick={() => onDeleteComment(reply.id)}
                          className="text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <p
                      className="mt-1 text-slate-600 dark:text-slate-400"
                      dangerouslySetInnerHTML={{
                        __html: renderCommentContent(reply.content),
                      }}
                    />
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {formatDistanceToNow(new Date(reply.createdAt), {
                        addSuffix: true,
                        locale: localeMap[locale],
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Nenhum comentário ainda. Seja o primeiro a comentar! 💬
        </p>
      )}
    </div>
  );
}
