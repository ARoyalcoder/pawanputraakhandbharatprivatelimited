'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_NAV_ITEMS } from './AdminSidebar';
import { useAdminAuth } from '@/lib/auth/admin-auth';
import { X, LogOut, ExternalLink } from 'lucide-react';

interface AdminMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminMobileDrawer: React.FC<AdminMobileDrawerProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-50 lg:hidden flex"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative flex flex-col w-72 max-w-[85vw] bg-navy-900 border-r border-navy-800 text-white p-5 shadow-2xl z-10">
        <div className="flex items-center justify-between pb-5 border-b border-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-extrabold text-xs">
              PPAB
            </div>
            <span className="text-sm font-bold text-white">Admin Menu</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav list */}
        <nav className="flex-1 py-5 space-y-1 overflow-y-auto">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gold-500 text-navy-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-navy-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile & actions */}
        <div className="pt-4 border-t border-navy-800 space-y-3">
          <Link
            href="/"
            target="_blank"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-navy-400 hover:text-gold-400 hover:bg-navy-800 transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {user && (
            <div className="p-2.5 rounded-xl bg-navy-950/60 border border-navy-800 text-xs">
              <p className="font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-navy-400 truncate">{user.email}</p>
            </div>
          )}

          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
