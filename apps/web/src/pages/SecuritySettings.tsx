import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  KeyRound,
  Download,
  Trash2,
  Lock,
  History,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const SecuritySettings: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res: any = await api.get('/privacy/audit-logs');
        if (res.success && res.logs) {
          setAuditLogs(res.logs);
        }
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      }
    };
    fetchAuditLogs();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (newPassword !== confirmPassword) {
      setPassMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 8) {
      setPassMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    setIsChangingPass(true);
    try {
      const res: any = await api.post('/privacy/change-password', {
        currentPassword,
        newPassword,
      });

      if (res.success) {
        setPassMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setPassMessage({ type: 'error', text: err.message || 'Failed to change password' });
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res: any = await api.get('/privacy/export-data');
      if (res.success) {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `studentassist_data_export_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (err: any) {
      alert(err.message || 'Data export failed');
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) return;

    setIsDeleting(true);
    try {
      const res: any = await api.delete('/privacy/delete-account', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (res.success) {
        alert('Your account and all associated data have been permanently removed.');
        await logout();
        navigate('/register');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Shield className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          Security, Privacy & Audit Trail
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your password credentials, review authenticated audit events, and download or purge your personal data.
        </p>
      </div>

      {/* Change Password Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-brand-600" />
          Update Account Password
        </h2>

        {passMessage && (
          <div
            className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              passMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {passMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span>{passMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
          <div>
            <label className="block text-slate-500 mb-1 font-semibold">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-semibold">New Password (min 8 characters)</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-semibold">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPass}
            className="px-4 py-2 font-bold rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
          >
            {isChangingPass ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* GDPR Data Portability & Export */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-500" />
          GDPR Data Portability & Complete Export
        </h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Download a machine-readable JSON archive containing all your personal data stored on StudentAssist, including your profile, tracked applications, interview practice transcripts, resumes, and audit history.
        </p>
        <button
          onClick={handleExportData}
          className="px-4 py-2 font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition inline-flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-emerald-500" />
          Download Personal Data (JSON)
        </button>
      </div>

      {/* Security Audit Trail */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-500" />
          Recent Account Security Events (Audit Trail)
        </h2>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {log.eventType}
                </span>
                <p className="text-[11px] text-slate-400">
                  {log.ipAddress ? `IP: ${log.ipAddress}` : 'Session event'}
                </p>
              </div>
              <span className="text-[11px] text-slate-400">
                {new Date(log.createdAt).toLocaleDateString()} at{' '}
                {new Date(log.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
          {auditLogs.length === 0 && (
            <p className="text-slate-400 py-3">No audit records found.</p>
          )}
        </div>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3 text-xs">
        <h2 className="text-sm font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          Danger Zone — Permanently Delete Account
        </h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Deleting your account will immediately purge all your resumes, application tracking pipelines, interview scores, and personal records from our database. This action cannot be reversed.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition inline-flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Permanently Delete My Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Confirm Account Deletion
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Please enter your current account password to confirm permanent deletion of all your data.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Password Confirmation</label>
                <input
                  type="password"
                  required
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeleting || !deletePassword}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold disabled:opacity-40"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm & Delete Everything'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
