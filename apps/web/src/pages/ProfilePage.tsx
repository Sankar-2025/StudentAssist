
import React, { useEffect, useMemo, useState } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

type Proficiency = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

const SKILL_SUGGESTIONS = [
  'Python', 'Java', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go',
  'Rust', 'Kotlin', 'Swift', 'PHP', 'Ruby', 'R', 'Dart', 'SQL',
  'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Svelte', 'Next.js',
  'Node.js', 'Express.js', 'NestJS', 'Django', 'Flask', 'FastAPI',
  'Spring Boot', '.NET', 'REST APIs', 'GraphQL', 'Microservices',
  'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'Linux',
  'AWS', 'Microsoft Azure', 'Google Cloud', 'CI/CD', 'Terraform',
  'PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Redis', 'Prisma',
  'Firebase', 'Supabase', 'Data Structures and Algorithms',
  'Object-Oriented Programming', 'System Design', 'Operating Systems',
  'Computer Networks', 'Database Management Systems', 'Machine Learning',
  'Deep Learning', 'Artificial Intelligence', 'Generative AI',
  'Natural Language Processing', 'Computer Vision', 'PyTorch',
  'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'Data Analysis',
  'Data Visualization', 'Power BI', 'Tableau', 'Microsoft Excel',
  'Statistics', 'Probability', 'Cybersecurity', 'Networking',
  'Software Testing', 'Jest', 'Vitest', 'Cypress', 'Playwright',
  'Selenium', 'Agile', 'Scrum', 'Figma', 'UI/UX Design',
  'Tailwind CSS', 'Bootstrap', 'Redux', 'React Native', 'Flutter',
  'Apache Spark', 'Hadoop', 'ETL', 'Data Engineering', 'LLMs',
  'Prompt Engineering', 'MLOps', 'Blockchain', 'Solidity',
];

export const ProfilePage: React.FC = () => {
  const { refreshProfile } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProf, setNewSkillProf] =
    useState<Proficiency>('INTERMEDIATE');
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const res: any = await api.get('/profile');
        if (!cancelled && res.success && res.profile) {
          setProfile(res.profile);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const existingSkillNames = useMemo(
    () =>
      (profile?.userSkills || []).map((item: any) =>
        (item.skill?.name || item.name || '').trim().toLowerCase()
      ),
    [profile?.userSkills]
  );

  const filteredSkills = useMemo(() => {
    const query = newSkillName.trim().toLowerCase();
    if (!query) return [];

    return SKILL_SUGGESTIONS.filter(
      (skill) =>
        skill.toLowerCase().includes(query) &&
        !existingSkillNames.includes(skill.toLowerCase())
    ).slice(0, 8);
  }, [newSkillName, existingSkillNames]);

  const selectSkillSuggestion = (skill: string) => {
    setNewSkillName(skill);
    setIsSkillDropdownOpen(false);
    setActiveSuggestion(0);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);

    try {
      const graduationYear = Number.parseInt(
        String(profile.graduationYear ?? ''),
        10
      );

      const res: any = await api.put('/profile', {
        displayName: profile.displayName,
        educationLevel: profile.educationLevel,
        university: profile.university,
        degree: profile.degree,
        graduationYear: Number.isFinite(graduationYear)
          ? graduationYear
          : undefined,
        targetRole: profile.targetRole,
        experienceLevel: profile.experienceLevel,
        bio: profile.bio,
        preferredLocations: profile.preferredLocations,
        preferredWorkModes: profile.preferredWorkModes,
      });

      if (res.success) {
        await refreshProfile();
        alert('Profile updated successfully!');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();

    const skillName = newSkillName.trim();
    if (!skillName || isAddingSkill) return;

    const duplicate = existingSkillNames.includes(skillName.toLowerCase());

    if (duplicate) {
      alert('This skill is already in your profile.');
      return;
    }

    setIsAddingSkill(true);

    try {
      const res: any = await api.post('/profile/skills', {
        name: skillName,
        proficiency: newSkillProf,
      });

      if (res.success) {
        setNewSkillName('');
        setNewSkillProf('INTERMEDIATE');
        setIsSkillDropdownOpen(false);
        setActiveSuggestion(0);

        const pRes: any = await api.get('/profile');
        if (pRes.success && pRes.profile) {
          setProfile(pRes.profile);
        }

        await refreshProfile();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add skill');
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await api.delete(`/profile/skills/${skillId}`);

      setProfile((prev: any) => ({
        ...prev,
        userSkills: (prev.userSkills || []).filter(
          (item: any) => item.skillId !== skillId
        ),
      }));

      await refreshProfile();
    } catch (err: any) {
      alert(err.message || 'Failed to remove skill');
    }
  };

  if (!profile) {
    return (
      <div className="p-8 text-sm text-slate-500 dark:text-slate-400">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 pb-12 animate-in fade-in duration-200">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          <User className="h-6 w-6 text-brand-600 dark:text-brand-400" />
          Student Profile & Target Preferences
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Configure your academic background, target roles, and demonstrated
          skills used by the Internship Readiness Engine.
        </p>
      </div>

      <form
        onSubmit={handleSaveProfile}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
          <GraduationCap className="h-4 w-4 text-brand-600" />
          Education & Degree Details
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-semibold text-slate-500">
              Display / Full Name
            </label>
            <input
              type="text"
              required
              value={profile.displayName || ''}
              onChange={(e) =>
                setProfile({ ...profile, displayName: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-500">
              University / College
            </label>
            <input
              type="text"
              value={profile.university || ''}
              onChange={(e) =>
                setProfile({ ...profile, university: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-500">
              Major / Degree
            </label>
            <input
              type="text"
              required
              value={profile.degree || ''}
              onChange={(e) =>
                setProfile({ ...profile, degree: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-500">
              Graduation Year (e.g. 2026, 2027)
            </label>
            <input
              type="number"
              required
              min={2024}
              max={2035}
              value={profile.graduationYear ?? 2027}
              onChange={(e) =>
                setProfile({ ...profile, graduationYear: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <h2 className="flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-bold text-slate-900 dark:border-slate-800 dark:text-slate-100">
          <Briefcase className="h-4 w-4 text-indigo-500" />
          Target Role & Preferences
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-semibold text-slate-500">
              Target Career Role
            </label>
            <input
              type="text"
              required
              value={profile.targetRole || ''}
              onChange={(e) =>
                setProfile({ ...profile, targetRole: e.target.value })
              }
              placeholder="e.g. Software Engineer"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-500">
              Academic Standing / Experience
            </label>
            <select
              value={profile.experienceLevel || 'Junior'}
              onChange={(e) =>
                setProfile({ ...profile, experienceLevel: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="Freshman">Freshman (1st year)</option>
              <option value="Sophomore">Sophomore (2nd year)</option>
              <option value="Junior">Junior (3rd year)</option>
              <option value="Senior">Senior (Final year)</option>
              <option value="Graduate">Master's / Graduate</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block font-semibold text-slate-500">
            Professional Bio & Career Goals
          </label>
          <textarea
            rows={3}
            value={profile.bio || ''}
            onChange={(e) =>
              setProfile({ ...profile, bio: e.target.value })
            }
            placeholder="Brief bio highlighting your core interests and goals..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Demonstrated Skills & Proficiency Ratings
          </h2>
          <span className="text-slate-400">
            {(profile.userSkills || []).length} Skills Logged
          </span>
        </div>

        <p className="text-slate-500 dark:text-slate-400">
          Type a skill name to see suggestions. Choose a proficiency level and
          add the skill to your profile.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {(profile.userSkills || []).map((item: any) => (
            <div
              key={item.id}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
            >
              <span>{item.skill?.name || item.name || 'Skill'}</span>
              <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {item.proficiency}
              </span>
              <button
                type="button"
                onClick={() => handleDeleteSkill(item.skillId)}
                className="ml-1 text-slate-400 transition hover:text-rose-500"
                title="Remove skill"
                aria-label={`Remove ${item.skill?.name || 'skill'}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {(profile.userSkills || []).length === 0 && (
            <p className="italic text-slate-400">No skills added yet.</p>
          )}
        </div>

        <form
          onSubmit={handleAddSkill}
          className="flex flex-wrap items-start gap-2 border-t border-slate-100 pt-4 dark:border-slate-800"
        >
          <div className="relative min-w-[200px] flex-1">
            <label className="mb-1 block font-semibold text-slate-500">
              Skill name
            </label>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isSkillDropdownOpen && filteredSkills.length > 0}
                value={newSkillName}
                onFocus={() => setIsSkillDropdownOpen(true)}
                onChange={(e) => {
                  setNewSkillName(e.target.value);
                  setActiveSuggestion(0);
                  setIsSkillDropdownOpen(true);
                }}
                onBlur={() => {
                  // Delay closing so mouse clicks on suggestions can complete.
                  window.setTimeout(() => setIsSkillDropdownOpen(false), 150);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsSkillDropdownOpen(false);
                    return;
                  }

                  if (
                    e.key === 'ArrowDown' &&
                    filteredSkills.length > 0
                  ) {
                    e.preventDefault();
                    setIsSkillDropdownOpen(true);
                    setActiveSuggestion((current) =>
                      (current + 1) % filteredSkills.length
                    );
                  }

                  if (
                    e.key === 'ArrowUp' &&
                    filteredSkills.length > 0
                  ) {
                    e.preventDefault();
                    setActiveSuggestion((current) =>
                      (current - 1 + filteredSkills.length) %
                      filteredSkills.length
                    );
                  }

                  if (
                    e.key === 'Enter' &&
                    isSkillDropdownOpen &&
                    filteredSkills.length > 0
                  ) {
                    e.preventDefault();
                    selectSkillSuggestion(
                      filteredSkills[activeSuggestion] || filteredSkills[0]
                    );
                  }
                }}
                placeholder="e.g. Python, React, Docker..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />

              {newSkillName && (
                <button
                  type="button"
                  onClick={() => {
                    setNewSkillName('');
                    setIsSkillDropdownOpen(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear skill input"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {isSkillDropdownOpen && filteredSkills.length > 0 && (
              <div
                role="listbox"
                className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
              >
                {filteredSkills.map((skill, index) => (
                  <button
                    key={skill}
                    type="button"
                    role="option"
                    aria-selected={index === activeSuggestion}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectSkillSuggestion(skill)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left transition ${
                      index === activeSuggestion
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{skill}</span>
                    {index === activeSuggestion && (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {newSkillName.trim() && filteredSkills.length === 0 && (
              <p className="mt-1 text-[10px] text-slate-400">
                No matching suggestions. You can add "{newSkillName.trim()}"
                as a custom skill.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-500">
              Proficiency
            </label>
            <select
              value={newSkillProf}
              onChange={(e) =>
                setNewSkillProf(e.target.value as Proficiency)
              }
              className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>

          <div className="self-end">
            <button
              type="submit"
              disabled={!newSkillName.trim() || isAddingSkill}
              className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              {isAddingSkill ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
