import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { LeadStatusBadge } from '@/components/admin/LeadStatusBadge';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { LeadDetailModal } from '@/components/admin/LeadDetailModal';
import { AdminAuthProvider } from '@/lib/auth/admin-auth';
import { Users } from 'lucide-react';
import { LeadRecord } from '@/lib/db/lead.repository';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/admin',
}));

const MOCK_LEAD: LeadRecord = {
  id: 'lead-test-1',
  referenceId: 'PPAB-2026-TEST1',
  division: 'CCTV',
  service: 'AI Surveillance',
  status: 'NEW',
  name: 'Test Client',
  email: 'client@test.com',
  phone: '+919988776655',
  city: 'Lucknow',
  requirement: 'Needs 32 cameras.',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Module 20: Admin Dashboard Components', () => {
  it('renders AdminStatCard with metrics and trend indicator', () => {
    render(
      <AdminStatCard
        title="Total Inquiries"
        value={128}
        subtitle="Year to date"
        icon={Users}
        accentColor="gold"
        trend={{ value: '+12%', isPositive: true }}
      />
    );

    expect(screen.getByText('Total Inquiries')).toBeDefined();
    expect(screen.getByText('128')).toBeDefined();
    expect(screen.getByText('+12%')).toBeDefined();
  });

  it('renders LeadStatusBadge for all 7 pipeline statuses', () => {
    const statuses = [
      'NEW',
      'CONTACTED',
      'SURVEY_SCHEDULED',
      'QUOTATION_SENT',
      'NEGOTIATION',
      'WON',
      'LOST',
    ] as const;

    for (const status of statuses) {
      const { unmount } = render(<LeadStatusBadge status={status} />);
      expect(document.querySelector('span')).not.toBeNull();
      unmount();
    }
  });

  it('renders AdminSidebar with complete navigation links', async () => {
    await act(async () => {
      render(
        <AdminAuthProvider>
          <AdminSidebar />
        </AdminAuthProvider>
      );
    });

    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Leads Pipeline')).toBeDefined();
    expect(screen.getByText('Analytics')).toBeDefined();
    expect(screen.getByText('Media Library')).toBeDefined();
    expect(screen.getByText('Content CMS')).toBeDefined();
    expect(screen.getByText('Articles & Blog')).toBeDefined();
    expect(screen.getByText('Projects')).toBeDefined();
  });

  it('renders LeadDetailModal with customer information and status selector', () => {
    render(
      <LeadDetailModal
        lead={MOCK_LEAD}
        onClose={() => {}}
        onStatusUpdated={() => {}}
      />
    );

    expect(screen.getByText('Test Client')).toBeDefined();
    expect(screen.getByText('PPAB-2026-TEST1')).toBeDefined();
    expect(screen.getByText('Needs 32 cameras.')).toBeDefined();
    expect(screen.getByLabelText(/Pipeline Lifecycle Status/i)).toBeDefined();
  });
});
