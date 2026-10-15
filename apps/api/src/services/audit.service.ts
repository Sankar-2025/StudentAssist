import { prisma } from '../prisma';

export async function logAuditEvent(params: {
  userId?: string;
  eventType: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
}) {
  try {
    await prisma.auditEvent.create({
      data: {
        userId: params.userId || null,
        eventType: params.eventType,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
        details: typeof params.details === 'object' ? JSON.stringify(params.details) : params.details || null,
      },
    });
  } catch (err) {
    console.error('[Audit Logger Warning] Failed to log audit event:', err);
  }
}
