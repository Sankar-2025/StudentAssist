import React from 'react';
import {
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { VerificationBadge, EligibilityBadge } from './StatusBadge';

interface Props {
  internship: any;
  matchScore?: number;
  eligibilityStatus?: string;
  onViewDetails: (internship: any) => void;
  onSaveToggle?: (id: string) => void;
}

export const OpportunityCard: React.FC<Props> = ({
  internship,
  matchScore,
  eligibilityStatus,
  onViewDetails,
  onSaveToggle,
}) => {
  return (
    <div className="group relative flex flex-col justify-between p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/40 shadow-sm hover:shadow-md transition duration-200">
      <div className="space-y-3">
        {/* Top Badges & Actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {internship.companyName}
            </span>
            <VerificationBadge status={internship.verificationStatus} />
            {eligibilityStatus && <EligibilityBadge status={eligibilityStatus} />}
          </div>

          {onSaveToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSaveToggle(internship.id);
              }}
              className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={internship.isSaved ? 'Remove bookmark' : 'Bookmark opportunity'}
            >
              {internship.isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Title & Metadata */}
        <div>
          <h3
            onClick={() => onViewDetails(internship)}
            className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 cursor-pointer transition line-clamp-1"
          >
            {internship.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1.5 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {internship.location} ({internship.workMode})
            </span>
            {internship.stipend && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <DollarSign className="w-3.5 h-3.5" />
                {internship.stipend}
              </span>
            )}
            {internship.deadline && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Deadline:{' '}
                {new Date(internship.deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>

        {/* Match Score Bar if present */}
        {matchScore !== undefined && (
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400">
                <Sparkles className="w-3.5 h-3.5" />
                Readiness Match
              </span>
              <span className="text-slate-800 dark:text-slate-200">{matchScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  matchScore >= 80
                    ? 'bg-emerald-500'
                    : matchScore >= 60
                    ? 'bg-brand-500'
                    : matchScore >= 40
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, matchScore))}%` }}
              />
            </div>
          </div>
        )}

        {/* Skills Preview */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {(internship.requiredSkills || []).slice(0, 4).map((skill: string) => (
            <span
              key={skill}
              className="px-2 py-0.5 text-[11px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
          {(internship.requiredSkills || []).length > 4 && (
            <span className="px-1.5 py-0.5 text-[11px] text-slate-400">
              +{internship.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => onViewDetails(internship)}
          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 inline-flex items-center gap-1 transition"
        >
          Evidence & Details
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <a
          href={internship.officialApplyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/60 transition inline-flex items-center gap-1"
        >
          Apply Official
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
