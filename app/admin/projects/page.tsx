'use client';

import React, { useState, useEffect } from 'react';
import { CMSProject } from '@/lib/cms/content.service';
import { Plus, Edit3, CheckCircle, FolderKanban, X, Save, Star } from 'lucide-react';

const DIVISIONS = ['Secure', 'Connect', 'Solar', 'Digital', 'Space'] as const;

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [editingProj, setEditingProj] = useState<Partial<CMSProject> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const json = await res.json();
        if (json.success) setProjects(json.projects);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj) return;

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProj),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setEditingProj(null);
        fetchProjects();
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch {
      // Non-blocking
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Portfolio Projects & Case Studies
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Showcase enterprise engineering deployments with verified metrics and outcomes.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingProj({
              title: '',
              slug: '',
              division: 'Secure',
              category: 'Surveillance & Security',
              sector: 'Commercial',
              location: 'Lucknow',
              summary: '',
              challenge: '',
              solution: '',
              outcome: '',
              status: 'PUBLISHED',
              featured: false,
              gallery: [],
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition-all shadow-md shadow-gold-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Project case study updated successfully.</span>
        </div>
      )}

      {/* Projects Table */}
      <div className="rounded-2xl bg-navy-900/60 border border-navy-800/80 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/60 border-b border-navy-800 text-slate-400 uppercase font-mono text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Title & Location</th>
                <th className="py-3.5 px-4 font-semibold">Division</th>
                <th className="py-3.5 px-4 font-semibold">Sector</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Featured</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="py-3.5 px-4 max-w-sm">
                    <span className="font-semibold text-white block text-sm">{p.title}</span>
                    <span className="text-[11px] text-slate-400">{p.location}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-navy-800 text-gold-400 font-medium">
                      {p.division}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{p.sector}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {p.featured && (
                      <span className="inline-flex items-center gap-1 text-gold-400 font-medium">
                        <Star className="w-3.5 h-3.5 fill-gold-400" />
                        <span>Featured</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setEditingProj(p)}
                      className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 transition-colors"
                      title="Edit Project"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {editingProj && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-navy-900 border border-navy-700 p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-navy-800">
              <h2 className="text-xl font-bold">
                {editingProj.id ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => setEditingProj(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={editingProj.title || ''}
                  onChange={(e) =>
                    setEditingProj({
                      ...editingProj,
                      title: e.target.value,
                      slug:
                        editingProj.slug ||
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, ''),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={editingProj.slug || ''}
                    onChange={(e) => setEditingProj({ ...editingProj, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Division
                  </label>
                  <select
                    value={editingProj.division || 'Secure'}
                    onChange={(e) =>
                      setEditingProj({
                        ...editingProj,
                        division: e.target.value as (typeof DIVISIONS)[number],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
                  >
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProj.location || ''}
                    onChange={(e) => setEditingProj({ ...editingProj, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Executive Summary
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProj.summary || ''}
                  onChange={(e) => setEditingProj({ ...editingProj, summary: e.target.value })}
                  className="w-full p-3 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    The Challenge
                  </label>
                  <textarea
                    rows={3}
                    value={editingProj.challenge || ''}
                    onChange={(e) => setEditingProj({ ...editingProj, challenge: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    The Solution
                  </label>
                  <textarea
                    rows={3}
                    value={editingProj.solution || ''}
                    onChange={(e) => setEditingProj({ ...editingProj, solution: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    The Outcome
                  </label>
                  <textarea
                    rows={3}
                    value={editingProj.outcome || ''}
                    onChange={(e) => setEditingProj({ ...editingProj, outcome: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProj.featured || false}
                    onChange={(e) => setEditingProj({ ...editingProj, featured: e.target.checked })}
                    className="rounded border-navy-700 text-gold-500 focus:ring-gold-500"
                  />
                  <span>Feature on Homepage and Portfolio Spotlight</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-800">
                <button
                  type="button"
                  onClick={() => setEditingProj(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs shadow-md shadow-gold-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
