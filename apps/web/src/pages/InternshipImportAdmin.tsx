import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

type Source = { id: string; sourceName: string; sourceUrl: string; organizationType: string; active: boolean; lastSuccessfulSyncAt?: string | null; lastError?: string | null };
type Candidate = { id: string; title: string; canonicalUrl: string; applyUrl: string; sourcePageUrl: string; sourceName: string; excerpt: string; lastSeenAt: string; reviewStatus: string };
const endpoint = '/admin/internship-imports';

export const InternshipImportAdmin: React.FC = () => {
  const { user } = useAuth();
  const [sources, setSources] = useState<Source[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    const [s, c]: any[] = await Promise.all([
      api.get(`${endpoint}/sources`), api.get(`${endpoint}/candidates?status=PENDING`),
    ]);
    setSources(s.data || []); setCandidates(c.data || []);
  };
  useEffect(() => { if (user?.role === 'ADMIN') load().catch((e) => setMessage(e.message)); }, [user?.role]);

  if (user?.role !== 'ADMIN') return <div className="max-w-3xl mx-auto p-8"><h1 className="text-xl font-bold">Admin access required</h1><p className="mt-2 text-sm text-slate-500">This page is available only to accounts assigned the ADMIN role.</p></div>;

 const addSource = async (e: React.FormEvent) => {
  e.preventDefault();
  setBusy(true);
  setMessage('');

  try {
    await api.post(`${endpoint}/sources`, {
      sourceName: sourceName.trim(),
      sourceUrl: sourceUrl.trim(),
      organizationType: 'OTHER',
      sourceType: 'AUTO',
      active: true,
    });

    setSourceName('');
    setSourceUrl('');
    setMessage('Source added. Run sync to discover candidate listings.');
    await load();
  } catch (e: any) {
    setMessage(e.message || 'Could not add source.');
  } finally {
    setBusy(false);
  }
};
  const runSync = async () => { setBusy(true); setMessage('Syncing configured sources…'); try { const r: any = await api.post(`${endpoint}/sync`, {}); setMessage(`Sync complete: ${r.summary.sourcesChecked} checked, ${r.summary.candidatesFound} found, ${r.summary.sourcesFailed} failed.`); await load(); } catch (e: any) { setMessage(e.message || 'Sync failed.'); } finally { setBusy(false); } };
  const reject = async (c: Candidate) => { const notes = window.prompt('Reason for rejection (optional):') || ''; setBusy(true); try { await api.post(`${endpoint}/candidates/${c.id}/reject`, { notes }); await load(); } catch (e: any) { setMessage(e.message); } finally { setBusy(false); } };
  const approve = async (c: Candidate) => {
    if (!window.confirm('Have you checked the official page and confirmed that this internship is currently open to candidates in India?')) return;
    const companyName = window.prompt('Official company / institute name:'); if (!companyName) return;
    const location = window.prompt('India location (e.g. Hyderabad, India or Remote (India)):'); if (!location) return;
    const description = window.prompt('Description (at least 20 characters):', c.excerpt || c.title); if (!description || description.trim().length < 20) { setMessage('Description must be at least 20 characters.'); return; }
    const applyUrl = window.prompt('Official application URL (HTTPS):', c.applyUrl); if (!applyUrl) return;
    const sourceUrl = window.prompt('Official source page URL (HTTPS):', c.canonicalUrl); if (!sourceUrl) return;
    setBusy(true); setMessage('');
    try { await api.post(`${endpoint}/candidates/${c.id}/approve`, { indiaEligible: true, companyName, title: c.title, location, description, applyUrl, sourceUrl, workMode: /^remote/i.test(location) ? 'REMOTE' : 'ONSITE', category: 'Internship' }); setMessage(`Published: ${c.title}`); await load(); }
    catch (e: any) { setMessage(e.message || 'Could not publish candidate.'); } finally { setBusy(false); }
  };

  return <div className="max-w-6xl mx-auto space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">InternProof AI · Admin</p><h1 className="mt-1 text-2xl font-extrabold">India Internship Collector</h1><p className="mt-2 text-sm text-slate-500">Official sources are checked every six hours. New discoveries stay private until reviewed here.</p></div><button disabled={busy} onClick={runSync} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Working…' : 'Run sync now'}</button></div>
    {message && <div role="status" className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">{message}</div>}
    <form onSubmit={addSource} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-4">
      <div className="md:col-span-4"><h2 className="font-bold">Add an official source</h2><p className="mt-1 text-xs text-slate-500">Add one official internship/careers page per institute or company. Use real HTTPS URLs only.</p></div>
     <input
  required
  value={sourceName}
  onChange={e => setSourceName(e.target.value)}
  placeholder="Organization or source name"
  className="rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-700"
/>

<input
  required
  type="url"
  value={sourceUrl}
  onChange={e => setSourceUrl(e.target.value)}
  placeholder="https://official-domain/..."
  className="rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm md:col-span-3 dark:border-slate-700"
/>
      <div className="md:col-span-4 flex justify-end">
  <button
    type="submit"
    disabled={busy}
    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-slate-900"
  >
    {busy ? 'Adding…' : 'Add source'}
  </button>
</div>
    </form>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h2 className="font-bold">Configured sources <span className="ml-1 text-sm font-normal text-slate-500">({sources.length})</span></h2><div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">{sources.map(s => <div key={s.id} className="py-3"><div className="flex flex-wrap justify-between gap-2"><span className="font-medium text-sm">{s.sourceName} <span className="text-xs text-slate-500">· {s.organizationType}</span></span><span className={`text-xs ${s.lastError ? 'text-rose-600' : 'text-emerald-600'}`}>{s.lastError ? 'Last sync failed' : s.lastSuccessfulSyncAt ? `Last success ${new Date(s.lastSuccessfulSyncAt).toLocaleString()}` : 'Not synced yet'}</span></div><a className="mt-1 block break-all text-xs text-indigo-600 underline" href={s.sourceUrl} target="_blank" rel="noreferrer">{s.sourceUrl}</a>{s.lastError && <p className="mt-1 text-xs text-rose-600">{s.lastError}</p>}</div>)}{sources.length === 0 && <p className="py-4 text-sm text-slate-500">No sources yet. Add official source pages above.</p>}</div></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between gap-3"><h2 className="font-bold">Pending review <span className="ml-1 text-sm font-normal text-slate-500">({candidates.length})</span></h2><button disabled={busy} onClick={() => load().catch(e => setMessage(e.message))} className="text-sm font-semibold text-indigo-600">Refresh</button></div><div className="mt-4 space-y-3">{candidates.map(c => <article key={c.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div className="min-w-0"><h3 className="font-semibold">{c.title}</h3><p className="mt-1 text-xs text-slate-500">Found via {c.sourceName} · Last seen {new Date(c.lastSeenAt).toLocaleString()}</p>{c.excerpt && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{c.excerpt}</p>}<a className="mt-2 block break-all text-xs text-indigo-600 underline" href={c.canonicalUrl} target="_blank" rel="noreferrer">Open official listing</a></div><div className="flex shrink-0 gap-2"><button disabled={busy} onClick={() => approve(c)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Review & publish</button><button disabled={busy} onClick={() => reject(c)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold dark:border-slate-700">Reject</button></div></div></article>)}{candidates.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No pending discoveries. Add official sources and run a sync.</p>}</div></section>
    </div>;
};