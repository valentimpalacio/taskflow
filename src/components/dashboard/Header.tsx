'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '../LanguageSwitcher';
import { Link as NavLink } from '@/i18n/navigation';
import { LogOut, User, Moon, Sun, CheckSquare } from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();
  const t = useTranslations('header');
  const locale = useLocale();
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/30 shadow-sm shadow-slate-200/20 dark:shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 pulse-glow">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {t('title')}
              </h1>
              <span className="text-[10px] font-medium text-primary-500 dark:text-primary-400 tracking-widest uppercase leading-none">
                Task Management
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 group"
              aria-label="Toggle dark mode"
            >
              {mounted && dark ? (
                <Sun className="w-4 h-4 group-hover:scale-110 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              )}
            </button>

            {/* User Menu */}
            {session && (
              <>
                <NavLink
                  href="/profile"
                  className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-inner shadow-white/10">
                    <span className="text-sm font-bold text-white">
                      {(session.user?.name || session.user?.email || '?')[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight">
                      {session.user?.name || session.user?.email}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                      {t('profile') || 'Profile'}
                    </p>
                  </div>
                </NavLink>

                <button
                  onClick={() => signOut({ redirect: true, callbackUrl: '/auth/signin' })}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all group"
                >
                  <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">{t('logout')}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}