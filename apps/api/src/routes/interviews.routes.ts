import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, optionalAuth } from '../middlewares/auth';
import { AIService } from '../services/ai.service';

const router = Router();

const PracticeAnswerSchema = z.object({
  answer: z.string().min(10, 'Please write at least a sentence explaining your answer.'),
});

// GET /api/interviews/questions
router.get('/questions', optionalAuth, async (req: Request, res: Response, next) => {
  try {
    const { category, difficulty, company } = req.query;

    const where: any = {};
    if (category && category !== 'ALL') where.category = category as string;
    if (difficulty && difficulty !== 'ALL') where.difficulty = difficulty as string;
    if (company && company !== 'ALL') where.companyTarget = { contains: company as string };

    const questions = await prisma.interviewQuestion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const formatted = questions.map((q) => ({
      id: q.id,
      companyTarget: q.companyTarget,
      roleTarget: q.roleTarget,
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      interviewerIntent: q.interviewerIntent,
      hints: JSON.parse(q.hintsJson || '[]'),
      starGuide: q.starSituation
        ? {
            situation: q.starSituation,
            task: q.starTask,
            action: q.starAction,
            result: q.starResult,
          }
        : null,
      sampleAnswerOutline: q.sampleAnswerOutline,
      isFromCandidateReport: q.isFromCandidateReport,
      sourceAttribution: q.sourceAttribution,
    }));

    return res.json({ success: true, questions: formatted });
  } catch (err) {
    next(err);
  }
});

// GET /api/interviews/questions/:id
router.get('/questions/:id', optionalAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;

    const q = await prisma.interviewQuestion.findUnique({ where: { id } });
    if (!q) {
      return res.status(404).json({ success: false, error: 'Interview question not found' });
    }

    return res.json({
      success: true,
      question: {
        id: q.id,
        companyTarget: q.companyTarget,
        roleTarget: q.roleTarget,
        category: q.category,
        difficulty: q.difficulty,
        question: q.question,
        interviewerIntent: q.interviewerIntent,
        hints: JSON.parse(q.hintsJson || '[]'),
        starGuide: q.starSituation
          ? {
              situation: q.starSituation,
              task: q.starTask,
              action: q.starAction,
              result: q.starResult,
            }
          : null,
        sampleAnswerOutline: q.sampleAnswerOutline,
        isFromCandidateReport: q.isFromCandidateReport,
        sourceAttribution: q.sourceAttribution,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/interviews/questions/:id/practice
router.post('/questions/:id/practice', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const { answer } = PracticeAnswerSchema.parse(req.body);

    const question = await prisma.interviewQuestion.findUnique({ where: { id } });
    if (!question) {
      return res.status(404).json({ success: false, error: 'Interview question not found' });
    }

    const evaluation = await AIService.evaluateInterviewAnswer({
      question: question.question,
      category: question.category,
      studentAnswer: answer,
      interviewerIntent: question.interviewerIntent,
      starGuide: question.starSituation
        ? {
            situation: question.starSituation,
            task: question.starTask,
            action: question.starAction,
            result: question.starResult,
          }
        : undefined,
    });

    const session = await prisma.interviewPracticeSession.create({
      data: {
        userId: req.user!.userId,
        questionId: id,
        studentAnswer: answer,
        feedbackScore: evaluation.score,
        feedbackJson: JSON.stringify(evaluation),
      },
      include: { question: true },
    });

    return res.status(201).json({
      success: true,
      evaluation,
      session: {
        id: session.id,
        completedAt: session.completedAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/interviews/history
router.get('/history', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const sessions = await prisma.interviewPracticeSession.findMany({
      where: { userId: req.user!.userId },
      include: { question: true },
      orderBy: { completedAt: 'desc' },
      take: 20,
    });

    const formatted = sessions.map((s) => ({
      id: s.id,
      questionId: s.questionId,
      questionTitle: s.question.question,
      category: s.question.category,
      company: s.question.companyTarget,
      studentAnswer: s.studentAnswer,
      feedbackScore: s.feedbackScore,
      feedback: JSON.parse(s.feedbackJson || '{}'),
      completedAt: s.completedAt.toISOString(),
    }));

    return res.json({ success: true, history: formatted });
  } catch (err) {
    next(err);
  }
});

export default router;
