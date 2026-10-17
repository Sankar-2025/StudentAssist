
import { useMemo, useState } from 'react';

const officialPortal = 'https://scholarships.gov.in/All-Scholarships';
const applicationPortal = 'https://scholarships.gov.in/ApplicationForm/';

const scholarships = [
  {
    name: 'AICTE Pragati Scholarship for Girl Students',
    level: 'Technical education',
    category: 'Girls',
    deadline: '31 Oct 2026',
    status: 'Open',
    description:
      'For eligible girl students pursuing technical diploma or degree programmes. Check the applicable scheme rules.',
  },
  {
    name: 'AICTE Saksham Scholarship',
    level: 'Technical education',
    category: 'Students with disabilities',
    deadline: '31 Oct 2026',
    status: 'Open',
    description:
      'For eligible specially abled students in technical diploma or degree programmes.',
  },
  {
    name: 'Central Sector Scholarship for College and University Students',
    level: 'College / University',
    category: 'Merit-based',
    deadline: '31 Oct 2026',
    status: 'Renewal open',
    description:
      'The portal currently confirms renewal applications. Check the official listing for fresh-application status and eligibility.',
  },
  {
    name: 'Post-Matric Scholarship for Students with Disabilities',
    level: 'Post-matric',
    category: 'Students with disabilities',
    deadline: '31 Oct 2026',
    status: 'Open',
    description:
      'Financial assistance for eligible students with disabilities pursuing post-matric education.',
  },
  {
    name: 'PM YASASVI Top Class Education in College',
    level: 'College / University',
    category: 'OBC / EBC / DNT',
    deadline: '31 Oct 2026',
    status: 'Check official listing',
    description:
      'For eligible OBC, EBC and DNT students. Confirm the current application status and conditions on NSP.',
  },
  {
    name: 'National Fellowship and Scholarship for Higher Education of ST Students',
    level: 'College / University',
    category: 'ST students',
    deadline: '31 Oct 2026',
    status: 'Open',
    description:
      'A scheme for eligible Scheduled Tribe students pursuing higher education.',
  },
  {
    name: 'Ishan Uday Special Scholarship Scheme',
    level: 'College / University',
    category: 'North Eastern Region',
    deadline: '31 Oct 2026',
    status: 'Check official listing',
    description:
      'For eligible students from the North Eastern Region pursuing higher education.',
  },
  {
    name: 'National Means-cum-Merit Scholarship',
    level: 'School',
    category: 'Merit-based',
    deadline: '31 Oct 2026',
    status: 'Open',
    description:
      'For eligible school students. Check the current fresh or renewal conditions and application availability.',
  },
];

const levels = [
  'All education levels',
  'School',
  'Post-matric',
  'College / University',
  'Technical education',
];

const categories = [
  'All categories',
  'Merit-based',
  'Girls',
  'Students with disabilities',
  'OBC / EBC / DNT',
  'ST students',
  'North Eastern Region',
];

export default function Scholarships() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All education levels');
  const [category, setCategory] = useState('All categories');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return scholarships.filter((item) => {
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term);

      const matchesLevel =
        level === 'All education levels' || item.level === level;

      const matchesCategory =
        category === 'All categories' || item.category === category;

      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [search, level, category]);

  return (
    <div className="min-h-screen bg-[#F3F8F4] p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl bg-gradient-to-r from-green-800 to-emerald-700 p-6 md:p-8 text-white shadow-sm">
          <p className="text-sm font-semibold text-green-100">
            STUDENTASSIST • OPPORTUNITY FINDER
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Government Scholarships
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-green-50">
            Explore scholarship schemes, filter opportunities and verify
            eligibility before applying through the official portal.
          </p>
          <a
            href={officialPortal}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-green-800 hover:bg-green-50"
          >
            Visit Official Scholarship Portal ↗
          </a>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-green-100 bg-white p-4">
            <p className="text-sm text-slate-500">Listed schemes</p>
            <p className="mt-1 text-2xl font-bold text-green-800">
              {scholarships.length}
            </p>
          </div>
          <div className="rounded-xl border border-green-100 bg-white p-4">
            <p className="text-sm text-slate-500">Matching results</p>
            <p className="mt-1 text-2xl font-bold text-green-800">
              {filtered.length}
            </p>
          </div>
          <div className="rounded-xl border border-green-100 bg-white p-4">
            <p className="text-sm text-slate-500">Deadline shown</p>
            <p className="mt-1 text-2xl font-bold text-green-800">
              31 Oct 2026
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-green-100 bg-white p-4 md:p-5 shadow-sm">
          <h2 className="text-lg font-bold text-green-900">
            Find your scholarship
          </h2>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search scholarship name..."
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
            />

            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-600"
            >
              {levels.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-600"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-green-900">
              Scholarship opportunities
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Always verify the live status and eligibility before applying.
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-green-100 bg-white p-8 text-center text-slate-600">
              No matching scholarships. Try changing your search or filters.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map((item) => (
                <article
                  key={item.name}
                  className="flex flex-col rounded-xl border border-green-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                      {item.level}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-slate-900">
                    {item.name}
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <p className="text-sm text-slate-600">
                      Student deadline:{' '}
                      <span className="font-semibold text-slate-900">
                        {item.deadline}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-amber-700">
                      Status: {item.status} — verify on the official portal
                    </p>
                  </div>

                 <a
  href={applicationPortal}
  target="_blank"
  rel="noreferrer"
  className="mt-4 inline-flex items-center justify-center rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
>
  Go to application login ↗
</a>
                </article>
              ))}
            </div>
          )}
        </section>

        <p className="text-xs leading-5 text-slate-500">
          Information is a discovery aid, not a guarantee of eligibility or
          application availability. Dates and scheme rules can change. The
          official National Scholarship Portal is the final source of truth.
        </p>
      </div>
    </div>
  );
}
