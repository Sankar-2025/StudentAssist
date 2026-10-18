
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = current_schema()
    ORDER BY tablename
  `;

  console.log('LIVE POSTGRESQL TABLE COUNTS');

  for (const { tablename } of tables) {
    const safeName = tablename.replace(/"/g, '""');

    const result = await prisma.$queryRawUnsafe<
      Array<{ count: bigint }>
    >(`SELECT COUNT(*)::bigint AS count FROM "${safeName}"`);

    console.log(`${tablename}: ${result[0].count}`);
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
