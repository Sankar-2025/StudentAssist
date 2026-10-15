import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Youtube,
  Search,
  ExternalLink,
  ShieldAlert,
  Building2,
  BookmarkCheck,
  Video,
} from 'lucide-react';
import { api } from '../services/api';

export const LearningResources: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [disclaimer, setDisclaimer] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.append('query', search.trim());
        if (selectedCompany !== 'ALL') params.append('company', selectedCompany);

        const res: any = await api.get(`/resources/videos?${params.toString()}`);
        if (res.success) {
          setVideos(res.resources);
          setDisclaimer(res.disclaimer);
        }
      } catch (err) {
        console.error('Failed to load video resources:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [selectedCompany]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fetchVideosSearch = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.append('query', search.trim());
        if (selectedCompany !== 'ALL') params.append('company', selectedCompany);
        const res: any = await api.get(`/resources/videos?${params.toString()}`);
        if (res.success) {
          setVideos(res.resources);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideosSearch();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          Learning Resources & Candidate Experience Lab
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Curated official engineering debriefs, authentic interview debriefs, and university talent videos.
        </p>
      </div>

      {/* Prominent Verification & Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-900 dark:text-amber-200">
            Source Traceability & Experience Disclaimer:
          </span>
          <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
            All videos link directly to verified public YouTube channels. Individual interview experiences and team processes vary by division, office, and year. Always cross-reference with official company careers documentation.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex-wrap">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, role (e.g. SWE, AI/ML), or topic..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <button type="submit" className="px-3.5 py-2 font-bold rounded-lg bg-brand-600 text-white">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Filter Company:</span>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
          >
            <option value="ALL">All Companies</option>
            <option value="Google">Google</option>
            <option value="Microsoft">Microsoft</option>
            <option value="Meta">Meta</option>
            <option value="Amazon">Amazon</option>
          </select>
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-brand-500/50 transition duration-150"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-600" />
                  {vid.company}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500">
                  {vid.category}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {vid.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {vid.description}
              </p>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-500 italic">
                {vid.disclaimer}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500 flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-rose-500" />
                Channel: {vid.channel}
              </span>

              <a
                href={vid.directSearchUrl || vid.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 font-bold rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition inline-flex items-center gap-1.5"
              >
                <Youtube className="w-3.5 h-3.5" />
                Watch on YouTube
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
