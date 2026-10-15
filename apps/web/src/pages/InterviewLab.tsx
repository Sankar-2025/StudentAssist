import React, { useEffect, useState } from 'react';
import {
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Send,
  RotateCcw,
  History,
  Building2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api } from '../services/api';

export const InterviewLab: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [category, setCategory] = useState('ALL');
  const [company, setCompany] = useState('ALL');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [showHints, setShowHints] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== 'ALL') params.append('category', category);
        if (company !== 'ALL') params.append('company', company);

        const [qRes, hRes]: any = await Promise.all([
          api.get(`/interviews/questions?${params.toString()}`),
          api.get('/interviews/history').catch(() => ({ history: [] })),
        ]);

        if (qRes.success && qRes.questions) {
          setQuestions(qRes.questions);
          if (qRes.questions.length > 0) {
            setSelectedQuestion(qRes.questions[0]);
          }
        }
        if (hRes.history) setHistory(hRes.history);
      } catch (err) {
        console.error('Failed to load questions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [category, company]);

  const handleSubmitPractice = async () => {
    if (!selectedQuestion || !studentAnswer.trim()) return;
    setIsSubmitting(true);
    try {
      const res: any = await api.post(`/interviews/questions/${selectedQuestion.id}/practice`, {
        answer: studentAnswer,
      });

      if (res.success && res.evaluation) {
        setEvaluation(res.evaluation);
        // Refresh history
        const hRes: any = await api.get('/interviews/history').catch(() => ({ history: [] }));
        if (hRes.history) setHistory(hRes.history);
      }
    } catch (err: any) {
      alert(err.message || 'Evaluation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setEvaluation(null);
    setStudentAnswer('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          Company-Specific Interview Lab
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Practice technical DSA, system design, and STAR-method behavioral questions with rubric-based automated feedback.
        </p>
      </div>

      {/* Filter Selector */}
      <div className="flex items-center justify-between gap-4 flex-wrap p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Categories</option>
              <option value="TECHNICAL">Technical & Algorithmic</option>
              <option value="BEHAVIORAL">Behavioral (STAR Method)</option>
              <option value="SYSTEM_DESIGN">System & API Design</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Target Company:</span>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Companies</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Amazon">Amazon</option>
            </select>
          </div>
        </div>

        <span className="text-slate-400">
          Showing {questions.length} Practice Questions
        </span>
      </div>

      {/* Main 2-Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Questions List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Question
          </h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {questions.map((q) => {
              const isSelected = selectedQuestion?.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => {
                    setSelectedQuestion(q);
                    setEvaluation(null);
                    setStudentAnswer('');
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-brand-50/70 dark:bg-brand-950/40 border-brand-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {q.companyTarget || 'General'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {q.category}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-slate-700 dark:text-slate-300 font-medium">
                    {q.question}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Question Workspace & Feedback */}
        <div className="lg:col-span-2 space-y-6">
          {selectedQuestion ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Question Metadata & Prompt */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold">
                    {selectedQuestion.companyTarget}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {selectedQuestion.category}
                  </span>
                  {selectedQuestion.isFromCandidateReport && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Candidate Experience Report
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedQuestion.question}
                </h2>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Interviewer Assessment Intent:
                  </span>
                  <p className="text-slate-500 dark:text-slate-400">
                    {selectedQuestion.interviewerIntent}
                  </p>
                </div>

                {/* Hints / STAR Guide Accordion */}
                <div className="pt-1">
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    {showHints ? 'Hide Hints & Framework' : 'Show Hints & STAR Framework'}
                  </button>

                  {showHints && (
                    <div className="mt-2 p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-2 animate-in fade-in duration-150">
                      {selectedQuestion.hints && selectedQuestion.hints.length > 0 && (
                        <div>
                          <span className="font-bold text-amber-900 dark:text-amber-300">Hints:</span>
                          <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-400 mt-1">
                            {selectedQuestion.hints.map((h: string, idx: number) => (
                              <li key={idx}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selectedQuestion.starGuide && (
                        <div className="space-y-1 pt-1 border-t border-amber-200/50 dark:border-amber-800/40">
                          <span className="font-bold text-amber-900 dark:text-amber-300">
                            STAR Method Benchmark:
                          </span>
                          <p className="text-slate-700 dark:text-slate-300">
                            <strong>S:</strong> {selectedQuestion.starGuide.situation}
                          </p>
                          <p className="text-slate-700 dark:text-slate-300">
                            <strong>T:</strong> {selectedQuestion.starGuide.task}
                          </p>
                          <p className="text-slate-700 dark:text-slate-300">
                            <strong>A:</strong> {selectedQuestion.starGuide.action}
                          </p>
                          <p className="text-slate-700 dark:text-slate-300">
                            <strong>R:</strong> {selectedQuestion.starGuide.result}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Student Practice Input */}
              {!evaluation ? (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Draft Your Interview Response:
                  </label>
                  <textarea
                    rows={6}
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.target.value)}
                    placeholder="Write your explanation or code walkthrough here. For behavioral questions, follow the STAR structure..."
                    className="w-full p-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {studentAnswer.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                    <button
                      onClick={handleSubmitPractice}
                      disabled={isSubmitting || !studentAnswer.trim()}
                      className="px-4 py-2 font-bold rounded-lg bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 transition flex items-center gap-2 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isSubmitting ? 'Evaluating...' : 'Evaluate with Rubric'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Rubric Evaluation Results */
                <div className="space-y-5 pt-3 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Rubric Overall Score
                      </span>
                      <p className="text-2xl font-black text-brand-600 dark:text-brand-400">
                        {evaluation.score} / 100
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <div>Structure: {evaluation.structureScore}%</div>
                      <div>Technical: {evaluation.technicalScore}%</div>
                      <div>Clarity: {evaluation.clarityScore}%</div>
                    </div>
                  </div>

                  {/* Strengths & Areas for Improvement */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1.5">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Identified Strengths:
                      </span>
                      <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                        {evaluation.strengths.map((str: string, sIdx: number) => (
                          <li key={sIdx}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1.5">
                      <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Areas to Polish:
                      </span>
                      <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                        {evaluation.areasForImprovement.map((area: string, aIdx: number) => (
                          <li key={aIdx}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Suggested Answer Structure */}
                  <div className="p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs space-y-1">
                    <span className="font-bold text-blue-900 dark:text-blue-300">
                      Recommended Answer Blueprint:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {evaluation.suggestedAnswerStructure}
                    </p>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Refine & Retry Answer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-600">Select a question to practice.</p>
            </div>
          )}
        </div>
      </div>

      {/* Practice History Section */}
      {history.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-brand-600" />
            Your Recent Practice History & Scores
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {history.map((h) => (
              <div key={h.id} className="py-3 flex items-center justify-between gap-4">
                <div className="truncate pr-2">
                  <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                    {h.questionTitle}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {h.company || 'Tech'} • {new Date(h.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-black text-brand-600 dark:text-brand-400 text-sm">
                    {h.feedbackScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
