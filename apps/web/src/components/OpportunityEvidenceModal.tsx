import React from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  MapPin,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { VerificationBadge } from './StatusBadge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  internship: any;
  onSaveToggle?: (id: string) => void;
  onTrackApplication?: (internship: any) => void;
}

export const OpportunityEvidenceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  internship,
  onSaveToggle,
  onTrackApplication,
}) => {
  if (!isOpen || !internship) return null;

  const ev = internship.evidence || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                {internship.companyName}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <VerificationBadge status={internship.verificationStatus} />
              {internship.isDemoData && (
                <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                  Seeded Sample Listing
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {internship.title}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {internship.location} ({internship.workMode})
              </span>
              {internship.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {internship.duration}
                </span>
              )}
              {internship.stipend && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <DollarSign className="w-3.5 h-3.5" />
                  {internship.stipend}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Opportunity Evidence Panel */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Opportunity Evidence & Traceability Panel
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 dark:text-slate-400">Primary Source Type:</span>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {ev.sourceType || 'Company Portal'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 dark:text-slate-400">Last Verified Date:</span>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {ev.lastCheckedDate
                    ? new Date(ev.lastCheckedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Recent'}
                </p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <span className="text-slate-500 dark:text-slate-400">Verifiable Source URL:</span>
                <p className="truncate">
                  <a
                    href={ev.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                  >
                    {ev.sourceUrl}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <span className="text-slate-500 dark:text-slate-400">Application Deadline:</span>
                <p className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {internship.deadline
                    ? new Date(internship.deadline).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Open until filled / Rolling review'}
                  {ev.deadlineVerified && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 px-1.5 py-0.2 rounded font-medium">
                      Verified
                    </span>
                  )}
                </p>
              </div>
            </div>
            {ev.verificationNotes && (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-700/60">
                Note: {ev.verificationNotes}
              </p>
            )}
          </div>

          {/* Role Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Role Overview
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {internship.description}
            </p>
          </div>

          {/* Requirements & Eligibility Checkpoints */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Documented Requirements & Eligibility Evidence
            </h3>
            {Array.isArray(internship.requirements) && internship.requirements.length > 0 ? (
              <ul className="space-y-2">
                {internship.requirements.map((req: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">See official portal for full qualifications.</p>
            )}
          </div>

          {/* Education & Graduation Range */}
          {(internship.minGraduationYear || (internship.allowedDegrees && internship.allowedDegrees.length > 0)) && (
            <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-blue-900 dark:text-blue-300">
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Degree & Graduation Year Eligibility
              </div>
              {internship.minGraduationYear && internship.maxGraduationYear && (
                <p className="text-blue-800 dark:text-blue-200">
                  Target Graduation Years: {internship.minGraduationYear} — {internship.maxGraduationYear}
                </p>
              )}
              {internship.allowedDegrees && internship.allowedDegrees.length > 0 && (
                <p className="text-blue-800 dark:text-blue-200">
                  Accepted Degrees: {internship.allowedDegrees.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Required & Preferred Skills */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Tech Stack & Skill Matrix
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Core Required Skills:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(internship.requiredSkills || []).map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              {internship.preferredSkills && internship.preferredSkills.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Preferred Skills (Bonus):
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {internship.preferredSkills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 text-xs rounded-md bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            {onSaveToggle && (
              <button
                onClick={() => onSaveToggle(internship.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {internship.isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-brand-600" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-slate-400" />
                    Save
                  </>
                )}
              </button>
            )}
            {onTrackApplication && (
              <button
                onClick={() => onTrackApplication(internship)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                + Track in Pipeline
              </button>
            )}
          </div>

          <a
            href={internship.officialApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 rounded-lg shadow-sm transition"
          >
            Apply on Official Career Portal
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
