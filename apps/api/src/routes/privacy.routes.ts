import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth } from '../middlewares/auth';
import { logAuditEvent } from '../services/audit.service';

const router = Router();

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

const DeleteAccountSchema = z.object({
  password: z.string().min(1, 'Password confirmation is required to delete your account'),
});

// POST /api/privacy/change-password
router.post('/change-password', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { currentPassword, newPassword } = ChangePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    await logAuditEvent({
      userId: user.id,
      eventType: 'PASSWORD_CHANGED',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /api/privacy/export-data — GDPR Personal Data Export
router.get('/export-data', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.userId;

    const [user, profile, resumes, applications, practiceSessions, notifications, auditEvents] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
        }),
        prisma.userProfile.findUnique({
          where: { userId },
          include: { userSkills: { include: { skill: true } } },
        }),
        prisma.resume.findMany({ where: { userId } }),
        prisma.application.findMany({
          where: { userId },
          include: { statusHistory: true },
        }),
        prisma.interviewPracticeSession.findMany({
          where: { userId },
          include: { question: true },
        }),
        prisma.notification.findMany({ where: { userId } }),
        prisma.auditEvent.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      ]);

    await logAuditEvent({
      userId,
      eventType: 'DATA_EXPORT_REQUESTED',
      ipAddress: req.ip,
    });

    return res.json({
      success: true,
      exportDate: new Date().toISOString(),
      user,
      profile,
      resumes,
      applications,
      interviewPractice: practiceSessions,
      notifications,
      securityAuditTrail: auditEvents,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/privacy/delete-account
router.delete('/delete-account', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { password } = DeleteAccountSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Incorrect password confirmation.' });
    }

    // Log before deleting
    await logAuditEvent({
      userId: user.id,
      eventType: 'ACCOUNT_DELETED',
      ipAddress: req.ip,
    });

    // Cascade deletes handle profile, resumes, applications, sessions
    await prisma.user.delete({
      where: { id: user.id },
    });

    res.clearCookie('token');
    return res.json({ success: true, message: 'Your account and all associated data have been permanently deleted.' });
  } catch (err) {
    next(err);
  }
});

// GET /api/privacy/audit-logs
router.get('/audit-logs', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const logs = await prisma.auditEvent.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return res.json({ success: true, logs });
  } catch (err) {
    next(err);
  }
});

export default router;
