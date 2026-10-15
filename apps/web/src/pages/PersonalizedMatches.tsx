import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  TrendingUp,
  Clock,
  BookOpen,
  ShieldCheck,
  ChevronRight,
  Info,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { EligibilityBadge, VerificationBadge } from '../components/StatusBadge';
import { OpportunityEvidenceModal } from '../components/OpportunityEvidenceModal';

export const PersonalizedMatches: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [showFormulaExplanation, setShowFormulaExplanation] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res: any = await api.get('/readiness/matches');
        if (res.success && res.matches) {
          setMatches(res.matches);
        }
      } catch (err) {
        console.error('Failed to load personalized matches:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Header with Title & Formula Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              Internship Readiness Intelligence Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Transparent, explainable match scoring tailored to your verified profile ({user?.profile?.degree || 'Computer Science'}, Class of {user?.profile?.graduationYear || '2027'}, targeting {user?.profile?.targetRole || 'Software Engineering'}).
          </p>
        </div>

        <button
          onClick={() => setShowFormulaExplanation(!showFormulaExplanation)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <Info className="w-3.5 h-3.5 text-brand-600" />
          {showFormulaExplanation ? 'Hide Scoring Weights' : 'Explain Scoring Formula'}
        </button>
      </div>

      {/* Formula Transparency Drawer */}
      {showFormulaExplanation && (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Documented Weight Distribution & Criteria
            </h3>
            <span className="text-xs text-slate-400">Total Score: 0 — 100%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-brand-600">40% Skill Alignment</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Compares demonstrated proficiencies against required (2x weight) and preferred skills.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-indigo-600">25% Education & Eligibility</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Validates graduation year eligibility range and accepted academic degree majors.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-purple-600">20% Career Alignment</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Matches student target role against opportunity title, category, and preferred firms.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-cyan-600">10% Location & Work Mode</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Evaluates student preference for Remote vs Hybrid vs Onsite positions.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-emerald-600">5% Standing / Experience</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Assesses academic standing (Sophomore/Junior/Senior) readiness.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Match Assessments Feed */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-6">
          {matches.map(({ internship, assessment }) => (
            <div
              key={internship.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition duration-200 space-y-6"
            >
              {/* Top Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {internship.companyName}
                    </span>
                    <VerificationBadge status={internship.verificationStatus} />
                    <EligibilityBadge status={assessment.eligibilityStatus} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {internship.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {internship.location} • {internship.workMode} • {internship.stipend || 'Competitive'}
                  </p>
                </div>

                {/* Score Pill Card */}
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Total Match Score
                    </span>
                    <p className="text-2xl font-black text-brand-600 dark:text-brand-400">
                      {assessment.totalScore}%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                    {assessment.totalScore >= 80 ? 'HIGH' : assessment.totalScore >= 60 ? 'MED' : 'FAIR'}
                  </div>
                </div>
              </div>

              {/* Explainable Factor Breakdown Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1 text-[11px]">
                    <span>Skills (40%)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {assessment.skillsScore}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${assessment.skillsScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1 text-[11px]">
                    <span>Education (25%)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {assessment.educationScore}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${assessment.educationScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1 text-[11px]">
                    <span>Role Fit (20%)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {assessment.careerScore}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${assessment.careerScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1 text-[11px]">
                    <span>Location (10%)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {assessment.locationScore}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${assessment.locationScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1 text-[11px]">
                    <span>Standing (5%)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {assessment.experienceScore}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${assessment.experienceScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Eligibility Checkpoints & Reasons */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Eligibility Evidence & Analysis:
                </span>
                <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  {(assessment.eligibilityReasons || []).map((reason: string, rIdx: number) => (
                    <li key={rIdx} className="flex items-start gap-1.5">
                      <span className="text-brand-500">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skill Gap Analysis Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Demonstrated Skills */}
                <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Skills Already Demonstrated ({assessment.demonstratedSkills.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {assessment.demonstratedSkills.map((s: string) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                    {assessment.demonstratedSkills.length === 0 && (
                      <span className="text-slate-400">No overlapping skills logged in profile.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills & Recommended Order */}
                <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                  <div className="flex items-center justify-between font-bold text-amber-800 dark:text-amber-300">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Skills to Improve / Acquire ({assessment.missingSkills.length})
                    </div>
                    <span className="text-[11px] font-normal text-amber-700 dark:text-amber-400">
                      ~{assessment.estimatedPrepWeeks} weeks prep (est.)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {assessment.missingSkills.map((s: string) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                    {assessment.missingSkills.length === 0 && (
                      <span className="text-emerald-600 font-medium">All required skills met!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedInternship(internship)}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  View Full Evidence Panel
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    to="/roadmaps"
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition inline-flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    Open Skill Roadmap
                  </Link>
                  <a
                    href={internship.officialApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
                  >
                    Apply Official
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">
            No matches calculated yet.
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Make sure your student profile has your current graduation year and at least 3 skills to start generating personalized match scores.
          </p>
          <Link
            to="/profile"
            className="inline-block px-4 py-2 text-xs font-bold rounded-lg bg-brand-600 text-white"
          >
            Update Profile Skills
          </Link>
        </div>
      )}

      {/* Opportunity Evidence Modal */}
      {selectedInternship && (
        <OpportunityEvidenceModal
          isOpen={!!selectedInternship}
          onClose={() => setSelectedInternship(null)}
          internship={selectedInternship}
        />
      )}
    </div>
  );
};
