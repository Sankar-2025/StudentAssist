import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth } from '../middlewares/auth';
import { AIService } from '../services/ai.service';

const router = Router();

const ChatPromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty'),
  conversationId: z.string().optional(),
  internshipId: z.string().optional(),
});

// POST /api/mentor/chat
router.post('/chat', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { prompt, conversationId, internshipId } = ChatPromptSchema.parse(req.body);

    // Get student profile for context
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.user!.userId },
      include: {
        userSkills: {
          include: { skill: true },
        },
      },
    });

    // Get internship title if provided
    let currentInternshipTitle: string | undefined;
    if (internshipId) {
      const internship = await prisma.internship.findUnique({ where: { id: internshipId } });
      if (internship) currentInternshipTitle = `${internship.title} at ${internship.companyId}`;
    }

    // Get or create conversation
    let conv = conversationId
      ? await prisma.chatConversation.findFirst({
          where: { id: conversationId, userId: req.user!.userId },
          include: { messages: { orderBy: { createdAt: 'asc' }, take: 10 } },
        })
      : null;

    if (!conv) {
      conv = await prisma.chatConversation.create({
        data: {
          userId: req.user!.userId,
          title: prompt.slice(0, 35) + (prompt.length > 35 ? '...' : ''),
        },
        include: { messages: true },
      });
    }

    // Save student message
    await prisma.chatMessage.create({
      data: {
        conversationId: conv.id,
        role: 'user',
        content: prompt,
      },
    });

    const aiResult = await AIService.askCareerMentor({
      studentProfile: profile,
      currentInternshipTitle,
      prompt,
    });

    // Save mentor message
    await prisma.chatMessage.create({
      data: {
        conversationId: conv.id,
        role: 'assistant',
        content: aiResult.content,
      },
    });

    // Update conversation updatedAt
    await prisma.chatConversation.update({
      where: { id: conv.id },
      data: { updatedAt: new Date() },
    });

    return res.json({
      success: true,
      conversationId: conv.id,
      response: aiResult.content,
      provider: aiResult.provider,
      isFallback: aiResult.isFallback,
      setupInstructions: aiResult.setupInstructions,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/mentor/conversations
router.get('/conversations', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const convs = await prisma.chatConversation.findMany({
      where: { userId: req.user!.userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return res.json({ success: true, conversations: convs });
  } catch (err) {
    next(err);
  }
});

// GET /api/mentor/conversations/:id
router.get('/conversations/:id', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;

    const conv = await prisma.chatConversation.findFirst({
      where: { id, userId: req.user!.userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conv) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    return res.json({ success: true, conversation: conv });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/mentor/conversations/:id
router.delete('/conversations/:id', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;

    await prisma.chatConversation.deleteMany({
      where: { id, userId: req.user!.userId },
    });

    return res.json({ success: true, message: 'Conversation cleared' });
  } catch (err) {
    next(err);
  }
});

export default router;
