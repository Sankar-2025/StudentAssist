import webpush from 'web-push';
import { config } from '../config';
import { prisma } from '../prisma';

let pushConfigured = false;
if (config.vapidPublicKey && config.vapidPrivateKey) {
  try {
    webpush.setVapidDetails(
      config.vapidSubject,
      config.vapidPublicKey,
      config.vapidPrivateKey
    );
    pushConfigured = true;
    console.log('🔔 Web Push configured with active VAPID keys');
  } catch (err) {
    console.warn('⚠️ Web Push initialization failed with provided keys:', err);
  }
}

export function isPushConfigured(): boolean {
  return pushConfigured;
}

export async function sendPushNotificationToUser(
  userId: string,
  payload: { title: string; body: string; url?: string; category?: string }
): Promise<{ sent: number; failed: number; configured: boolean }> {
  if (!pushConfigured) {
    return { sent: 0, failed: 0, configured: false };
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  let sent = 0;
  let failed = 0;

  for (const sub of subscriptions) {
    try {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      await webpush.sendNotification(
        pushSubscription,
        JSON.stringify(payload)
      );
      sent++;
    } catch (err: any) {
      failed++;
      // If subscription expired or gone (410 / 404), purge it from database
      if (err.statusCode === 410 || err.statusCode === 404) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
      }
    }
  }

  return { sent, failed, configured: true };
}
