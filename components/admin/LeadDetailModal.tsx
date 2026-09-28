'use client';

import React, { useState } from 'react';
import { LeadRecord, LeadStatus } from '@/lib/db/lead.repository';
import { LeadStatusBadge } from './LeadStatusBadge';
import {
  X,
  Phone,
  MessageSquare,
  Mail,
  Building,
  MapPin,
  Calendar,
  Save,
  CheckCircle,
} from 'lucide-react';

interface LeadDetailModalProps {
  lead: LeadRecord | null;
  onClose: () => void;
  onStatusUpdated: (updatedLead: LeadRecord) => void;
}

const ALL_STATUSES: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'SURVEY_SCHEDULED',
  'QUOTATION_SENT',
  'NEGOTIATION',
  'WON',
  'LOST',
];

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onStatusUpdated,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(lead?.status || 'NEW');
  const [notes, setNotes] = useState<string>(lead?.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!lead) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus, notes }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccess(true);
        onStatusUpdated(data.data);
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        setErrorMsg(data.error || 'Failed to update lead');
      }
    } catch {
      setErrorMsg('Network error while updating lead.');
    } finally {
      setIsSaving(false);
    }
  };

  const whatsappPhone = lead.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello ${lead.name}, this is regarding your inquiry with Pawan Putra Akhand Bharat (Ref: ${lead.referenceId}).`
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-navy-900 border border-navy-700/80 p-6 sm:p-8 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-navy-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-gold-400 font-bold bg-navy-800 px-2 py-0.5 rounded">
                {lead.referenceId}
              </span>
              <LeadStatusBadge status={selectedStatus} />
            </div>
            <h2 id="lead-modal-title" className="text-xl sm:text-2xl font-bold mt-2 text-white">
              {lead.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Division: <span className="text-slate-200 font-medium">{lead.division}</span> &bull; Service: <span className="text-slate-200">{lead.service}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Contact Bar */}
        <div className="my-5 flex flex-wrap items-center gap-3">
          <a
            href={`tel:${lead.phone}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-xs font-semibold text-white transition-all"
          >
            <Phone className="w-4 h-4 text-gold-400" />
            <span>Call: {lead.phone}</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/40 text-xs font-semibold text-emerald-300 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Client</span>
          </a>

          <a
            href={`mailto:${lead.email}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-xs font-semibold text-white transition-all"
          >
            <Mail className="w-4 h-4 text-gold-400" />
            <span>Email</span>
          </a>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 p-4 rounded-xl bg-navy-950/50 border border-navy-800/80 text-xs sm:text-sm">
          <div>
            <span className="text-slate-400 text-xs block">Organization</span>
            <span className="font-medium text-white flex items-center gap-1.5 mt-0.5">
              <Building className="w-3.5 h-3.5 text-navy-400" />
              {lead.organization || 'Not Specified'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-xs block">City / Area</span>
            <span className="font-medium text-white flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-navy-400" />
              {lead.city}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-xs block">Submitted At</span>
            <span className="font-medium text-white flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-navy-400" />
              {new Date(lead.createdAt).toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-xs block">Source Attribution</span>
            <span className="font-medium text-slate-300 mt-0.5 block">
              {lead.source || 'Website Form'}
            </span>
          </div>
        </div>

        {/* Detailed Requirement */}
        <div className="mb-5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Requirement Specifications
          </label>
          <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
            {lead.requirement}
          </div>
        </div>

        {/* Metadata Breakdown if present */}
        {lead.metadata && Object.keys(lead.metadata).length > 0 && (
          <div className="mb-5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Parameters & Technical Metadata
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(lead.metadata).map(([key, value]) => (
                <div key={key} className="p-2.5 rounded-lg bg-navy-950/40 border border-navy-800 text-xs">
                  <span className="text-slate-400 block font-mono text-[11px]">{key}</span>
                  <span className="text-white font-medium truncate block">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Transition Control */}
        <div className="pt-4 border-t border-navy-800 space-y-4">
          <div>
            <label htmlFor="modal-status-select" className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              Pipeline Lifecycle Status
            </label>
            <select
              id="modal-status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as LeadStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-sm focus:ring-2 focus:ring-gold-500/50 focus:outline-none"
            >
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="modal-notes-area" className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              Internal Engineering Notes & Follow-up History
            </label>
            <textarea
              id="modal-notes-area"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add survey notes, quotation reference, follow-up dates..."
              className="w-full p-3 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50 focus:outline-none"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              {errorMsg}
            </p>
          )}

          {saveSuccess && (
            <p className="text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Lead updated successfully.
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-navy-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold tracking-wide transition-all shadow-md shadow-gold-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Update Lead'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
