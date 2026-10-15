import React, { useEffect, useState } from 'react';
import { Search, Filter, RotateCcw, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { OpportunityCard } from '../components/OpportunityCard';
import { OpportunityEvidenceModal } from '../components/OpportunityEvidenceModal';

export const Discover: React.FC = () => {
  const [internships, setInternships] = useState<any[]>([]);
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [workMode, setWorkMode] = useState('ALL');
  const [verificationStatus, setVerificationStatus] = useState('ALL');
  const [isPaidOnly, setIsPaidOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState<any>(null);

const fetchInternships = async (page = 1) => {
  setIsLoading(true);

  try {
    const res: any = await api.get('/readiness/matches');

    if (res.success) {
      const matches = res.matches || [];
      setAllMatches(matches);

      const personalizedInternships = matches.map((match: any) => ({
        ...match.internship,
        matchScore: match.assessment?.totalScore ?? 0,
        eligibilityStatus: match.assessment?.eligibilityStatus,
      }));

      setInternships(personalizedInternships);

      setPagination({
        page,
        limit: 12,
        total: personalizedInternships.length,
        totalPages: Math.max(1, Math.ceil(personalizedInternships.length / 12)),
      });
    }
  } catch (err) {
    console.error('Failed to fetch personalized internships:', err);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchInternships(1);
  }, [workMode, verificationStatus, isPaidOnly, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInternships(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setWorkMode('ALL');
    setVerificationStatus('ALL');
    setIsPaidOnly(false);
    setSortBy('recent');
  };

  const handleSaveToggle = async (id: string) => {
    try {
      const item = internships.find((i) => i.id === id);
      const isCurrentlySaved = item?.isSaved;

      if (isCurrentlySaved) {
        await api.delete(`/internships/${id}/save`);
      } else {
        await api.post(`/internships/${id}/save`);
      }

      setInternships((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isSaved: !isCurrentlySaved } : i))
      );
    } catch (err) {
      console.error('Save toggle failed:', err);
    }
  };

  const handleTrackApplication = async (internship: any) => {
    try {
      await api.post('/applications', {
        internshipId: internship.id,
        companyName: internship.companyName,
        roleTitle: internship.title,
        applicationUrl: internship.officialApplyUrl,
        status: 'INTERESTED',
        deadline: internship.deadline,
        notes: `Saved from Discover Internships. Verified source: ${internship.evidence?.sourceType || 'Portal'}`,
      });
      alert(`Added "${internship.title}" to your Application Pipeline!`);
    } catch (err: any) {
      alert(err.message || 'Failed to track application');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Discover Verified Internships
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verifiable Career Portals
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Explore traceable tech internship vacancies with verifiable source URLs, last-checked timestamps, and qualification matrices.
        </p>
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role title, company (e.g. Google, Microsoft), or keywords..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition flex-shrink-0"
          >
            Search
          </button>
        </form>

        <div className="flex items-center justify-between gap-4 flex-wrap text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Work Mode:</span>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="ALL">All Modes</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Verification:</span>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="ALL">All Sources</option>
                <option value="VERIFIED_OFFICIAL">Verified Official Only</option>
                <option value="PARTNER_FEED">Partner Feeds</option>
                <option value="COMMUNITY_REPORTED">Community Reported</option>
              </select>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={isPaidOnly}
                onChange={(e) => setIsPaidOnly(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Paid Only
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="recent">Recently Added</option>
                <option value="deadline">Approaching Deadline</option>
                <option value="title">Role Title (A-Z)</option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-56 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : internships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {internships.map((internship) => (
            <OpportunityCard
              key={internship.id}
              internship={internship}
              onViewDetails={(item) => setSelectedInternship(item)}
              onSaveToggle={handleSaveToggle}
              matchScore={internship.matchScore}
eligibilityStatus={internship.eligibilityStatus}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">
            No internships matched your active filters.
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms, work mode, or clearing the filter options to view available vacancies.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-600 text-white"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} opportunities)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchInternships(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => fetchInternships(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Opportunity Evidence Modal */}
      {selectedInternship && (
        <OpportunityEvidenceModal
          isOpen={!!selectedInternship}
          onClose={() => setSelectedInternship(null)}
          internship={selectedInternship}
          onSaveToggle={handleSaveToggle}
          onTrackApplication={handleTrackApplication}
        />
      )}
    </div>
  );
};
