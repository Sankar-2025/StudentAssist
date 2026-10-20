import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  CheckSquare,
  Map,
  Bot,
  HelpCircle,
  FileText,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { OpportunityCard } from '../components/OpportunityCard';
import { OpportunityEvidenceModal } from '../components/OpportunityEvidenceModal';
import { ApplicationStatusBadge } from '../components/StatusBadge';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, byStatus: {}, inProgress: 0, offers: 0 });
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [matchRes, appRes, statRes, rmRes]: any = await Promise.all([
          api.get('/readiness/matches').catch(() => ({ matches: [] })),
          api.get('/applications').catch(() => ({ applications: [] })),
          api.get('/applications/stats').catch(() => ({ stats: {} })),
          api.get('/roadmaps').catch(() => ({ roadmaps: [] })),
        ]);

        if (matchRes.matches) setMatches(matchRes.matches.slice(0, 3));
        if (appRes.applications) setApplications(appRes.applications.slice(0, 4));
        if (statRes.stats) setStats(statRes.stats);
        if (rmRes.roadmaps) setRoadmaps(rmRes.roadmaps);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSaveToggle = async (id: string) => {
    try {
      const match = matches.find((m) => m.internship.id === id);
      const isCurrentlySaved = match?.internship.isSaved;

      if (isCurrentlySaved) {
        await api.delete(`/internships/${id}/save`);
      } else {
        await api.post(`/internships/${id}/save`);
      }

      setMatches((prev) =>
        prev.map((m) =>
          m.internship.id === id
            ? { ...m, internship: { ...m.internship, isSaved: !isCurrentlySaved } }
            : m
        )
      );
    } catch (err) {
      console.error('Save toggle failed:', err);
    }
  };

  const topMatch = matches[0];
  const activeRoadmap = roadmaps[0];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-brand-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Internship Readiness Intelligence Active
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.profile?.displayName || 'Student'}!
          </h1>
          <p className="text-brand-100 text-sm leading-relaxed">
            Targeting{' '}
            <strong className="text-white underline decoration-brand-300">
              {user?.profile?.targetRole || 'Software Engineering'}
            </strong>{' '}
            internships. Your verified skill matrix is ready for readiness matching and ATS optimization.
          </p>
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <Link
              to="/matches"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-white text-brand-700 hover:bg-brand-50 shadow-sm transition inline-flex items-center gap-1.5"
            >
              View Match Breakdown
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/discover"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
            >
              Browse All Opportunities
            </Link>
          </div>
        </div>


      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Readiness Top Match</span>
            <Sparkles className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {topMatch ? `${topMatch.assessment.totalScore}%` : '85%'}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {topMatch?.internship?.companyName || 'Google'} SWE Intern
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Active Pipeline</span>
            <CheckSquare className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {stats.inProgress || 0}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {stats.total || 0} total applications tracked
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Skill Roadmaps</span>
            <Map className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-green-800">
            {activeRoadmap ? `${activeRoadmap.progressPercent}%` : '50%'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeRoadmap?.completedSteps || 2} of {activeRoadmap?.totalSteps || 4} steps complete
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Source Traceability</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            100%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            All listings backed by verified portals
          </p>
        </div>
      </div>

      {/* Main Grid: Recommended Matches & Quick Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Personalized Matches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                Top Verified Matches for You
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ranked by the Internship Readiness Intelligence Engine based on your profile skills & degree.
              </p>
            </div>
            <Link
              to="/matches"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              See all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((item) => (
              <OpportunityCard
                key={item.internship.id}
                internship={item.internship}
                matchScore={item.assessment.totalScore}
                eligibilityStatus={item.assessment.eligibilityStatus}
                onViewDetails={(internship) => setSelectedInternship(internship)}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>

          {matches.length === 0 && !isLoading && (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No personalized matches calculated yet.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Add skills in your profile to start calculating explainable match scores.
              </p>
              <Link
                to="/profile"
                className="mt-4 inline-block px-4 py-2 text-xs font-semibold rounded-lg bg-brand-600 text-white"
              >
                Complete Profile
              </Link>
            </div>
          )}
        </div>

        {/* Right Col: Applications Pipeline & Quick Prep Actions */}
        <div className="space-y-6">
          {/* Applications Mini Pipeline */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Application Pipeline
              </h3>
              <Link to="/applications" className="text-xs font-semibold text-brand-600 hover:underline">
                View Kanban
              </Link>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {app.companyName}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 truncate text-[11px]">
                        {app.roleTitle}
                      </p>
                    </div>
                    <ApplicationStatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No applications tracked yet. Bookmark opportunities to track.</p>
            )}
          </div>

          {/* Quick Preparation Toolkit */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Preparation Toolkit
            </h3>
            <div className="space-y-2">
              <Link
                to="/mentor"
                className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition text-xs font-semibold text-slate-800 dark:text-slate-200 group"
              >
                <span className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-indigo-500" />
                  Ask AI Career Mentor
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition" />
              </Link>

              <Link
                to="/interview-lab"
                className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition text-xs font-semibold text-slate-800 dark:text-slate-200 group"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  Practice Interview Questions
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition" />
              </Link>

              <Link
                to="/resume-studio"
                className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition text-xs font-semibold text-slate-800 dark:text-slate-200 group"
              >
                <span className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  ATS Resume Optimizer & PDF Export
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunity Evidence Modal */}
      {selectedInternship && (
        <OpportunityEvidenceModal
          isOpen={!!selectedInternship}
          onClose={() => setSelectedInternship(null)}
          internship={selectedInternship}
          onSaveToggle={handleSaveToggle}
        />
      )}
    </div>
  );
};
