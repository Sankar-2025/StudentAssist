import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  Plus,
  Kanban,
  ListFilter,
  Calendar,
  ExternalLink,
  Clock,
  History,
  Trash2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { ApplicationStatusBadge } from '../components/StatusBadge';

const STAGES = [
  { id: 'INTERESTED', label: 'Bookmarked', color: 'border-slate-300' },
  { id: 'PREPARING', label: 'Preparing', color: 'border-purple-400' },
  { id: 'READY_TO_APPLY', label: 'Ready to Apply', color: 'border-cyan-400' },
  { id: 'APPLIED', label: 'Applied', color: 'border-blue-400' },
  { id: 'ASSESSMENT', label: 'Online Assessment', color: 'border-indigo-400' },
  { id: 'INTERVIEW', label: 'Interview Scheduled', color: 'border-amber-400' },
  { id: 'OFFER', label: 'Offer Received 🎉', color: 'border-emerald-500' },
  { id: 'REJECTED', label: 'Rejected', color: 'border-rose-400' },
  { id: 'WITHDRAWN', label: 'Withdrawn', color: 'border-slate-300' },
] as const;

export const ApplicationTracker: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, byStatus: {}, inProgress: 0, offers: 0 });
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppForHistory, setSelectedAppForHistory] = useState<any>(null);

  // Form state
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newStatus, setNewStatus] = useState<string>('INTERESTED');
  const [newDeadline, setNewDeadline] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const [appRes, statRes]: any = await Promise.all([
        api.get('/applications'),
        api.get('/applications/stats'),
      ]);
      if (appRes.success) setApplications(appRes.applications);
      if (statRes.success) setStats(statRes.stats);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    try {
      const res: any = await api.post('/applications', {
        companyName: newCompany.trim(),
        roleTitle: newRole.trim(),
        applicationUrl: newUrl.trim() || undefined,
        status: newStatus,
        deadline: newDeadline || undefined,
        notes: newNotes.trim() || undefined,
      });

      if (res.success) {
        setShowAddModal(false);
        setNewCompany('');
        setNewRole('');
        setNewUrl('');
        setNewDeadline('');
        setNewNotes('');
        fetchApplications();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create application');
    }
  };

  const handleMoveStatus = async (appId: string, targetStatus: string) => {
    try {
      await api.put(`/applications/${appId}`, {
        status: targetStatus,
        statusNote: `Shifted to ${targetStatus} stage`,
      });
      fetchApplications();
    } catch (err: any) {
      alert(err.message || 'Failed to update application status');
    }
  };

  const handleDelete = async (appId: string) => {
    if (!window.confirm('Are you sure you want to delete this tracked application?')) return;
    try {
      await api.delete(`/applications/${appId}`);
      fetchApplications();
    } catch (err: any) {
      alert(err.message || 'Failed to delete application');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Application Pipeline Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Track interview timelines, online assessments, offers, and notes. No false claims of automated external submissions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View mode toggle */}
          <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              List
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Track New Application
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
          <span className="text-slate-400 font-medium">Total Tracked</span>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100">{stats.total || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
          <span className="text-slate-400 font-medium">Active Pipeline</span>
          <p className="text-xl font-black text-brand-600 dark:text-brand-400">{stats.inProgress || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
          <span className="text-slate-400 font-medium">Interviews</span>
          <p className="text-xl font-black text-amber-500">{stats.byStatus?.INTERVIEW || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
          <span className="text-slate-400 font-medium">Offers Received 🎉</span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{stats.offers || 0}</p>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {STAGES.map((stage) => {
            const stageApps = applications.filter((a) => a.status === stage.id);

            return (
              <div
                key={stage.id}
                className="w-72 flex-shrink-0 flex flex-col rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 max-h-[750px] overflow-hidden"
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {stage.label}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {stageApps.length}
                    </span>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="p-3 space-y-3 overflow-y-auto flex-1">
                  {stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 hover:shadow-md transition text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="truncate">
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 block truncate">
                            {app.companyName}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                            {app.roleTitle}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                          title="Delete application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {app.deadline && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            Deadline: {new Date(app.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {app.notes && (
                        <p className="p-2 rounded bg-slate-50 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                          {app.notes}
                        </p>
                      )}

                      {/* Stage Mover Selector */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                        <select
                          value={app.status}
                          onChange={(e) => handleMoveStatus(app.id, e.target.value)}
                          className="text-[11px] font-semibold rounded p-1 border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => setSelectedAppForHistory(app)}
                          className="text-slate-400 hover:text-brand-600 p-1"
                          title="View status history log"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {stageApps.length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-xs italic">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {applications.map((app) => (
            <div key={app.id} className="py-3 flex items-center justify-between gap-4">
              <div className="truncate space-y-0.5">
                <p className="font-bold text-slate-900 dark:text-slate-100">{app.companyName}</p>
                <p className="text-slate-500 text-[11px]">{app.roleTitle}</p>
              </div>

              <div className="flex items-center gap-3">
                <ApplicationStatusBadge status={app.status} />
                <button
                  onClick={() => setSelectedAppForHistory(app)}
                  className="text-slate-400 hover:text-brand-600 p-1"
                  title="View history"
                >
                  <History className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {applications.length === 0 && (
            <div className="p-8 text-center text-slate-400">No applications tracked yet.</div>
          )}
        </div>
      )}

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Track New Internship Opportunity
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Google, Microsoft, Datadog"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Software Engineering Intern"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Application URL</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://careers.google.com/..."
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Initial Stage</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Personal Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Notes on recruiter contact, referral, or prep status..."
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-600 text-white font-bold"
                >
                  Save & Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status History Modal */}
      {selectedAppForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <History className="w-4 h-4 text-brand-600" />
                Status History: {selectedAppForHistory.companyName}
              </h3>
              <button onClick={() => setSelectedAppForHistory(null)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-60 overflow-y-auto">
              {(selectedAppForHistory.statusHistory || []).map((h: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {h.fromStatus ? `${h.fromStatus} → ` : ''}{h.toStatus}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(h.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  {h.note && <p className="text-slate-600 dark:text-slate-400">{h.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
