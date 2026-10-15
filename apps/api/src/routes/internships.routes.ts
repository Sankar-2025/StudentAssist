import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireAuth, optionalAuth } from '../middlewares/auth';

const router = Router();

// Helper to format internship model into InternshipDTO
export function formatInternship(item: any) {
  const reqSkills: string[] = [];
  const prefSkills: string[] = [];

  if (item.skills) {
    for (const is of item.skills) {
      if (is.isRequired) {
        reqSkills.push(is.skill.name);
      } else {
        prefSkills.push(is.skill.name);
      }
    }
  }

  return {
    id: item.id,
    companyName: item.company?.name || 'Company',
    companyLogoUrl: item.company?.logoUrl || null,
    companyWebsite: item.company?.website || null,
    title: item.title,
    category: item.category,
    location: item.location,
    country: item.country || 'Unknown',
    workMode: item.workMode,
    duration: item.duration,
    stipend: item.stipend,
    isPaid: item.isPaid,
    description: item.description,
    requirements: JSON.parse(item.requirements || '[]'),
    requiredSkills: reqSkills,
    preferredSkills: prefSkills,
    minGraduationYear: item.minGraduationYear,
    maxGraduationYear: item.maxGraduationYear,
    allowedDegrees: JSON.parse(item.allowedDegrees || '[]'),
    officialApplyUrl: item.officialApplyUrl,
    deadline: item.deadline,
    verificationStatus: item.verificationStatus,
    evidence: {
      sourceUrl: item.sourceUrl,
      sourceType: item.sourceType,
      lastCheckedDate: item.lastCheckedDate.toISOString(),
      deadline: item.deadline || undefined,
      deadlineVerified: !!item.deadline,
      verificationStatus: item.verificationStatus,
      verificationNotes: item.isDemoData ? 'Development sample data - clearly identified' : 'Verified against official career portal',
      compensationDetails: item.stipend || 'Compensation not publicly listed',
    },
    isDemoData: item.isDemoData,
    postedAt: item.postedAt.toISOString(),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

// GET /api/internships
router.get('/', optionalAuth, async (req: Request, res: Response, next) => {
  try {
    const {
      search,
      category,
      workMode,
      skill,
      isPaid,
      verificationStatus,
      sortBy = 'recent',
      page = '1',
      limit = '10',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * pageSize;

    // Public discovery is India-only. Unknown/legacy demo rows are intentionally excluded until reviewed.
    const where: any = { country: 'India', AND: [{ OR: [{ deadline: null }, { deadline: { gte: new Date().toISOString().slice(0, 10) } }] }] };

    if (search) {
      const q = (search as string).trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { company: { name: { contains: q } } },
      ];
    }

    if (category) {
      where.category = { contains: category as string };
    }

    if (workMode && workMode !== 'ALL') {
      where.workMode = workMode as string;
    }

    if (isPaid === 'true') {
      where.isPaid = true;
    }

    if (verificationStatus && verificationStatus !== 'ALL') {
      where.verificationStatus = verificationStatus as string;
    }

    if (skill) {
      where.skills = {
        some: {
          skill: {
            name: { contains: skill as string },
          },
        },
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'deadline') {
      orderBy = { deadline: 'asc' };
    } else if (sortBy === 'title') {
      orderBy = { title: 'asc' };
    }

    const [total, items] = await Promise.all([
      prisma.internship.count({ where }),
      prisma.internship.findMany({
        where,
        include: {
          company: true,
          skills: {
            include: { skill: true },
          },
        },
        orderBy,
        skip,
        take: pageSize,
      }),
    ]);

    // Check saved status if user is authenticated
    let savedIds = new Set<string>();
    if (req.user) {
      const saved = await prisma.savedInternship.findMany({
        where: { userId: req.user.userId },
        select: { internshipId: true },
      });
      savedIds = new Set(saved.map((s) => s.internshipId));
    }

    const formatted = items.map((item) => ({
      ...formatInternship(item),
      isSaved: savedIds.has(item.id),
    }));

    return res.json({
      success: true,
      data: formatted,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/internships/saved/all
router.get('/saved/all', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const saved = await prisma.savedInternship.findMany({
      where: { userId: req.user!.userId, internship: { country: 'India', OR: [{ deadline: null }, { deadline: { gte: new Date().toISOString().slice(0, 10) } }] } },
      include: {
        internship: {
          include: {
            company: true,
            skills: {
              include: { skill: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = saved.map((s) => ({
      savedAt: s.createdAt,
      internship: {
        ...formatInternship(s.internship),
        isSaved: true,
      },
    }));

    return res.json({ success: true, saved: data });
  } catch (err) {
    next(err);
  }
});

// GET /api/internships/:id
router.get('/:id', optionalAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;

    const item = await prisma.internship.findUnique({
      where: { id },
      include: {
        company: true,
        skills: {
          include: { skill: true },
        },
      },
    });

    if (!item || item.country !== 'India' || (item.deadline && item.deadline < new Date().toISOString().slice(0, 10))) {
      return res.status(404).json({ success: false, error: 'Internship opportunity not found' });
    }

    let isSaved = false;
    if (req.user) {
      const saved = await prisma.savedInternship.findUnique({
        where: {
          userId_internshipId: {
            userId: req.user.userId,
            internshipId: id,
          },
        },
      });
      isSaved = !!saved;
    }

    return res.json({
      success: true,
      internship: {
        ...formatInternship(item),
        isSaved,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/internships/:id/save
router.post('/:id/save', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;

    const internship = await prisma.internship.findUnique({ where: { id } });
    if (!internship) {
      return res.status(404).json({ success: false, error: 'Internship not found' });
    }

    await prisma.savedInternship.upsert({
      where: {
        userId_internshipId: {
          userId: req.user!.userId,
          internshipId: id,
        },
      },
      update: {},
      create: {
        userId: req.user!.userId,
        internshipId: id,
      },
    });

    return res.json({ success: true, message: 'Internship saved to your bookmarks' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/internships/:id/save
router.delete('/:id/save', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;

    await prisma.savedInternship.deleteMany({
      where: {
        userId: req.user!.userId,
        internshipId: id,
      },
    });

    return res.json({ success: true, message: 'Internship removed from your bookmarks' });
  } catch (err) {
    next(err);
  }
});

export default router;
