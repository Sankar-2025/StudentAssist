import React, { useEffect, useState } from 'react';
import {
  Bell,
  CheckCheck,
  Sparkles,
  Calendar,
  Map,
  Info,
  Sliders,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [category, setCategory] = useState('ALL');
  const [preferences, setPreferences] = useState<any>({
    emailAlerts: true,
    pushAlerts: true,
    matchAlerts: true,
    deadlineAlerts: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  });
  const [pushStatus, setPushStatus] = useState<any>({ configured: false, notes: '' });
  const [isSavingPref, setIsSavingPref] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotificationsData = async () => {
    try {
      const [notifRes, prefRes, pushRes]: any = await Promise.all([
        api.get('/notifications'),
        api.get('/notifications/preferences'),
        api.get('/notifications/push-status'),
      ]);

      if (notifRes.success) {
        setNotifications(notifRes.notifications);
        setUnreadCount(notifRes.unreadCount);
      }
      if (prefRes.success && prefRes.preferences) {
        setPreferences(prefRes.preferences);
      }
      if (pushRes.success) {
        setPushStatus(pushRes);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationsData();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPref(true);
    try {
      await api.put('/notifications/preferences', preferences);
      alert('Notification preferences updated!');
    } catch (err: any) {
      alert(err.message || 'Failed to update preferences');
    } finally {
      setIsSavingPref(false);
    }
  };

  const filteredNotifications =
    category === 'ALL'
      ? notifications
      : notifications.filter((n) => n.category === category);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Notification & Alert Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time alerts for verified opportunities matching your skills, upcoming deadlines, and roadmap milestones.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition flex items-center gap-1.5 self-start"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Notifications Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['ALL', 'MATCH', 'DEADLINE', 'ROADMAP', 'SYSTEM'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  category === cat
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 text-xs ${
                  n.isRead
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    : 'bg-brand-50/40 dark:bg-brand-950/20 border-brand-300 dark:border-brand-800 shadow-sm'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {n.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-semibold uppercase text-slate-500">
                      {n.category}
                    </span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-brand-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.createdAt).toLocaleDateString()} at{' '}
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                No notifications in this category.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Preferences & Web Push Architecture Status */}
        <div className="space-y-6">
          {/* Preferences Form */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-600" />
              Alert Frequency & Subscriptions
            </h3>

            <form onSubmit={handleSavePreferences} className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Matching Opportunities Alerts</span>
                <input
                  type="checkbox"
                  checked={preferences.matchAlerts}
                  onChange={(e) => setPreferences({ ...preferences, matchAlerts: e.target.checked })}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Upcoming Deadline Alerts</span>
                <input
                  type="checkbox"
                  checked={preferences.deadlineAlerts}
                  onChange={(e) => setPreferences({ ...preferences, deadlineAlerts: e.target.checked })}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Email Notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.emailAlerts}
                  onChange={(e) => setPreferences({ ...preferences, emailAlerts: e.target.checked })}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              </label>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-500">Quiet Hours:</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400">Start (e.g. 22:00)</label>
                    <input
                      type="text"
                      value={preferences.quietHoursStart || ''}
                      onChange={(e) => setPreferences({ ...preferences, quietHoursStart: e.target.value })}
                      className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400">End (e.g. 08:00)</label>
                    <input
                      type="text"
                      value={preferences.quietHoursEnd || ''}
                      onChange={(e) => setPreferences({ ...preferences, quietHoursEnd: e.target.value })}
                      className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingPref}
                className="w-full py-2 font-bold rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition shadow-sm"
              >
                {isSavingPref ? 'Saving...' : 'Save Preferences'}
              </button>
            </form>
          </div>

          {/* Web Push Architecture Transparency Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Web Push Delivery Architecture
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              {pushStatus.configured
                ? 'Server-side VAPID key pairs are active. Background push notifications to registered service workers enabled.'
                : 'Local in-app notifications are active. To enable system-level background push when browser is closed, add VAPID keys to .env.'}
            </p>
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500">
              Status: {pushStatus.configured ? 'VAPID ACTIVE' : 'IN-APP POLLING ACTIVE'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
