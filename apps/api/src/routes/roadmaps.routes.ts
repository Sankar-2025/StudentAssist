import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireAuth, optionalAuth } from '../middlewares/auth';

const router = Router();

// GET /api/roadmaps
router.get('/', optionalAuth, async (req: Request, res: Response, next) => {
  try {
    const roadmaps = await prisma.learningRoadmap.findMany({
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let completedStepIds = new Set<string>();
    if (req.user) {
      const progress = await prisma.userRoadmapProgress.findMany({
        where: { userId: req.user.userId, isCompleted: true },
      });
      completedStepIds = new Set(progress.map((p) => p.stepId));
    }

    const data = roadmaps.map((rm) => {
      const totalSteps = rm.steps.length;
      const completedSteps = rm.steps.filter((s) => completedStepIds.has(s.id)).length;
      return {
        id: rm.id,
        targetRole: rm.targetRole,
        title: rm.title,
        description: rm.description,
        category: rm.category,
        totalSteps,
        completedSteps,
        progressPercent: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
      };
    });

    return res.json({ success: true, roadmaps: data });
  } catch (err) {
    next(err);
  }
});

// GET /api/roadmaps/:role
router.get('/:role', optionalAuth, async (req: Request, res: Response, next) => {
  try {
    const { role } = req.params;

    const roadmap = await prisma.learningRoadmap.findFirst({
      where: {
        OR: [
          { targetRole: { contains: role } },
          { title: { contains: role } },
          { id: role },
        ],
      },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    if (!roadmap) {
      return res.status(404).json({ success: false, error: 'Roadmap not found' });
    }

    let completedStepIds = new Set<string>();
    if (req.user) {
      const progress = await prisma.userRoadmapProgress.findMany({
        where: { userId: req.user.userId, isCompleted: true },
      });
      completedStepIds = new Set(progress.map((p) => p.stepId));
    }

    const formattedSteps = roadmap.steps.map((step) => ({
      id: step.id,
      stepNumber: step.stepNumber,
      title: step.title,
      description: step.description,
      prerequisites: JSON.parse(step.prerequisites || '[]'),
      skillsCovered: JSON.parse(step.skillsCovered || '[]'),
      estimatedHours: step.estimatedHours,
      isCompleted: completedStepIds.has(step.id),
      resources: JSON.parse(step.resourcesJson || '[]'),
      practiceTasks: JSON.parse(step.practiceTasksJson || '[]'),
    }));

    const totalSteps = formattedSteps.length;
    const completedSteps = formattedSteps.filter((s) => s.isCompleted).length;

    return res.json({
      success: true,
      roadmap: {
        id: roadmap.id,
        targetRole: roadmap.targetRole,
        title: roadmap.title,
        description: roadmap.description,
        category: roadmap.category,
        totalSteps,
        completedSteps,
        progressPercent: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
        steps: formattedSteps,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/roadmaps/steps/:stepId/toggle
router.post('/steps/:stepId/toggle', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { stepId } = req.params;

    const existing = await prisma.userRoadmapProgress.findUnique({
      where: {
        userId_stepId: {
          userId: req.user!.userId,
          stepId,
        },
      },
    });

    const isCompleted = existing ? !existing.isCompleted : true;

    const progress = await prisma.userRoadmapProgress.upsert({
      where: {
        userId_stepId: {
          userId: req.user!.userId,
          stepId,
        },
      },
      update: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        userId: req.user!.userId,
        stepId,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    return res.json({ success: true, stepId, isCompleted: progress.isCompleted });
  } catch (err) {
    next(err);
  }
});

export default router;
