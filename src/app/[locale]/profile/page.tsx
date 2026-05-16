'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/dashboard/Header';
import { useToast } from '@/components/dashboard/Toast';
import { User, Mail, Save, LogOut, CheckSquare } from 'lucide-react';

function ProfileContent() {
  const { data: session, status, update: updateSession } = useSession();
  const t = useTranslations('profile');
  const tAuth = useTranslations('auth');
  const [name, setName] = useState(session?.user?.name || '');
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    // Only redirect when CERTAIN the user is unauthenticated.
    // Avoid redirecting during 'loading' — session is null briefly
    // when the SessionProvider remounts after a locale change.
    // We add a small delay to ensure the session has truly settled,
    // because next-auth can briefly report 'unauthenticated' during
    // client-side navigations (like locale switches).
    if (status === 'unauthenticated') {
      const timer = setTimeout(() => {
        router.push('/auth/signin');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  // Keep name field in sync when session loads
  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50/30 dark:from-slate-900 dark:to-primary-950/20">
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-80 rounded-2xl skeleton" />
        </main>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session) {
    return null;
  }


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await updateSession({ name });
        showToast(t('updated'), 'success');
      } else {
        const data = await res.json();
        showToast(data.error || t('updateFailed'), 'error');
      }
    } catch {
      showToast(t('updateFailed'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50/30 dark:from-slate-900 dark:to-primary-950/20">
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-xl shadow-slate-200/30 dark:shadow-black/20 overflow-hidden">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 px-6 py-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative flex items-center gap-5">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner shadow-white/10 ring-2 ring-white/20">
                <span className="text-3xl font-bold text-white drop-shadow-sm">
                  {(session.user?.name || session.user?.email || '?')[0].toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-sm">
                  {session.user?.name || t('noName')}
                </h1>
                <p className="text-primary-100 text-sm mt-0.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {session.user?.email}
                </p>
              </div>
              <div className="ml-auto hidden sm:block">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <CheckSquare className="w-6 h-6 text-white/70" />
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('displayName')}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={session.user?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5 ml-1">{t('emailCannotChange')}</p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-medium rounded-xl disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg shadow-primary-500/20"
              >
                {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {!saving && <Save className="w-4 h-4" />}
                {t('saveChanges')}
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                className="px-6 py-2.5 border border-red-300 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t('signOut')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}