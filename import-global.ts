
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';

const prisma = new PrismaClient();

// Set to true to preview without writing.
// Change to false only when ready to import.
const DRY_RUN = false;

type Row = Record<string, any>;

const data = JSON.parse(
  readFileSync('full-sqlite-export.json', 'utf8')
);

function convertRows(
  rows: Row[],
  dateFields: string[],
  booleanFields: string[] = []
): Row[] {
  return rows.map((row) => {
    const copy = { ...row };

    for (const field of dateFields) {
      if (copy[field] !== null && copy[field] !== undefined) {
        const date = new Date(copy[field]);

        if (Number.isNaN(date.getTime())) {
          throw new Error(`Invalid date in field ${field}`);
        }

        copy[field] = date;
      }
    }

    for (const field of booleanFields) {
      if (copy[field] === 1 || copy[field] === 1n) {
        copy[field] = true;
      } else if (copy[field] === 0 || copy[field] === 0n) {
        copy[field] = false;
      } else if (
        copy[field] !== true &&
        copy[field] !== false &&
        copy[field] !== null &&
        copy[field] !== undefined
      ) {
        throw new Error(
          `Invalid Boolean value in ${field}: ${copy[field]}`
        );
      }
    }

    return copy;
  });
}

async function main() {
  const plans = [
    {
      model: 'Company',
      rows: data.Company ?? [],
      run: () =>
        prisma.company.createMany({
          data: convertRows(data.Company ?? [], ['createdAt']),
          skipDuplicates: true,
        }),
    },
    {
      model: 'Skill',
      rows: data.Skill ?? [],
      run: () =>
        prisma.skill.createMany({
          data: convertRows(data.Skill ?? [], ['createdAt']),
          skipDuplicates: true,
        }),
    },
    {
      model: 'InternshipSource',
      rows: data.InternshipSource ?? [],
      run: () =>
        prisma.internshipSource.createMany({
          data: convertRows(
            data.InternshipSource ?? [],
            ['lastSuccessfulSyncAt', 'createdAt', 'updatedAt'],
            ['active']
          ),
          skipDuplicates: true,
        }),
    },
    {
      model: 'InterviewQuestion',
      rows: data.InterviewQuestion ?? [],
      run: () =>
        prisma.interviewQuestion.createMany({
          data: convertRows(
            data.InterviewQuestion ?? [],
            ['createdAt'],
            ['isFromCandidateReport']
          ),
          skipDuplicates: true,
        }),
    },
  ];

  console.log(
    `Mode: ${DRY_RUN ? 'DRY RUN — NO WRITES' : 'IMPORT'}`
  );

  for (const plan of plans) {
    const delegateName =
      plan.model.charAt(0).toLowerCase() + plan.model.slice(1);

    const delegate = (prisma as any)[delegateName];
    const existing = await delegate.count();

    console.log(
      `\n${plan.model}: ${plan.rows.length} local rows; ` +
      `${existing} currently live`
    );

    if (DRY_RUN) {
      console.log('  Preview only; no writes performed.');
      continue;
    }

    const result = await plan.run();

    console.log(`  Inserted ${result.count} rows.`);
    console.log(
      `  Existing rows before import: ${existing}`
    );
  }

  console.log('\nStage 1 completed.');
}

main()
  .catch((error) => {
    console.error('Import failed:', error.message ?? error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
