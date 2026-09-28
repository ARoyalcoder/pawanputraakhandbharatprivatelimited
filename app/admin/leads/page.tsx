'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LeadStatusBadge } from '@/components/admin/LeadStatusBadge';
import { LeadDetailModal } from '@/components/admin/LeadDetailModal';
import { LeadRecord, LeadStatus } from '@/lib/db/lead.repository';
import { Search, Filter, Phone, MessageSquare, RefreshCw } from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [divisionFilter, setDivisionFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (divisionFilter !== 'All') params.set('division', divisionFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('limit', '100');

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setLeads(json.data);
          setTotal(json.total);
        }
      }
    } catch {
      // Non-blocking
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, divisionFilter, searchQuery]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Leads Pipeline & Engineering Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track inquiries, update survey schedules, and manage quotation transitions ({total} total records).
          </p>
        </div>

        <button
          onClick={fetchLeads}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-navy-900 border border-navy-700 hover:bg-navy-800 text-xs font-semibold text-slate-200 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-navy-900/60 border border-navy-800/80 backdrop-blur-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, reference ID, phone, email, organization..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-navy-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              aria-label="Filter by division"
            >
              <option value="All">All Divisions</option>
              <option value="CCTV">CCTV (Secure)</option>
              <option value="SOLAR">Solar</option>
              <option value="CONNECT">Connect (IT)</option>
              <option value="DIGITAL">Digital</option>
              <option value="SPACE">Space</option>
              <option value="GENERAL">General</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              aria-label="Filter by lifecycle status"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New Lead</option>
              <option value="CONTACTED">Contacted</option>
              <option value="SURVEY_SCHEDULED">Survey Scheduled</option>
              <option value="QUOTATION_SENT">Quotation Sent</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition-all"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-navy-900/60 border border-navy-800/80 backdrop-blur-sm overflow-hidden">
        {leads.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-sm font-semibold text-white">No inquiries match the current filter.</p>
            <p className="text-xs mt-1">Try resetting the status or division filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950/60 border-b border-navy-800 text-slate-400 uppercase font-mono text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Reference</th>
                  <th className="py-3.5 px-4 font-semibold">Client / Contact</th>
                  <th className="py-3.5 px-4 font-semibold">Division</th>
                  <th className="py-3.5 px-4 font-semibold">City / Location</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60">
                {leads.map((lead) => {
                  const whatsappPhone = lead.phone.replace(/[^0-9]/g, '');
                  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello ${lead.name}, regarding your inquiry ${lead.referenceId} with Pawan Putra Akhand Bharat...`
                  )}`;

                  return (
                    <tr key={lead.id} className="hover:bg-navy-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-gold-400">
                        {lead.referenceId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white block text-sm">{lead.name}</span>
                        <span className="text-slate-400 block">{lead.phone}</span>
                        {lead.organization && (
                          <span className="text-[11px] text-navy-400 block truncate max-w-[180px]">
                            {lead.organization}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-navy-800 text-slate-200 font-medium">
                          {lead.division}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{lead.city}</td>
                      <td className="py-3.5 px-4">
                        <LeadStatusBadge status={lead.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={`tel:${lead.phone}`}
                            title="Call"
                            className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-gold-400 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="WhatsApp"
                            className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-gold-500 hover:text-navy-950 text-white font-medium transition-all"
                          >
                            Inspect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusUpdated={(updated) => {
          setSelectedLead(updated);
          fetchLeads();
        }}
      />
    </div>
  );
}
