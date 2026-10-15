import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth } from '../middlewares/auth';
import { isPushConfigured } from '../services/push.service';

const router = Router();

const UpdatePrefSchema = z.object({
  emailAlerts: z.boolean().optional(),
  pushAlerts: z.boolean().optional(),
  matchAlerts: z.boolean().optional(),
  deadlineAlerts: z.boolean().optional(),
  quietHoursStart: z.string().optional(),
  quietHoursEnd: z.string().optional(),
});

const PushSubSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

// GET /api/notifications
router.get('/', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user!.userId, isRead: false },
    });

    return res.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;

    await prisma.notification.updateMany({
      where: { id, userId: req.user!.userId },
      data: { isRead: true },
    });

    return res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', requireAuth, async (req: Request, res: Response, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, isRead: false },
      data: { isRead: true },
    });

    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
});

// GET /api/notifications/preferences
router.get('/preferences', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const pref = await prisma.notificationPreference.upsert({
      where: { userId: req.user!.userId },
      update: {},
      create: {
        userId: req.user!.userId,
        emailAlerts: true,
        pushAlerts: true,
        matchAlerts: true,
        deadlineAlerts: true,
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00',
      },
    });

    return res.json({
      success: true,
      preferences: pref,
      isPushAvailable: isPushConfigured(),
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/notifications/preferences
router.put('/preferences', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const data = UpdatePrefSchema.parse(req.body);

    const pref = await prisma.notificationPreference.upsert({
      where: { userId: req.user!.userId },
      update: data,
      create: {
        userId: req.user!.userId,
        ...data,
      },
    });

    return res.json({ success: true, preferences: pref });
  } catch (err) {
    next(err);
  }
});

// POST /api/notifications/push-subscribe
router.post('/push-subscribe', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { endpoint, keys } = PushSubSchema.parse(req.body);

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        userId: req.user!.userId,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
      create: {
        userId: req.user!.userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    });

    return res.json({ success: true, message: 'Push subscription stored successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /api/notifications/push-status
router.get('/push-status', (req: Request, res: Response) => {
  return res.json({
    success: true,
    configured: isPushConfigured(),
    notes: isPushConfigured()
      ? 'VAPID credentials active'
      : 'VAPID keys not configured in environment. Local in-app notifications active.',
  });
});

export default router;
