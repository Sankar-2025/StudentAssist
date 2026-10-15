import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth } from '../middlewares/auth';
import { syncConfiguredSources } from '../services/internship-collector.service';

const router = Router();
router.use(requireAuth);
router.use((req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ success: false, error: 'Admin access required.' });
  next();
});

const SourceSchema = z.object({
  sourceName: z.string().min(2).max(160),
  sourceUrl: z.string().url().refine((v) => v.startsWith('https://'), 'Source URL must use HTTPS.'),
  sourceType: z.enum(['AUTO', 'HTML', 'RSS']).optional().default('AUTO'),
  organizationType: z.enum(['IIT_IISc', 'ISRO', 'DRDO', 'GOVERNMENT', 'MNC', 'OTHER']).optional().default('OTHER'),
  active: z.boolean().optional().default(true),
});

const ApproveSchema = z.object({
  indiaEligible: z.literal(true, { errorMap: () => ({ message: 'Confirm that this role is explicitly open to candidates in India.' }) }),
  companyName: z.string().min(2).max(160),
  companyWebsite: z.string().url().optional(),
  title: z.string().min(3).max(250),
  category: z.string().min(2).max(100).optional().default('Internship'),
  location: z.string().min(2).max(160),
  workMode: z.enum(['REMOTE', 'HYBRID', 'ONSITE']).optional().default('ONSITE'),
  duration: z.string().max(100).optional(),
  stipend: z.string().max(120).optional(),
  isPaid: z.boolean().optional().default(false),
  description: z.string().min(20).max(10000),
  requirements: z.array(z.string().max(300)).max(50).optional().default([]),
  skills: z.array(z.string().trim().min(1).max(100)).max(50).optional(),
  allowedDegrees: z.array(z.string().max(120)).max(30).optional().default([]),
  deadline: z.string().datetime().optional(),
  applyUrl: z.string().url(),
  sourceUrl: z.string().url(),
  notes: z.string().max(1000).optional(),
});

router.get('/sources', async (_req, res, next) => {
  try {
    const sources = await prisma.internshipSource.findMany({ include: { _count: { select: { candidates: true, syncRuns: true } } }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: sources });
  } catch (e) { next(e); }
});

router.post('/sources', async (req, res, next) => {
  try {
    const data = SourceSchema.parse(req.body);
    const source = await prisma.internshipSource.create({ data });
    res.status(201).json({ success: true, source });
  } catch (e) { next(e); }
});

router.patch('/sources/:id', async (req, res, next) => {
  try {
    const data = SourceSchema.partial().parse(req.body);
    const source = await prisma.internshipSource.update({ where: { id: req.params.id }, data });
    res.json({ success: true, source });
  } catch (e) { next(e); }
});

router.post('/sync', async (_req, res, next) => {
  try { res.json({ success: true, summary: await syncConfiguredSources() }); }
  catch (e) { next(e); }
});

router.get('/candidates', async (req, res, next) => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : 'PENDING';
    if (!['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'ALL'].includes(status)) return res.status(400).json({ success: false, error: 'Invalid status filter.' });
    const data = await prisma.internshipImportCandidate.findMany({
      where: status === 'ALL' ? {} : { reviewStatus: status },
      include: { source: true }, orderBy: { lastSeenAt: 'desc' }, take: 200,
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.post('/candidates/:id/reject', async (req, res, next) => {
  try {
    const notes = z.object({ notes: z.string().max(1000).optional() }).parse(req.body || {});
    const candidate = await prisma.internshipImportCandidate.update({ where: { id: req.params.id }, data: { reviewStatus: 'REJECTED', reviewNotes: notes.notes || null, reviewedAt: new Date() } });
    res.json({ success: true, candidate });
  } catch (e) { next(e); }
});

router.post('/candidates/:id/approve', async (req, res, next) => {
  try {
    const data = ApproveSchema.parse(req.body);
    const candidate = await prisma.internshipImportCandidate.findUnique({ where: { id: req.params.id } });
    if (!candidate) return res.status(404).json({ success: false, error: 'Candidate not found.' });
    if (candidate.reviewStatus === 'APPROVED' && candidate.importedInternshipId) return res.status(409).json({ success: false, error: 'Candidate has already been imported.' });
    if (data.deadline && new Date(data.deadline).getTime() < Date.now()) return res.status(400).json({ success: false, error: 'Cannot publish an internship with a past deadline.' });
    for (const value of [data.applyUrl, data.sourceUrl]) {
      const u = new URL(value);
      if (u.protocol !== 'https:') return res.status(400).json({ success: false, error: 'Application and source URLs must use HTTPS.' });
    }
    const existing = await prisma.internship.findFirst({ where: { sourceUrl: data.sourceUrl } });
    if (existing) return res.status(409).json({ success: false, error: 'An internship with this source URL is already published.' });
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.upsert({
        where: { name: data.companyName },
        update: { website: data.companyWebsite || undefined },
        create: { name: data.companyName, website: data.companyWebsite, industry: 'Internship Provider' },
      });
      const internship = await tx.internship.create({ data: {
        companyId: company.id, title: data.title, category: data.category,
        location: data.location, country: 'India', workMode: data.workMode,
        duration: data.duration, stipend: data.stipend, isPaid: data.isPaid,
        description: data.description, requirements: JSON.stringify(data.requirements),
        allowedDegrees: JSON.stringify(data.allowedDegrees), officialApplyUrl: data.applyUrl,
        deadline: data.deadline || null, verificationStatus: 'VERIFIED_OFFICIAL',
        sourceUrl: data.sourceUrl, sourceType: `Official source reviewed by admin: ${candidate.sourceName}`,
        lastCheckedDate: new Date(), isDemoData: false,
        postedAt: candidate.publishedAt || new Date(),
      } });
      
      // Save admin-reviewed skills and connect them to this internship.
      const reviewedSkills = [...new Set(
        (data.skills ?? [])
          .map((skill) => skill.trim())
          .filter(Boolean)
      )];

      for (const skillName of reviewedSkills) {
        const skill = await tx.skill.upsert({
          where: { name: skillName },
          update: {},
          create: {
            name: skillName,
            category: 'GENERAL',
          },
        });

        await tx.internshipSkill.upsert({
          where: {
            internshipId_skillId: {
              internshipId: internship.id,
              skillId: skill.id,
            },
          },
          update: { isRequired: true },
          create: {
            internshipId: internship.id,
            skillId: skill.id,
            isRequired: true,
          },
        });
      }
      await tx.internshipImportCandidate.update({ where: { id: candidate.id }, data: { reviewStatus: 'APPROVED', reviewNotes: data.notes || null, reviewedAt: new Date(), importedInternshipId: internship.id } });
      return internship;
    });
    res.status(201).json({ success: true, internship: result });
  } catch (e) { next(e); }
});

export default router;
