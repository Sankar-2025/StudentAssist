import React from 'react';
import './ResumeEnhancements.css';
export type ResumeSection = {
  id: string;
  sectionType: string;
  title: string;
  items: Record<string, any>[];
  hidden?: boolean;
};

type Props = {
  sections: ResumeSection[];
  onChange: (sections: ResumeSection[]) => void;
};

const SECTION_TYPES = [
  { type: 'EDUCATION', title: 'Education' },
  { type: 'PROJECTS', title: 'Projects' },
  { type: 'SKILLS', title: 'Technical Skills' },
  { type: 'EXPERIENCE', title: 'Work Experience' },
  { type: 'INTERNSHIPS', title: 'Internships' },
  { type: 'CERTIFICATIONS', title: 'Certifications' },
  { type: 'ACHIEVEMENTS', title: 'Achievements & Awards' },
  { type: 'RESEARCH', title: 'Research & Publications' },
  { type: 'OPEN_SOURCE', title: 'Open Source' },
  { type: 'LEADERSHIP', title: 'Leadership & Volunteering' },
  { type: 'COURSEWORK', title: 'Relevant Coursework' },
  { type: 'LANGUAGES', title: 'Languages' },
];

const FIELDS: Record<string, { key: string; label: string }[]> = {
  EDUCATION: [
    { key: 'institution', label: 'Institution' },
    { key: 'degree', label: 'Degree / Qualification' },
    { key: 'dateRange', label: 'Dates' },
    { key: 'location', label: 'Location' },
    { key: 'details', label: 'Details / Coursework' },
  ],
  PROJECTS: [
    { key: 'name', label: 'Project name' },
    { key: 'technologies', label: 'Technologies' },
    { key: 'dateRange', label: 'Dates' },
    { key: 'bullets', label: 'Description / Achievements (one per line)' },
  ],
  SKILLS: [
    { key: 'category', label: 'Category' },
    { key: 'skills', label: 'Skills (comma-separated)' },
  ],
  EXPERIENCE: [
    { key: 'company', label: 'Company / Organization' },
    { key: 'role', label: 'Job title' },
    { key: 'dateRange', label: 'Dates' },
    { key: 'location', label: 'Location' },
    { key: 'bullets', label: 'Responsibilities / Achievements (one per line)' },
  ],
  INTERNSHIPS: [
    { key: 'company', label: 'Company / Organization' },
    { key: 'role', label: 'Internship role' },
    { key: 'dateRange', label: 'Dates' },
    { key: 'bullets', label: 'Work and achievements (one per line)' },
  ],
  CERTIFICATIONS: [
    { key: 'name', label: 'Certification name' },
    { key: 'issuer', label: 'Issuing organization' },
    { key: 'dateRange', label: 'Date earned' },
    { key: 'verificationUrl', label: 'Verification URL' },
  ],
  ACHIEVEMENTS: [
    { key: 'name', label: 'Achievement / Award' },
    { key: 'issuer', label: 'Organization / Event' },
    { key: 'dateRange', label: 'Date' },
    { key: 'details', label: 'Details' },
  ],
  RESEARCH: [
    { key: 'name', label: 'Research / Publication title' },
    { key: 'authors', label: 'Authors' },
    { key: 'dateRange', label: 'Publication date' },
    { key: 'url', label: 'Publication URL' },
    { key: 'details', label: 'Abstract / Details' },
  ],
  OPEN_SOURCE: [
    { key: 'name', label: 'Project / Repository' },
    { key: 'url', label: 'Repository URL' },
    { key: 'role', label: 'Contribution / Role' },
    { key: 'details', label: 'Contribution details' },
  ],
  LEADERSHIP: [
    { key: 'organization', label: 'Organization' },
    { key: 'role', label: 'Role' },
    { key: 'dateRange', label: 'Dates' },
    { key: 'details', label: 'Activities / Contributions' },
  ],
  COURSEWORK: [
    { key: 'name', label: 'Course / Subject' },
    { key: 'institution', label: 'Institution / Platform' },
    { key: 'details', label: 'Topics learned' },
  ],
  LANGUAGES: [
    { key: 'name', label: 'Language' },
    { key: 'proficiency', label: 'Proficiency level' },
  ],
};

export default function ResumeEnhancements({
  sections,
  onChange,
}: Props) {
  const updateSection = (
    index: number,
    updates: Partial<ResumeSection>,
  ) => {
    onChange(
      sections.map((section, i) =>
        i === index ? { ...section, ...updates } : section,
      ),
    );
  };

  const addSection = (type: string) => {
    const definition = SECTION_TYPES.find((s) => s.type === type);
    if (!definition) return;

    if (sections.some((s) => s.sectionType === type)) {
      alert('This section already exists. You can add more entries to it.');
      return;
    }

    onChange([
      ...sections,
      {
        id: `sec-${type.toLowerCase()}-${Date.now()}`,
        sectionType: type,
        title: definition.title,
        items: [{}],
      },
    ]);
  };

  const updateItem = (
    sectionIndex: number,
    itemIndex: number,
    key: string,
    value: any,
  ) => {
    const next = sections.map((section, index) => {
      if (index !== sectionIndex) return section;

      const items = [...(section.items || [])];
      items[itemIndex] = { ...items[itemIndex], [key]: value };

      return { ...section, items };
    });

    onChange(next);
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;

    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const addItem = (index: number) => {
    onChange(
      sections.map((section, i) =>
        i === index
          ? { ...section, items: [...(section.items || []), {}] }
          : section,
      ),
    );
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    onChange(
      sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              items: section.items.filter((_, j) => j !== itemIndex),
            }
          : section,
      ),
    );
  };

  const completed = [
    sections.some((s) =>
      s.sectionType === 'EDUCATION' &&
      s.items.some((item) => item.institution && item.degree),
    ),
    sections.some((s) =>
      s.sectionType === 'PROJECTS' &&
      s.items.some((item) => item.name),
    ),
    sections.some((s) =>
      s.sectionType === 'SKILLS' &&
      s.items.some((item) => item.skills),
    ),
  ].filter(Boolean).length;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold text-slate-900 dark:text-white">
          Resume Sections
        </h3>
        <span className="text-xs text-slate-500">
          Core completeness: {Math.round((completed / 3) * 100)}%
        </span>
      </div>

      <select
        value=""
        onChange={(event) => {
          if (event.target.value) addSection(event.target.value);
        }}
        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <option value="">+ Add a section</option>
        {SECTION_TYPES.map((section) => (
          <option key={section.type} value={section.type}>
            {section.title}
          </option>
        ))}
      </select>

      {sections.map((section, sectionIndex) => (
        <div
          key={section.id}
          className="rounded-xl border border-slate-200 p-4 space-y-3 dark:border-slate-700"
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              aria-label="Section title"
              value={section.title}
              onChange={(e) =>
                updateSection(sectionIndex, { title: e.target.value })
              }
              className="min-w-0 flex-1 rounded-lg border p-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />

            <button type="button" onClick={() => moveSection(sectionIndex, -1)}
              disabled={sectionIndex === 0} className="rounded border px-2 py-1 disabled:opacity-30">
              ↑
            </button>
            <button type="button" onClick={() => moveSection(sectionIndex, 1)}
              disabled={sectionIndex === sections.length - 1} className="rounded border px-2 py-1 disabled:opacity-30">
              ↓
            </button>
            <button type="button"
              onClick={() => updateSection(sectionIndex, { hidden: !section.hidden })}
              className="rounded border px-2 py-1 text-sm">
              {section.hidden ? 'Show' : 'Hide'}
            </button>
            <button type="button"
              onClick={() => onChange(sections.filter((_, i) => i !== sectionIndex))}
              className="rounded border border-red-200 px-2 py-1 text-sm text-red-600">
              Remove
            </button>
          </div>

          {(section.items || []).map((item, itemIndex) => (
            <div key={itemIndex} className="rounded-lg bg-slate-50 p-3 space-y-3 dark:bg-slate-800/60">
              <div className="flex justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Entry {itemIndex + 1}
                </span>
                <button type="button"
                  onClick={() => removeItem(sectionIndex, itemIndex)}
                  className="text-xs text-red-600">
                  Remove entry
                </button>
              </div>

              {(FIELDS[section.sectionType] || [
                { key: 'name', label: 'Name / Title' },
                { key: 'details', label: 'Details' },
              ]).map((field) => {
                const isMultiline =
                  ['details', 'bullets'].includes(field.key);

                const value = Array.isArray(item[field.key])
                  ? item[field.key].join('\n')
                  : item[field.key] ?? '';

                return (
                  <label key={field.key} className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                    {field.label}
                    {isMultiline ? (
                      <textarea
                        rows={3}
                        value={value}
                        onChange={(e) =>
                          updateItem(
                            sectionIndex,
                            itemIndex,
                            field.key,
                            field.key === 'bullets'
                              ? e.target.value.split('\n').filter(Boolean)
                              : e.target.value,
                          )
                        }
                        className="mt-1 w-full rounded-lg border p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      />
                    ) : (
                      <input
                        value={value}
                        onChange={(e) =>
                          updateItem(sectionIndex, itemIndex, field.key, e.target.value)
                        }
                        className="mt-1 w-full rounded-lg border p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          ))}

          <button type="button" onClick={() => addItem(sectionIndex)}
            className="rounded-lg border border-dashed px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            + Add entry
          </button>
        </div>
      ))}
    </section>
  );
}
