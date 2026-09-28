'use client';

import React, { useState, useEffect } from 'react';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { BarChart3, Activity, ArrowUpRight, MousePointerClick, CheckCircle } from 'lucide-react';

interface TelemetryRecord {
  id: string;
  event: string;
  payload?: Record<string, unknown>;
  createdAt: string;
}

interface AnalyticsData {
  summary?: {
    totalEvents?: number;
    counts?: Record<string, number>;
    divisionCounts?: Record<string, number>;
  };
  recentEvents?: TelemetryRecord[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch('/api/admin/analytics');
        if (res.ok) {
          const json = await res.json();
          if (json.success) setData(json.data);
        }
      } catch {
        // Non-blocking
      } finally {
        setIsLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const counts = data?.summary?.counts || {};
  const divisionCounts = data?.summary?.divisionCounts || {};
  const recentEvents = data?.recentEvents || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-navy-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Privacy-Conscious Analytics & Attribution
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Tracking business conversions, channel attribution, and solution interest without harvesting personal identifiers.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminStatCard
          title="Total Events Logged"
          value={data?.summary?.totalEvents ?? 0}
          subtitle="Interaction data points"
          icon={Activity}
          accentColor="blue"
        />

        <AdminStatCard
          title="Page Views"
          value={counts['page_view'] || 0}
          subtitle="Across all public routes"
          icon={BarChart3}
          accentColor="gold"
        />

        <AdminStatCard
          title="CTA Interactions"
          value={counts['cta_click'] || 0}
          subtitle="Buttons & consultation triggers"
          icon={MousePointerClick}
          accentColor="amber"
        />

        <AdminStatCard
          title="Form Conversions"
          value={
            (counts['contact_form_submit'] || 0) +
            (counts['cctv_lead_submit'] || 0) +
            (counts['solar_lead_submit'] || 0) +
            (counts['connect_lead_submit'] || 0) +
            (counts['digital_lead_submit'] || 0) +
            (counts['space_lead_submit'] || 0)
          }
          subtitle="Direct sales inquiries"
          icon={CheckCircle}
          accentColor="emerald"
        />
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Event Type Distribution */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-navy-900/60 border border-navy-800/80">
          <h2 className="text-base font-bold text-white mb-4">Event Frequency by Action</h2>
          <div className="space-y-3">
            {Object.entries(counts).map(([ev, count]) => (
              <div key={ev} className="flex items-center justify-between text-xs py-2 border-b border-navy-800/50">
                <span className="font-mono text-slate-300">{ev}</span>
                <span className="font-bold text-gold-400">{String(count)}</span>
              </div>
            ))}
            {Object.keys(counts).length === 0 && (
              <p className="text-xs text-slate-400">No events logged yet. Visit pages to generate telemetry.</p>
            )}
          </div>
        </div>

        {/* Right: Division Attribution */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-navy-900/60 border border-navy-800/80">
          <h2 className="text-base font-bold text-white mb-4">Division Interest Distribution</h2>
          <div className="space-y-3">
            {Object.entries(divisionCounts).map(([div, count]) => (
              <div key={div} className="flex items-center justify-between text-xs py-2 border-b border-navy-800/50">
                <span className="font-semibold text-slate-200">{div}</span>
                <span className="font-bold text-emerald-400">{String(count)} events</span>
              </div>
            ))}
            {Object.keys(divisionCounts).length === 0 && (
              <p className="text-xs text-slate-400">Division interest metrics will display here as visitors browse.</p>
            )}
          </div>
        </div>
      </div>

      {/* Stream */}
      <div className="p-6 rounded-2xl bg-navy-900/60 border border-navy-800/80">
        <h2 className="text-base font-bold text-white mb-4">Recent Event Stream (Telemetry Log)</h2>
        <div className="max-h-72 overflow-y-auto space-y-2 font-mono text-xs">
          {recentEvents.map((e: TelemetryRecord) => (
            <div key={e.id} className="p-2.5 rounded-lg bg-navy-950/60 border border-navy-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-gold-400 font-bold">{e.event}</span>
                <span className="text-slate-400 text-[11px] truncate max-w-xs">{JSON.stringify(e.payload)}</span>
              </div>
              <span className="text-[10px] text-navy-400">{new Date(e.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
          {recentEvents.length === 0 && (
            <p className="text-slate-400 text-xs py-4 text-center">No telemetry recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
