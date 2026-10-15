import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth } from '../middlewares/auth';
import { logAuditEvent } from '../services/audit.service';

const router = Router();

const ResumeSchema = z.object({
  title: z.string().min(1).default('My Technical Resume'),
  templateId: z.enum(['modern-tech', 'executive-clean', 'minimalist-academic']).default('modern-tech'),
  targetRole: z.string().optional(),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  summary: z.string().min(1),
  sections: z.array(z.any()).default([]),
});

// GET /api/resumes
router.get('/', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user!.userId },
      orderBy: { updatedAt: 'desc' },
    });

    const formatted = resumes.map((r) => ({
      ...r,
      sections: JSON.parse(r.sectionsJson || '[]'),
    }));

    return res.json({ success: true, resumes: formatted });
  } catch (err) {
    next(err);
  }
});

// GET /api/resumes/:id
router.get('/:id', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;

    const resume = await prisma.resume.findFirst({
      where: { id, userId: req.user!.userId }, // strict user isolation
    });

    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    return res.json({
      success: true,
      resume: {
        ...resume,
        sections: JSON.parse(resume.sectionsJson || '[]'),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/resumes
router.post('/', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const data = ResumeSchema.parse(req.body);

    const resume = await prisma.resume.create({
      data: {
        userId: req.user!.userId,
        title: data.title,
        templateId: data.templateId,
        targetRole: data.targetRole,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        website: data.website,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        summary: data.summary,
        sectionsJson: JSON.stringify(data.sections),
      },
    });

    await logAuditEvent({
      userId: req.user!.userId,
      eventType: 'RESUME_CREATED',
      details: { resumeId: resume.id, title: resume.title },
    });

    return res.status(201).json({
      success: true,
      resume: {
        ...resume,
        sections: data.sections,
      },
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/resumes/:id
router.put('/:id', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const data = ResumeSchema.partial().parse(req.body);

    const existing = await prisma.resume.findFirst({
      where: { id, userId: req.user!.userId },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    const updatePayload: any = {};
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.templateId !== undefined) updatePayload.templateId = data.templateId;
    if (data.targetRole !== undefined) updatePayload.targetRole = data.targetRole;
    if (data.fullName !== undefined) updatePayload.fullName = data.fullName;
    if (data.email !== undefined) updatePayload.email = data.email;
    if (data.phone !== undefined) updatePayload.phone = data.phone;
    if (data.location !== undefined) updatePayload.location = data.location;
    if (data.website !== undefined) updatePayload.website = data.website;
    if (data.githubUrl !== undefined) updatePayload.githubUrl = data.githubUrl;
    if (data.linkedinUrl !== undefined) updatePayload.linkedinUrl = data.linkedinUrl;
    if (data.summary !== undefined) updatePayload.summary = data.summary;
    if (data.sections !== undefined) updatePayload.sectionsJson = JSON.stringify(data.sections);

    const updated = await prisma.resume.update({
      where: { id },
      data: updatePayload,
    });

    return res.json({
      success: true,
      resume: {
        ...updated,
        sections: JSON.parse(updated.sectionsJson || '[]'),
      },
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/resumes/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;

    const result = await prisma.resume.deleteMany({
      where: { id, userId: req.user!.userId },
    });

    if (result.count === 0) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    return res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/resumes/:id/ats-scan — ATS Keyword Coverage Analysis
router.post('/:id/ats-scan', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const { jobDescription, internshipId } = req.body;

    const resume = await prisma.resume.findFirst({
      where: { id, userId: req.user!.userId },
    });

    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    let targetText = jobDescription || '';
    if (!targetText && internshipId) {
      const internship = await prisma.internship.findUnique({
        where: { id: internshipId },
        include: { skills: { include: { skill: true } } },
      });
      if (internship) {
        targetText = `${internship.title} ${internship.description} ${internship.skills.map((s) => s.skill.name).join(' ')}`;
      }
    }

    if (!targetText.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a job description or choose an internship opportunity to scan against.',
      });
    }

    // Combine all resume text
    const resumeFullText = `${resume.summary} ${resume.sectionsJson}`.toLowerCase();

    // Extract tech & domain keywords from JD
    const commonKeywords = [
      'typescript', 'javascript', 'python', 'java', 'c++', 'go', 'rust',
      'react', 'node.js', 'express', 'next.js', 'sql', 'postgresql', 'mongodb',
      'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'git', 'ci/cd',
      'data structures', 'algorithms', 'system design', 'rest', 'api',
      'pytorch', 'tensorflow', 'machine learning', 'distributed systems', 'linux'
    ];

    const jdLower = targetText.toLowerCase();
    const targetKeywords = commonKeywords.filter((kw) => jdLower.includes(kw));

    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    for (const kw of targetKeywords) {
      if (resumeFullText.includes(kw)) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    }

    const matchRate = targetKeywords.length > 0
      ? Math.round((matchedKeywords.length / targetKeywords.length) * 100)
      : 80;

    const suggestions: string[] = [];
    if (missingKeywords.length > 0) {
      suggestions.push(`Consider mentioning hands-on academic or project experience with: ${missingKeywords.slice(0, 4).join(', ')}.`);
    }
    if (!resume.summary.toLowerCase().includes('seeking') && !resume.summary.toLowerCase().includes('internship')) {
      suggestions.push('Specify your internship graduation timeline in your professional summary.');
    }
    suggestions.push('Ensure project bullet points begin with strong action verbs (Engineered, Architected, Reduced, Spearheaded).');

    return res.json({
      success: true,
      analysis: {
        matchScore: matchRate,
        totalKeywordsChecked: targetKeywords.length,
        matchedKeywords,
        missingKeywords,
        suggestions,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
