
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(
    readFileSync('full-sqlite-export.json', 'utf8')
  );

  const localUsers = data.User as Array<{
    id: string;
    email: string;
  }>;

  const liveUsers = await prisma.user.findMany({
    select: { id: true, email: true },
  });

  console.log('LOCAL USERS:', localUsers.length);
  console.log('LIVE USERS:', liveUsers.length);

  for (const local of localUsers) {
    const match = liveUsers.find(
      (live) =>
        live.email.trim().toLowerCase() ===
        local.email.trim().toLowerCase()
    );

    console.log(
      match
        ? `Local user ${local.id}: MATCH FOUND`
        : `Local user ${local.id}: NO EMAIL MATCH`
    );
  }
}

main()
  .catch((error) => {
    console.error('Check failed:', error.message ?? error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
