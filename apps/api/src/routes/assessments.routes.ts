import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireAuth } from '../middlewares/auth';

const router = Router();

type AssessmentQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

function parseQuestions(json: string): AssessmentQuestion[] {
  const parsed: unknown = JSON.parse(json);

  if (!Array.isArray(parsed)) {
    throw new Error('Invalid assessment questions format');
  }

  for (const q of parsed) {
    if (
      typeof q.question !== 'string' ||
      !Array.isArray(q.options) ||
      !q.options.every((option: unknown) => typeof option === 'string') ||
      !Number.isInteger(q.correctAnswer) ||
      q.correctAnswer < 0 ||
      q.correctAnswer >= q.options.length
    ) {
      throw new Error('Invalid assessment question');
    }
  }

  return parsed as AssessmentQuestion[];
}

// GET /api/assessments
// List active assessments for students.
router.get('/', requireAuth, async (_req: Request, res: Response, next) => {
  try {
    const assessments = await prisma.skillAssessment.findMany({
      where: { isActive: true },
      select: {
        id: true,
        stepId: true,
        title: true,
        description: true,
        skillName: true,
        difficulty: true,
        durationMinutes: true,
        passingScore: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, assessments });
  } catch (err) {
    next(err);
  }
});

// GET /api/assessments/:id
// Return assessment questions without correct answers.
router.get('/:id', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const assessment = await prisma.skillAssessment.findFirst({
      where: { id: req.params.id, isActive: true },
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found',
      });
    }

    const questions = parseQuestions(assessment.questionsJson).map((q) => ({
      question: q.question,
      options: q.options,
    }));

    return res.json({
      success: true,
      assessment: {
        id: assessment.id,
        title: assessment.title,
        description: assessment.description,
        skillName: assessment.skillName,
        difficulty: assessment.difficulty,
        durationMinutes: assessment.durationMinutes,
        passingScore: assessment.passingScore,
        questions,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/assessments/:id/submit
// Grade answers on the server and save the attempt.
router.post('/:id/submit', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const assessment = await prisma.skillAssessment.findFirst({
      where: { id: req.params.id, isActive: true },
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found',
      });
    }

    const submittedAnswers: unknown = req.body?.answers;

    if (
      !Array.isArray(submittedAnswers) ||
      submittedAnswers.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: 'Submit an answers array with at least one answer.',
      });
    }

    const questions = parseQuestions(assessment.questionsJson);

    if (submittedAnswers.length !== questions.length) {
      return res.status(400).json({
        success: false,
        error: `Submit exactly ${questions.length} answers.`,
      });
    }

    if (
      !submittedAnswers.every(
        (answer: unknown) =>
          Number.isInteger(answer) &&
          (answer as number) >= 0
      )
    ) {
      return res.status(400).json({
        success: false,
        error: 'Each answer must be a non-negative option index.',
      });
    }

    for (let i = 0; i < questions.length; i++) {
      if (submittedAnswers[i] >= questions[i].options.length) {
        return res.status(400).json({
          success: false,
          error: `Answer ${i + 1} has an invalid option index.`,
        });
      }
    }

    const correctCount = questions.reduce(
      (total, question, index) =>
        total + (submittedAnswers[index] === question.correctAnswer ? 1 : 0),
      0
    );

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= assessment.passingScore;

    const attempt = await prisma.assessmentAttempt.create({
      data: {
        userId: req.user!.userId,
        assessmentId: assessment.id,
        score,
        totalQuestions: questions.length,
        answersJson: JSON.stringify(submittedAnswers),
        passed,
      },
    });

    return res.json({
      success: true,
      result: {
        attemptId: attempt.id,
        score,
        correctCount,
        totalQuestions: questions.length,
        passingScore: assessment.passingScore,
        passed,
        feedback: questions.map((question, index) => ({
          question: question.question,
          selectedAnswer: submittedAnswers[index],
          correctAnswer: question.correctAnswer,
          explanation: question.explanation ?? '',
          isCorrect: submittedAnswers[index] === question.correctAnswer,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;