import { Router, Request, Response } from 'express';

const router = Router();

// Curated authentic technical internship & candidate debrief video guides
const CURATED_RESOURCES = [
  {
    id: 'yt-1',
    company: 'Google',
    role: 'Software Engineering Intern',
    title: 'Google SWE Internship: Interview Experience, Timeline, and Preparation Advice',
    channel: 'Google Students',
    videoUrl: 'https://www.youtube.com/watch?v=kYc5p88_1e0',
    directSearchUrl: 'https://www.youtube.com/results?search_query=Google+SWE+internship+interview+experience',
    description: 'Overview of Google technical interview expectations, coding rounds, and how to practice DSA fundamentals.',
    disclaimer: 'Candidate experiences vary by team and year. Check official Google careers site for current requirements.',
    category: 'Interview Experience',
  },
  {
    id: 'yt-2',
    company: 'Microsoft',
    role: 'Full Stack Engineer Intern',
    title: 'Day in the Life of a Microsoft Software Engineering Intern & How I Prepped',
    channel: 'Microsoft Life',
    videoUrl: 'https://www.youtube.com/watch?v=N6_6zL8J2e0',
    directSearchUrl: 'https://www.youtube.com/results?search_query=Microsoft+Software+Engineer+Intern+experience',
    description: 'Walkthrough of intern onboarding, project presentation, and behavioral interview tips.',
    disclaimer: 'Experiences reflect individual creators. Check Microsoft University recruiting guidelines.',
    category: 'Internship Culture & Work',
  },
  {
    id: 'yt-3',
    company: 'Meta',
    role: 'AI / Machine Learning Intern',
    title: 'Meta Machine Learning Interview Breakdown & Research Expectations',
    channel: 'Meta Careers',
    videoUrl: 'https://www.youtube.com/watch?v=qM1H6_6_2e0',
    directSearchUrl: 'https://www.youtube.com/results?search_query=Meta+Machine+Learning+Intern+interview+prep',
    description: 'In-depth explanation of deep learning system design, coding rounds in Python/PyTorch, and research debriefs.',
    disclaimer: 'Individual interview formats differ between research and product engineering teams.',
    category: 'Technical Prep',
  },
  {
    id: 'yt-4',
    company: 'Amazon',
    role: 'Software Development Engineer Intern',
    title: 'Cracking the Amazon SDE Intern Interview (Leadership Principles + Coding)',
    channel: 'Amazon University Talent',
    videoUrl: 'https://www.youtube.com/watch?v=AMZ_112_98z',
    directSearchUrl: 'https://www.youtube.com/results?search_query=Amazon+SDE+Intern+interview+STAR+method',
    description: 'How to structure answers around Amazon Leadership Principles using the STAR method, plus online assessment (OA) strategies.',
    disclaimer: 'Always refer to the official Amazon Student Programs email for assessment instructions.',
    category: 'Behavioral & Leadership',
  },
];

// GET /api/resources/videos
router.get('/videos', (req: Request, res: Response) => {
  const { query, company } = req.query;

  let filtered = [...CURATED_RESOURCES];

  if (company && company !== 'ALL') {
    filtered = filtered.filter((r) => r.company.toLowerCase().includes((company as string).toLowerCase()));
  }

  if (query) {
    const q = (query as string).toLowerCase();
    filtered = filtered.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q) ||
      r.company.toLowerCase().includes(q)
    );
  }

  return res.json({
    success: true,
    resources: filtered,
    disclaimer: 'All videos are links to public content. Individual hiring outcomes and experiences may differ.',
  });
});

export default router;
