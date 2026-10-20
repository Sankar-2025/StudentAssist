import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  let dbStatus = 'healthy';
  let dbLatencyMs = 0;

  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - start;
  } catch (err) {
    dbStatus = 'degraded';
  }

  const memoryUsage = process.memoryUsage();

  return res.json({
    status: dbStatus === 'healthy' ? 'pass' : 'warn',
    timestamp: new Date().toISOString(),
    service: 'studentassist-api',
    uptimeSeconds: Math.round(process.uptime()),
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryRssMb: Math.round(memoryUsage.rss / 1024 / 1024),
    },
  });
});

export default router;
