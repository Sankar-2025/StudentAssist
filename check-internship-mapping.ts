
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';

const prisma = new PrismaClient();

type Row = Record<string, any>;

const data = JSON.parse(
  readFileSync('full-sqlite-export.json', 'utf8')
);

async function main() {
  console.log('\n--- LOCAL COMPANIES ---');

  for (const company of (data.Company ?? []) as Row[]) {
    console.log({
      id: company.id,
      name: company.name,
    });
  }

  console.log('\n--- LIVE COMPANIES ---');

  console.log(
    await prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
  );

  console.log('\n--- LOCAL INTERNSHIPS ---');

  for (const internship of (data.Internship ?? []) as Row[]) {
    const company = (data.Company ?? []).find(
      (item: Row) => item.id === internship.companyId
    );

    console.log({
      id: internship.id,
      title: internship.title,
      localCompanyId: internship.companyId,
      localCompanyName: company?.name ?? 'UNKNOWN',
      sourceUrl: internship.sourceUrl,
      verificationStatus: internship.verificationStatus,
      isDemoData: internship.isDemoData,
    });
  }

  console.log('\n--- LIVE INTERNSHIPS ---');

  console.log(
    await prisma.internship.findMany({
      select: {
        id: true,
        title: true,
        companyId: true,
        sourceUrl: true,
      },
    })
  );

  console.log('\n--- LOCAL SAVED INTERNSHIPS ---');
  console.log(data.SavedInternship ?? []);

  console.log('\n--- LIVE SAVED INTERNSHIPS ---');
  console.log(
    await prisma.savedInternship.findMany({
      select: {
        id: true,
        userId: true,
        internshipId: true,
      },
    })
  );
}

main()
  .catch((error) => {
    console.error('Inspection failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
