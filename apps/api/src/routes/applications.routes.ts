import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth } from '../middlewares/auth';
import { formatInternship } from './internships.routes';

const router = Router();

const VALID_STATUSES = [
  'INTERESTED',
  'PREPARING',
  'READY_TO_APPLY',
  'APPLIED',
  'ASSESSMENT',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
] as const;

const CreateAppSchema = z.object({
  internshipId: z.string().optional(),
  companyName: z.string().min(1, 'Company name is required'),
  roleTitle: z.string().min(1, 'Role title is required'),
  applicationUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(VALID_STATUSES).default('INTERESTED'),
  deadline: z.string().optional(),
  notes: z.string().optional(),
  nextAction: z.string().optional(),
  interviewDate: z.string().optional(),
});

const UpdateAppSchema = z.object({
  companyName: z.string().min(1).optional(),
  roleTitle: z.string().min(1).optional(),
  applicationUrl: z.string().optional(),
  status: z.enum(VALID_STATUSES).optional(),
  statusNote: z.string().optional(),
  dateApplied: z.string().optional(),
  deadline: z.string().optional(),
  nextAction: z.string().optional(),
  reminderDate: z.string().optional(),
  interviewDate: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/applications
router.get('/', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const apps = await prisma.application.findMany({
      where: { userId: req.user!.userId },
      include: {
        internship: {
          include: {
            company: true,
            skills: { include: { skill: true } },
          },
        },
        statusHistory: {
          orderBy: { timestamp: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const formatted = apps.map((app) => ({
      ...app,
      internship: app.internship ? formatInternship(app.internship) : null,
    }));

    return res.json({ success: true, applications: formatted });
  } catch (err) {
    next(err);
  }
});

// POST /api/applications
router.post('/', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const data = CreateAppSchema.parse(req.body);

    const app = await prisma.application.create({
      data: {
        userId: req.user!.userId,
        internshipId: data.internshipId || null,
        companyName: data.companyName,
        roleTitle: data.roleTitle,
        applicationUrl: data.applicationUrl || null,
        status: data.status,
        deadline: data.deadline ? new Date(data.deadline) : null,
        notes: data.notes || null,
        nextAction: data.nextAction || null,
        interviewDate: data.interviewDate ? new Date(data.interviewDate) : null,
        dateApplied: data.status === 'APPLIED' ? new Date() : null,
        statusHistory: {
          create: {
            toStatus: data.status,
            note: 'Application tracked in system',
          },
        },
      },
      include: {
        statusHistory: true,
      },
    });

    return res.status(201).json({ success: true, application: app });
  } catch (err) {
    next(err);
  }
});

// PUT /api/applications/:id
router.put('/:id', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const data = UpdateAppSchema.parse(req.body);

    const existing = await prisma.application.findFirst({
      where: { id, userId: req.user!.userId },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const updatePayload: any = {};
    if (data.companyName !== undefined) updatePayload.companyName = data.companyName;
    if (data.roleTitle !== undefined) updatePayload.roleTitle = data.roleTitle;
    if (data.applicationUrl !== undefined) updatePayload.applicationUrl = data.applicationUrl || null;
    if (data.notes !== undefined) updatePayload.notes = data.notes;
    if (data.nextAction !== undefined) updatePayload.nextAction = data.nextAction;
    if (data.deadline !== undefined) updatePayload.deadline = data.deadline ? new Date(data.deadline) : null;
    if (data.interviewDate !== undefined)
      updatePayload.interviewDate = data.interviewDate ? new Date(data.interviewDate) : null;
    if (data.reminderDate !== undefined)
      updatePayload.reminderDate = data.reminderDate ? new Date(data.reminderDate) : null;
    if (data.dateApplied !== undefined)
      updatePayload.dateApplied = data.dateApplied ? new Date(data.dateApplied) : null;

    // Check if status changed
    if (data.status && data.status !== existing.status) {
      updatePayload.status = data.status;
      if (data.status === 'APPLIED' && !existing.dateApplied) {
        updatePayload.dateApplied = new Date();
      }

      await prisma.applicationStatusHistory.create({
        data: {
          applicationId: id,
          fromStatus: existing.status,
          toStatus: data.status,
          note: data.statusNote || `Moved to ${data.status}`,
        },
      });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: updatePayload,
      include: {
        statusHistory: { orderBy: { timestamp: 'desc' } },
        internship: {
          include: {
            company: true,
            skills: { include: { skill: true } },
          },
        },
      },
    });

    return res.json({
      success: true,
      application: {
        ...updated,
        internship: updated.internship ? formatInternship(updated.internship) : null,
      },
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/applications/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;

    const result = await prisma.application.deleteMany({
      where: { id, userId: req.user!.userId },
    });

    if (result.count === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    return res.json({ success: true, message: 'Application deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /api/applications/stats
router.get('/stats', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const apps = await prisma.application.findMany({
      where: { userId: req.user!.userId },
      select: { status: true },
    });

    const counts: Record<string, number> = {
      INTERESTED: 0,
      PREPARING: 0,
      READY_TO_APPLY: 0,
      APPLIED: 0,
      ASSESSMENT: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
      WITHDRAWN: 0,
    };

    for (const app of apps) {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
    }

    return res.json({
      success: true,
      stats: {
        total: apps.length,
        byStatus: counts,
        inProgress: counts.APPLIED + counts.ASSESSMENT + counts.INTERVIEW,
        offers: counts.OFFER,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
