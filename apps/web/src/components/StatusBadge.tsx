import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface BadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const VerificationBadge: React.FC<BadgeProps> = ({ status, size = 'sm' }) => {
  switch (status) {
    case 'VERIFIED_OFFICIAL':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 ${
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified Official Portal
        </span>
      );
    case 'PARTNER_FEED':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 ${
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Partner Job Feed
        </span>
      );
    case 'COMMUNITY_REPORTED':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 ${
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Community Reported
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ${
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Unverified Listing
        </span>
      );
  }
};

export const EligibilityBadge: React.FC<BadgeProps> = ({ status, size = 'sm' }) => {
  switch (status) {
    case 'ELIGIBLE':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300 border border-green-200 dark:border-green-800 ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
          Verified Eligible
        </span>
      );
    case 'POTENTIALLY_ELIGIBLE':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          Potentially Eligible
        </span>
      );
    case 'NEEDS_CONFIRMATION':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200 dark:border-sky-800 ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          Needs Confirmation
        </span>
      );
    case 'INELIGIBLE':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          }`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          Ineligible (Requirement Mismatch)
        </span>
      );
    default:
      return null;
  }
};

export const ApplicationStatusBadge: React.FC<BadgeProps> = ({ status, size = 'sm' }) => {
  const configs: Record<string, { label: string; color: string }> = {
    INTERESTED: { label: 'Bookmarked', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300' },
    PREPARING: { label: 'Preparing', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
    READY_TO_APPLY: { label: 'Ready to Apply', color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' },
    APPLIED: { label: 'Applied', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
    ASSESSMENT: { label: 'Online Assessment', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
    INTERVIEW: { label: 'Interview Scheduled', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
    OFFER: { label: 'Offer Received 🎉', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' },
    REJECTED: { label: 'Rejected', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
    WITHDRAWN: { label: 'Withdrawn', color: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200' },
  };

  const c = configs[status] || { label: status, color: 'bg-slate-100 text-slate-700' };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${c.color} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      }`}
    >
      <Clock className="w-3 h-3" />
      {c.label}
    </span>
  );
};
