'use client';

import React from 'react';
import { Menu, Bell, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '@/lib/auth/admin-auth';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileMenu,
  title = 'Management Console',
  subtitle,
}) => {
  const { user } = useAdminAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-4 bg-navy-950/80 backdrop-blur-md border-b border-navy-800/80">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-xl bg-navy-900 border border-navy-700/80 text-white hover:bg-navy-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Systems Operational</span>
        </div>

        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-navy-800">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 text-xs font-bold">
              {user.name.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-white hidden md:inline-block">
              {user.name}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
