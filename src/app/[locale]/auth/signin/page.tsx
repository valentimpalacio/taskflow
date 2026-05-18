'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { CheckSquare, Mail, Lock, AlertCircle, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

function SignInForm() {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(() => searchParams?.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  // Sync email from URL on mount (covers locale-switch navigation)
  useEffect(() => {
    const urlEmail = searchParams?.get('email');
    if (urlEmail) setEmail(urlEmail);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) setError(t('invalidCredentials'));
    else router.push('/');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-50 dark:from-slate-900 dark:via-primary-950/20 dark:to-slate-900 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-200/30 dark:bg-primary-800/10 blur-3xl particle-float-1" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary-300/20 dark:bg-primary-700/10 blur-3xl particle-float-2" />
        <div className="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-primary-400/30 dark:bg-primary-500/20 blur-sm particle-float-3" />
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-primary-400/20 dark:bg-primary-500/15 blur-sm particle-float-1" style={{ animationDelay: '1s' }} />
      </div>

      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        {mounted && (
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-slate-700/30 shadow-lg text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}
        <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md p-1 rounded-xl border border-white/20 dark:border-slate-700/30 shadow-lg">
          <LanguageSwitcher extraSearchParams={email ? { email } : undefined} />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/30 pulse-glow">
            <CheckSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {t('welcomeBack')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5">{t('signinSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/50 p-7 shadow-xl shadow-slate-200/50 dark:shadow-black/20 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder={t('minCharacters')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded-xl px-4 py-3 border border-red-100 dark:border-red-800/30">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/45 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {t('signin')}
          </button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {t('noAccount')}{' '}
            <Link href='/auth/signup' className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold hover:underline">
              {t('signup')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}