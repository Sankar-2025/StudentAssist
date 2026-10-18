
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n--- LIVE COMPANIES ---');
  console.log(await prisma.company.findMany({
    select: { id: true, name: true },
  }));

  console.log('\n--- LIVE SKILLS ---');
  console.log(await prisma.skill.findMany({
    select: { id: true, name: true },
  }));

  console.log('\n--- LIVE INTERNSHIP SOURCES ---');
  console.log(await prisma.internshipSource.findMany({
    select: { id: true, sourceName: true, sourceUrl: true },
  }));

  console.log('\n--- LIVE INTERNSHIPS ---');
  console.log(await prisma.internship.findMany({
    select: { id: true, title: true, companyId: true, sourceUrl: true },
  }));
}

main()
  .catch((error) => {
    console.error('Read-only inspection failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
