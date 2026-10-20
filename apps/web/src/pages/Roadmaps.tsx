import React, { useEffect, useState } from 'react';
import {
  Map,
  CheckCircle2,
  Clock,
  BookOpen,
  ExternalLink,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  PlayCircle,
} from 'lucide-react';
import { api } from '../services/api';

export const Roadmaps: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('Full Stack Engineer');
  const [currentRoadmap, setCurrentRoadmap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchRoadmapsList = async () => {
      try {
        const res: any = await api.get('/roadmaps');
        if (res.success && res.roadmaps) {
          setRoadmaps(res.roadmaps);
          if (res.roadmaps.length > 0) {
            setSelectedRole(res.roadmaps[0].targetRole);
          }
        }
      } catch (err) {
        console.error('Failed to fetch roadmaps list:', err);
      }
    };
    fetchRoadmapsList();
  }, []);

  useEffect(() => {
    if (!selectedRole) return;
    const fetchDetailedRoadmap = async () => {
      setIsLoading(true);
      try {
        const res: any = await api.get(`/roadmaps/${encodeURIComponent(selectedRole)}`);
        if (res.success && res.roadmap) {
          setCurrentRoadmap(res.roadmap);
          // Default expand first two steps
          const expandMap: Record<string, boolean> = {};
          res.roadmap.steps.forEach((s: any, idx: number) => {
            expandMap[s.id] = idx < 2;
          });
          setExpandedSteps(expandMap);
        }
      } catch (err) {
        console.error('Failed to fetch detailed roadmap:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetailedRoadmap();
  }, [selectedRole]);

  const handleToggleStep = async (stepId: string) => {
    try {
      const res: any = await api.post(`/roadmaps/steps/${stepId}/toggle`, {});
      if (res.success) {
        setCurrentRoadmap((prev: any) => {
          if (!prev) return prev;
          const updatedSteps = prev.steps.map((s: any) =>
            s.id === stepId ? { ...s, isCompleted: res.isCompleted } : s
          );
          const completedCount = updatedSteps.filter((s: any) => s.isCompleted).length;
          const totalCount = updatedSteps.length;
          return {
            ...prev,
            steps: updatedSteps,
            completedSteps: completedCount,
            progressPercent: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
          };
        });
      }
    } catch (err) {
      console.error('Failed to toggle step completion:', err);
    }
  };

  const toggleExpand = (stepId: string) => {
    setExpandedSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Map className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          Personalized Skill Roadmaps & Learning Hub
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Role-specific, sequenced learning pathways with official documentation, tutorial links, and hands-on mini-projects.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {roadmaps.map((rm) => (
          <button
            key={rm.id}
            onClick={() => setSelectedRole(rm.targetRole)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex-shrink-0 flex items-center gap-2 ${
              selectedRole === rm.targetRole
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {rm.targetRole}
          </button>
        ))}
      </div>

      {/* Active Roadmap View */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : currentRoadmap ? (
        <div className="space-y-6">
          {/* Progress Header Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {currentRoadmap.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentRoadmap.description}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                  {currentRoadmap.completedSteps} of {currentRoadmap.totalSteps} Milestones Done (
                  {currentRoadmap.progressPercent}%)
                </span>
              </div>
            </div>

            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${currentRoadmap.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Sequenced Milestones */}
          <div className="space-y-4">
            {currentRoadmap.steps.map((step: any) => {
              const isExpanded = !!expandedSteps[step.id];

              return (
                <div
                  key={step.id}
                  className={`rounded-2xl border transition duration-150 overflow-hidden ${
                    step.isCompleted
                      ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  {/* Step Header */}
                  <div className="p-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <button
                        onClick={() => handleToggleStep(step.id)}
                        className={`w-6 h-6 mt-0.5 rounded-md flex items-center justify-center transition border flex-shrink-0 ${
                          step.isCompleted
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'border-slate-300 dark:border-slate-700 hover:border-brand-500'
                        }`}
                        title={step.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {step.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                            Milestone #{step.stepNumber}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            ~{step.estimatedHours} Hours
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(step.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Resources & Tasks */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-4 text-xs">
                      {/* Covered Skills & Prerequisites */}
                      <div className="flex items-center gap-4 flex-wrap">
                        {step.skillsCovered && step.skillsCovered.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">Skills Covered:</span>
                            <div className="flex gap-1 flex-wrap">
                              {step.skillsCovered.map((sk: string) => (
                                <span
                                  key={sk}
                                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200"
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {step.prerequisites && step.prerequisites.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">Prerequisites:</span>
                            <span className="text-slate-600 dark:text-slate-400">
                              {step.prerequisites.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Skill Training Videos */}
                      {step.resources && step.resources.some((r: any) => r.type?.toUpperCase() === 'VIDEO') && (
                        <div className="space-y-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <PlayCircle className="w-4 h-4 text-rose-500" />
                            Skill Training Videos & Video Masterclasses:
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {step.resources
                              .filter((r: any) => r.type?.toUpperCase() === 'VIDEO')
                              .map((res: any, rIdx: number) => (
                                <a
                                  key={rIdx}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 rounded-xl border border-rose-100 dark:border-rose-950/60 bg-rose-50/30 dark:bg-rose-950/20 hover:border-rose-400 dark:hover:border-rose-700 transition flex items-center justify-between group"
                                >
                                  <div className="truncate pr-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-500 text-white">
                                        Video Course
                                      </span>
                                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                                        {res.provider}
                                      </span>
                                    </div>
                                    <p className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 truncate mt-1">
                                      {res.title}
                                    </p>
                                  </div>
                                  <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition shadow-sm">
                                    <PlayCircle className="w-4 h-4" />
                                  </div>
                                </a>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Curated Official Documentation & Guides */}
                      {step.resources && step.resources.some((r: any) => r.type?.toUpperCase() !== 'VIDEO') && (
                        <div className="space-y-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                            Curated Official Documentation & Technical Guides:
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {step.resources
                              .filter((r: any) => r.type?.toUpperCase() !== 'VIDEO')
                              .map((res: any, rIdx: number) => (
                                <a
                                  key={rIdx}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-brand-500 transition flex items-center justify-between group"
                                >
                                  <div className="truncate pr-2">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate">
                                      {res.title}
                                    </p>
                                    <p className="text-[11px] text-slate-400 truncate">
                                      {res.provider} • {res.type}
                                    </p>
                                  </div>
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 flex-shrink-0" />
                                </a>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Practice Exercises / Projects */}
                      {step.practiceTasks && step.practiceTasks.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            Hands-on Mini Projects & Implementation Tasks:
                          </span>
                          <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                            {step.practiceTasks.map((task: string, tIdx: number) => (
                              <li key={tIdx}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-600">No roadmap found for selected role.</p>
        </div>
      )}
    </div>
  );
};
