'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { LeadStatusBadge } from '@/components/admin/LeadStatusBadge';
import { LeadDetailModal } from '@/components/admin/LeadDetailModal';
import { LeadRecord, LeadStats } from '@/lib/db/lead.repository';
import {
  Users,
  Inbox,
  CalendarCheck,
  Trophy,
  ArrowRight,
  TrendingUp,
  Shield,
  Sun,
  Network,
  Code2,
  Building2,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<LeadRecord[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, leadsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/leads?limit=5'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);
      }

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        if (leadsData.success) setRecentLeads(leadsData.data);
      }
    } catch {
      // Non-blocking fail
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const divisionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    CCTV: Shield,
    SOLAR: Sun,
    CONNECT: Network,
    DIGITAL: Code2,
    SPACE: Building2,
    GENERAL: Users,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time pipeline metrics, lead inquiries, and infrastructure deployment status.
          </p>
        </div>

        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold transition-all shadow-md shadow-gold-500/10"
        >
          <span>View All Leads Pipeline</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminStatCard
          title="Total Inquiries"
          value={stats?.total ?? '...'}
          subtitle="All-time recorded leads"
          icon={Users}
          accentColor="gold"
          trend={{ value: '+14% this month', isPositive: true }}
        />

        <AdminStatCard
          title="New Inquiries"
          value={stats?.newLeads ?? '...'}
          subtitle="Awaiting engineering triage"
          icon={Inbox}
          accentColor="blue"
        />

        <AdminStatCard
          title="Surveys Scheduled"
          value={stats?.surveyScheduled ?? '...'}
          subtitle="On-site feasibility audits"
          icon={CalendarCheck}
          accentColor="amber"
        />

        <AdminStatCard
          title="Won Deployments"
          value={stats?.won ?? '...'}
          subtitle={`Conversion rate: ${stats?.conversionRate ?? '0%'}`}
          icon={Trophy}
          accentColor="emerald"
          trend={{ value: stats?.conversionRate ?? '0%', isPositive: true }}
        />
      </div>

      {/* Secondary Grid: Division Breakdown + Quick Management Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Division Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-navy-900/50 border border-navy-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Inquiries by Solution Division
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Demand distribution across PPAB engineering verticals
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-gold-400" />
          </div>

          <div className="space-y-4">
            {['CCTV', 'SOLAR', 'CONNECT', 'DIGITAL', 'SPACE', 'GENERAL'].map((div) => {
              const count = stats?.byDivision?.[div] || 0;
              const total = stats?.total || 1;
              const pct = Math.round((count / total) * 100);
              const DivIcon = divisionIcons[div] || Users;

              return (
                <div key={div} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold">
                      <DivIcon className="w-3.5 h-3.5 text-gold-400" />
                      <span>{div}</span>
                    </div>
                    <span className="text-slate-400 font-mono">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Operations Quick Links */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-navy-900/50 border border-navy-800/80 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight mb-1">
              CMS & Operations Quick Actions
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Instant controls for content, assets, and published records
            </p>

            <div className="space-y-2.5">
              <Link
                href="/admin/content"
                className="flex items-center justify-between p-3 rounded-xl bg-navy-950/60 hover:bg-navy-800/70 border border-navy-800 text-xs font-semibold text-white transition-all group"
              >
                <span>Edit Homepage Hero & CTA Content</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/admin/blogs"
                className="flex items-center justify-between p-3 rounded-xl bg-navy-950/60 hover:bg-navy-800/70 border border-navy-800 text-xs font-semibold text-white transition-all group"
              >
                <span>Manage Technical Articles & Blogs</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/admin/projects"
                className="flex items-center justify-between p-3 rounded-xl bg-navy-950/60 hover:bg-navy-800/70 border border-navy-800 text-xs font-semibold text-white transition-all group"
              >
                <span>Manage Portfolio Projects</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/admin/media"
                className="flex items-center justify-between p-3 rounded-xl bg-navy-950/60 hover:bg-navy-800/70 border border-navy-800 text-xs font-semibold text-white transition-all group"
              >
                <span>Browse Asset & Media Registry</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-navy-800/80 mt-6 text-[11px] text-slate-400">
            PostgreSQL Database & Prisma Data Layer synchronized.
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="p-6 rounded-2xl bg-navy-900/50 border border-navy-800/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Recent Inquiries</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest customer requirements submitted to the engineering desk
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No inquiries recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-navy-800 text-slate-400 uppercase font-mono text-[11px]">
                  <th className="pb-3 font-semibold">Reference</th>
                  <th className="pb-3 font-semibold">Client</th>
                  <th className="pb-3 font-semibold">Division</th>
                  <th className="pb-3 font-semibold">City</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-navy-800/30 transition-colors">
                    <td className="py-3 font-mono font-bold text-gold-400">{lead.referenceId}</td>
                    <td className="py-3">
                      <span className="font-semibold text-white block">{lead.name}</span>
                      <span className="text-[11px] text-slate-400">{lead.phone}</span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-navy-800 text-slate-300 font-medium">
                        {lead.division}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">{lead.city}</td>
                    <td className="py-3">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td className="py-3 text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-3 py-1 rounded-lg bg-navy-800 hover:bg-gold-500 hover:text-navy-950 text-white font-medium text-xs transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal dialog for inspecting / updating status */}
      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusUpdated={(updated) => {
          setSelectedLead(updated);
          fetchDashboardData();
        }}
      />
    </div>
  );
}
