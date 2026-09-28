'use client';

import React, { useState, useEffect } from 'react';
import { CMSBlog } from '@/lib/cms/content.service';
import { Plus, Edit3, Trash2, CheckCircle, BookOpen, X, Save } from 'lucide-react';

const CATEGORIES = [
  'CCTV',
  'Networking',
  'Solar',
  'Digital',
  'IT',
  'Infrastructure',
  'Real Estate',
  'Technology',
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<CMSBlog[]>([]);
  const [editingBlog, setEditingBlog] = useState<Partial<CMSBlog> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      if (res.ok) {
        const json = await res.json();
        if (json.success) setBlogs(json.blogs);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBlog),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setEditingBlog(null);
        fetchBlogs();
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch {
      // Non-blocking
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchBlogs();
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
            Engineering Blog & Technical Articles
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Author and publish SEO-optimized technical guides across 8 official categories.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingBlog({
              title: '',
              slug: '',
              category: 'CCTV',
              excerpt: '',
              content: '',
              author: 'PPAB Engineering Desk',
              readTime: '4 min read',
              status: 'PUBLISHED',
              tags: ['Engineering'],
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition-all shadow-md shadow-gold-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Article updated and published successfully.</span>
        </div>
      )}

      {/* Blogs Table */}
      <div className="rounded-2xl bg-navy-900/60 border border-navy-800/80 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/60 border-b border-navy-800 text-slate-400 uppercase font-mono text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Title & Slug</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Author</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Published</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="py-3.5 px-4 max-w-sm">
                    <span className="font-semibold text-white block text-sm">{b.title}</span>
                    <span className="text-[11px] text-gold-400/80 font-mono">/blog/{b.slug}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-navy-800 text-gold-400 font-medium">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{b.author}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        b.status === 'PUBLISHED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(b.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingBlog(b)}
                        className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 transition-colors"
                        title="Edit Article"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 rounded-lg bg-navy-800 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {editingBlog && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-navy-900 border border-navy-700 p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-navy-800">
              <h2 className="text-xl font-bold">
                {editingBlog.id ? 'Edit Article' : 'Write New Article'}
              </h2>
              <button
                onClick={() => setEditingBlog(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={editingBlog.title || ''}
                  onChange={(e) =>
                    setEditingBlog({
                      ...editingBlog,
                      title: e.target.value,
                      slug:
                        editingBlog.slug ||
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, ''),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Slug (URL Key)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBlog.slug || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={editingBlog.category || 'CCTV'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Excerpt (SEO meta description snippet)
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingBlog.excerpt || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full p-3 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Article Body (Markdown Supported)
                </label>
                <textarea
                  rows={8}
                  required
                  value={editingBlog.content || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full p-3 rounded-xl bg-navy-950 border border-navy-700 text-white font-mono text-xs focus:ring-2 focus:ring-gold-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Status</label>
                  <select
                    value={editingBlog.status || 'PUBLISHED'}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Author</label>
                  <input
                    type="text"
                    value={editingBlog.author || 'PPAB Engineering Desk'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Read Time</label>
                  <input
                    type="text"
                    value={editingBlog.readTime || '4 min read'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-800">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs shadow-md shadow-gold-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
