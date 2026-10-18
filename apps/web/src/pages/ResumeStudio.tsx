import React, { useEffect, useState } from 'react';
import ResumeEnhancements from '../components/ResumeEnhancements';
import {
  FileText,
  Printer,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  Github,
  Linkedin,
  Globe,
  Mail,
  Phone,
  MapPin,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ResumeStudio: React.FC = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<any[]>([]);
  const [activeResume, setActiveResume] = useState<any>(null);
  const [template, setTemplate] = useState<'modern-tech' | 'executive-clean' | 'minimalist-academic'>('modern-tech');
  const [isSaving, setIsSaving] = useState(false);
  const [atsJobDesc, setAtsJobDesc] = useState('');
  const [atsAnalysis, setAtsAnalysis] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showAtsModal, setShowAtsModal] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res: any = await api.get('/resumes');
        if (res.success && res.resumes && res.resumes.length > 0) {
          setResumes(res.resumes);
          setActiveResume(res.resumes[0]);
          setTemplate(res.resumes[0].templateId || 'modern-tech');
        } else {
          // Initialize a blank template with user info
          const blankResume = {
            title: 'Technical Internship Resume',
            templateId: 'modern-tech',
            fullName: user?.profile?.displayName || 'Alex Chen',
            email: user?.email || 'student@example.com',
            phone: '+1 (555) 019-2834',
            location: 'Seattle, WA',
            website: 'https://alexchen.dev',
            githubUrl: 'https://github.com/alexchen',
            linkedinUrl: 'https://linkedin.com/in/alexchen-tech',
            summary:
              'Ambitious Computer Science student with strong foundations in distributed backend systems, modern web engineering, and machine learning infrastructure. Seeking Summer 2027 software engineering internship.',
            sections: [
              {
                id: 'sec-edu',
                sectionType: 'EDUCATION',
                title: 'Education',
                items: [
                  {
                    institution: user?.profile?.university || 'University of Washington',
                    degree: `B.S. in ${user?.profile?.degree || 'Computer Science'} (GPA: 3.86/4.00)`,
                    dateRange: 'Sep 2023 - Expected June 2027',
                    location: 'Seattle, WA',
                    details: 'Relevant Coursework: Data Structures & Algorithms, Distributed Systems, Database Management, Operating Systems.',
                  },
                ],
              },
              {
                id: 'sec-proj',
                sectionType: 'PROJECTS',
                title: 'Technical Projects',
                items: [
                  {
                    name: 'CloudMetrics — Real-time Server Telemetry Pipeline',
                    technologies: 'Go, React, Docker, WebSockets, TimescaleDB',
                    dateRange: 'Jan 2026 - Present',
                    bullets: [
                      'Architected an agent daemon in Go sampling host CPU and memory at 100ms intervals.',
                      'Engineered a WebSocket stream broadcasting telemetry to a React dashboard with sub-50ms latency.',
                      'Containerized multi-node services using Docker Compose, orchestrating time-series data retention policies.',
                    ],
                  },
                  {
                    name: 'StudyCollab — Peer Code Review Platform',
                    technologies: 'TypeScript, Next.js, Node.js, PostgreSQL, Prisma',
                    dateRange: 'Sep 2025 - Dec 2025',
                    bullets: [
                      'Developed collaborative code editing workspace supporting syntax highlighting for 12 languages.',
                      'Built relational database models and schema migrations with Prisma, handling 10,000+ mock user requests.',
                    ],
                  },
                ],
              },
              {
                id: 'sec-skills',
                sectionType: 'SKILLS',
                title: 'Technical Skills',
                items: [
                  {
                    category: 'Languages & Frameworks',
                    skills: 'TypeScript, JavaScript, Python, Go, SQL, React, Node.js, Express',
                  },
                  {
                    category: 'Tools & Infrastructure',
                    skills: 'Git, Docker, Linux, PostgreSQL, REST APIs, CI/CD Actions',
                  },
                ],
              },
            ],
          };
          setActiveResume(blankResume);
        }
      } catch (err) {
        console.error('Failed to load resumes:', err);
      }
    };

    fetchResumes();
  }, [user]);

  const handleSave = async () => {
    if (!activeResume) return;
    setIsSaving(true);
    try {
      const payload = { ...activeResume, templateId: template };
      if (activeResume.id) {
        await api.put(`/resumes/${activeResume.id}`, payload);
      } else {
        const res: any = await api.post('/resumes', payload);
        if (res.success && res.resume) {
          setActiveResume(res.resume);
        }
      }
      alert('Resume draft saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save resume.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunAtsScan = async () => {
    if (!activeResume || !atsJobDesc.trim()) return;
    setIsScanning(true);
    try {
      const res: any = await api.post(`/resumes/${activeResume.id || 'temp'}/ats-scan`, {
        jobDescription: atsJobDesc,
      });
      if (res.success) {
        setAtsAnalysis(res.analysis);
      }
    } catch (err: any) {
      alert(err.message || 'ATS scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!activeResume) return null;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Resume Studio & ATS Optimizer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Clean, professional resume templates tailored for technical internship screenings. Export to PDF with verified ATS formatting.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAtsModal(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            ATS Keyword Scanner
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Export PDF
          </button>
        </div>
      </div>

      {/* Template Switcher Bar */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs no-print">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Template:
          </span>
          <div className="flex gap-1">
            {(['modern-tech', 'executive-clean', 'minimalist-academic'] as const).map((tpl) => (
              <button
                key={tpl}
                onClick={() => setTemplate(tpl)}
                className={`px-3 py-1 rounded-md font-semibold transition capitalize ${
                  template === tpl
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tpl.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Live Preview • Printable PDF standard
        </span>
      </div>

      {/* Main Workspace: 2-Col Split Editor & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Form Editor (hidden during print) */}
        <div className="space-y-6 no-print max-h-[850px] overflow-y-auto pr-1">
          {/* Contact Details */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Personal Information & Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={activeResume.fullName}
                  onChange={(e) => setActiveResume({ ...activeResume, fullName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Email</label>
                <input
                  type="email"
                  value={activeResume.email}
                  onChange={(e) => setActiveResume({ ...activeResume, email: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Phone</label>
                <input
                  type="text"
                  value={activeResume.phone || ''}
                  onChange={(e) => setActiveResume({ ...activeResume, phone: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Location</label>
                <input
                  type="text"
                  value={activeResume.location || ''}
                  onChange={(e) => setActiveResume({ ...activeResume, location: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={activeResume.githubUrl || ''}
                  onChange={(e) => setActiveResume({ ...activeResume, githubUrl: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={activeResume.linkedinUrl || ''}
                  onChange={(e) => setActiveResume({ ...activeResume, linkedinUrl: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Professional Summary
            </h3>
            <textarea
              rows={4}
              value={activeResume.summary}
              onChange={(e) => setActiveResume({ ...activeResume, summary: e.target.value })}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 leading-relaxed"
            />
          </div>
          {/* Resume Section Manager */}
<ResumeEnhancements
  sections={activeResume.sections || []}
  onChange={(sections) =>
    setActiveResume({ ...activeResume, sections })
  }
/>
        </div>

        {/* Right Column: Live Printable Preview Pane */}
        <div className="overflow-y-auto">
          <div
            id="printable-resume"
            className="p-8 bg-white text-slate-900 shadow-xl rounded-2xl border border-slate-200 min-h-[800px] text-xs font-sans space-y-5"
          >
            {/* Header */}
            <div className="border-b pb-4 space-y-1.5 text-center">
              <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900">
                {activeResume.fullName}
              </h1>
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-600 flex-wrap">
                {activeResume.email && <span>{activeResume.email}</span>}
                {activeResume.phone && <span>• {activeResume.phone}</span>}
                {activeResume.location && <span>• {activeResume.location}</span>}
                {activeResume.githubUrl && <span>• {activeResume.githubUrl.replace('https://', '')}</span>}
                {activeResume.linkedinUrl && <span>• {activeResume.linkedinUrl.replace('https://', '')}</span>}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <h2 className="font-bold uppercase tracking-wider text-[11px] text-brand-700 border-b border-slate-200 pb-0.5">
                Summary
              </h2>
              <p className="text-slate-700 leading-relaxed">{activeResume.summary}</p>
            </div>

            {/* Sections (Education, Projects, Skills) */}
            {(activeResume.sections || [])
           .filter((sec: any) => !sec.hidden)
           .map((sec: any) => (
              <div key={sec.id} className="space-y-2">
                <h2 className="font-bold uppercase tracking-wider text-[11px] text-brand-700 border-b border-slate-200 pb-0.5">
                  {sec.title}
                </h2>

                {sec.sectionType === 'EDUCATION' && (
                  <div className="space-y-2">
                    {sec.items.map((item: any, iIdx: number) => (
                      <div key={iIdx} className="space-y-0.5">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{item.institution}</span>
                          <span className="text-slate-600 font-normal">{item.dateRange}</span>
                        </div>
                        <p className="text-slate-700 font-semibold">{item.degree}</p>
                        {item.details && <p className="text-slate-600 text-[11px]">{item.details}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {sec.sectionType === 'PROJECTS' && (
                  <div className="space-y-3">
                    {sec.items.map((item: any, iIdx: number) => (
                      <div key={iIdx} className="space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{item.name}</span>
                          <span className="text-slate-500 font-normal">{item.dateRange}</span>
                        </div>
                        <p className="text-slate-600 font-mono text-[10px]">
                          Tech Stack: {item.technologies}
                        </p>
                        <ul className="list-disc list-inside text-slate-700 space-y-0.5 pl-1">
                          {(item.bullets || []).map((b: string, bIdx: number) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {sec.sectionType === 'SKILLS' && (
                  <div className="space-y-1">
                    {sec.items.map((item: any, iIdx: number) => (
                      <div key={iIdx} className="text-slate-700">
                        <strong className="font-semibold text-slate-900">{item.category}:</strong>{' '}
                        {item.skills}
                      </div>
                    ))}
                  </div>
                )}
                
{/* Additional resume sections */}
{!['EDUCATION', 'PROJECTS', 'SKILLS'].includes(sec.sectionType) && (
  <div className="space-y-2">
    {(sec.items || []).map((item: any, iIdx: number) => (
      <div key={iIdx} className="space-y-1">
        {Object.entries(item).map(([key, value]: [string, any]) => {
          if (
            value === undefined ||
            value === null ||
            value === '' ||
            key === 'id' ||
            key === 'hidden'
          ) {
            return null;
          }

          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (letter) => letter.toUpperCase());

          const displayValue = Array.isArray(value)
            ? value.join(' • ')
            : String(value);

          return (
            <p key={key} className="text-slate-700 leading-relaxed">
              <strong className="font-semibold text-slate-900">
                {['name', 'company', 'institution', 'organization', 'role'].includes(key)
                  ? ''
                  : `${label}: `}
              </strong>
              {displayValue}
            </p>
          );
        })}
      </div>
    ))}
  </div>
)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ATS Scanner Modal */}
      {showAtsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                ATS Keyword Coverage Optimizer
              </h3>
              <button
                onClick={() => setShowAtsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Paste an internship job description below to check keyword density and ensure your resume passes applicant tracking systems.
            </p>

            <textarea
              rows={5}
              value={atsJobDesc}
              onChange={(e) => setAtsJobDesc(e.target.value)}
              placeholder="Paste job description requirements (e.g. Google SWE Intern: C++, Python, algorithms, distributed systems)..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-slate-100"
            />

            <button
              onClick={handleRunAtsScan}
              disabled={isScanning || !atsJobDesc.trim()}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 transition"
            >
              {isScanning ? 'Scanning Keywords...' : 'Scan Resume Coverage'}
            </button>

            {atsAnalysis && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ATS Keyword Match:
                  </span>
                  <span className="text-base font-black text-purple-600 dark:text-purple-400">
                    {atsAnalysis.matchScore}%
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Matched Keywords ({atsAnalysis.matchedKeywords.length}):
                  </span>
                  <p className="text-slate-600 dark:text-slate-300">
                    {atsAnalysis.matchedKeywords.join(', ') || 'None'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Missing Keywords ({atsAnalysis.missingKeywords.length}):
                  </span>
                  <p className="text-slate-600 dark:text-slate-300">
                    {atsAnalysis.missingKeywords.join(', ') || 'All detected keywords matched!'}
                  </p>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Phrasing Suggestions:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                    {atsAnalysis.suggestions.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
