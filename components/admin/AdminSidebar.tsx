'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/auth/admin-auth';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Image,
  FileEdit,
  BookOpen,
  FolderKanban,
  ExternalLink,
  LogOut,
  ShieldAlert,
} from 'lucide-react';

export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Leads Pipeline', href: '/admin/leads', icon: Users },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Media Library', href: '/admin/media', icon: Image },
  { label: 'Content CMS', href: '/admin/content', icon: FileEdit },
  { label: 'Articles & Blog', href: '/admin/blogs', icon: BookOpen },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-navy-900 border-r border-navy-800 text-white min-h-screen p-5 select-none">
      {/* Brand Header */}
      <div className="pb-6 border-b border-navy-800">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-extrabold text-sm group-hover:scale-105 transition-all">
            PPAB
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide group-hover:text-gold-400 transition-colors">
              Admin Portal
            </h1>
            <p className="text-[10px] text-navy-400 font-mono">Pawan Putra Enterprise</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 space-y-1.5" aria-label="Admin Navigation">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gold-500 text-navy-950 font-bold shadow-md shadow-gold-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-navy-950' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="pt-4 border-t border-navy-800 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-navy-400 hover:text-gold-400 hover:bg-navy-800 transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {user && (
          <div className="p-3 rounded-xl bg-navy-950/60 border border-navy-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-gold-400 text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-navy-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
