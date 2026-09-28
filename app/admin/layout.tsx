'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminAuthProvider } from '@/lib/auth/admin-auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminMobileDrawer } from '@/components/admin/AdminMobileDrawer';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, render full screen without sidebar
  if (pathname === '/admin/login') {
    return <AdminAuthProvider>{children}</AdminAuthProvider>;
  }

  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-navy-950 flex text-white selection:bg-gold-500 selection:text-navy-950">
        {/* Desktop Collapsible Sidebar */}
        <AdminSidebar />

        {/* Mobile Navigation Drawer */}
        <AdminMobileDrawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader
            onToggleMobileMenu={() => setMobileMenuOpen(true)}
            title="Management Console"
            subtitle="Pawan Putra Akhand Bharat Pvt. Ltd."
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthProvider>
  );
}
