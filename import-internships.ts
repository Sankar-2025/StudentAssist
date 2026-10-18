
import { PrismaClient } from '@prisma/client';
  import { readFileSync } from 'node:fs';

const prisma = new PrismaClient();

type Row = Record<string, any>;

const data = JSON.parse(
  readFileSync('full-sqlite-export.json', 'utf8')
);

function toDate(value: any): Date | null {
  if (value === null || value === undefined) return null;

  // SQLite exports may contain milliseconds since the Unix epoch.
  const date =
    typeof value === 'number' ? new Date(value) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${value}`);
  }

  return date;
}

function toBoolean(value: any): boolean {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  throw new Error(`Unexpected Boolean value: ${value}`);
}

async function main() {
  // Confirm the company IDs already exist in PostgreSQL.
  const companies = await prisma.company.findMany({
    select: { id: true },
  });
  const companyIds = new Set(companies.map(c => c.id));

  const internships: Row[] = data.Internship ?? [];

  for (const row of internships) {
    if (!companyIds.has(row.companyId)) {
      throw new Error(
        `Company ${row.companyId} is missing. Stop before importing.`
      );
    }
  }

  console.log(`Found ${internships.length} local internships.`);

  const internshipRows = internships.map(row => ({
    ...row,
    isPaid: toBoolean(row.isPaid),
    isDemoData: toBoolean(row.isDemoData),
    lastCheckedDate: toDate(row.lastCheckedDate)!,
    postedAt: toDate(row.postedAt)!,
    createdAt: toDate(row.createdAt)!,
    updatedAt: toDate(row.updatedAt)!,
  }));

  const internshipResult = await prisma.internship.createMany({
    data: internshipRows,
    skipDuplicates: true,
  });

  console.log(
    `Internships inserted: ${internshipResult.count}`
  );

  // Map local user IDs to live users by email.
  const localUsers: Row[] = data.User ?? [];
  const liveUsers = await prisma.user.findMany({
    select: { id: true, email: true },
  });

  const liveByEmail = new Map(
    liveUsers.map(user => [user.email.toLowerCase(), user])
  );

  const liveInternshipIds = new Set(
    (await prisma.internship.findMany({
      select: { id: true },
    })).map(row => row.id)
  );

  const savedRows: Row[] = data.SavedInternship ?? [];
  const safeSavedRows: Row[] = [];

  for (const saved of savedRows) {
    const localUser = localUsers.find(
      user => user.id === saved.userId
    );

    if (!localUser) {
      console.log(`Skipping saved link ${saved.id}: local user missing.`);
      continue;
    }

    const liveUser = liveByEmail.get(
      String(localUser.email).toLowerCase()
    );

    if (!liveUser) {
      console.log(`Skipping saved link ${saved.id}: no matching live user.`);
      continue;
    }

    if (!liveInternshipIds.has(saved.internshipId)) {
      console.log(`Skipping saved link ${saved.id}: internship missing.`);
      continue;
    }

    safeSavedRows.push({
      ...saved,
      userId: liveUser.id,
      createdAt: toDate(saved.createdAt)!,
    });
  }

  const savedResult = await prisma.savedInternship.createMany({
    data: safeSavedRows,
    skipDuplicates: true,
  });

  console.log(`Saved-internship links inserted: ${savedResult.count}`);
  console.log('Internship migration finished.');
}

main()
  .catch(error => {
    console.error('Migration stopped:', error.message ?? error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
