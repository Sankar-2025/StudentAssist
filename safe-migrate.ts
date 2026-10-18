
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';

const prisma = new PrismaClient();

// Keep this true for the first run.
// It prevents all database writes.
const DRY_RUN = true;

const data = JSON.parse(
  readFileSync('full-sqlite-export.json', 'utf8')
);

type Row = Record<string, any>;

async function main() {
  const liveUsers = await prisma.user.findMany({
    select: { id: true, email: true },
  });

  const localUsers: Row[] = data.User ?? [];
  const userMap = new Map<string, string>();

  for (const local of localUsers) {
    const live = liveUsers.find(
      (u) =>
        u.email.trim().toLowerCase() ===
        String(local.email).trim().toLowerCase()
    );

    if (live) {
      userMap.set(local.id, live.id);
      console.log(`Matched a local account to the live account.`);
    } else {
      console.log(
        `Unmatched local account will be skipped: ${local.id}`
      );
    }
  }

  const dateFields: Record<string, string[]> = {
    Company: ['createdAt'],
    Skill: ['createdAt'],
    InternshipSource: [
      'lastSuccessfulSyncAt', 'createdAt', 'updatedAt',
    ],
    Internship: [
      'lastCheckedDate', 'postedAt', 'createdAt', 'updatedAt',
    ],
    InternshipImportCandidate: [
      'publishedAt', 'firstSeenAt', 'lastSeenAt',
      'reviewedAt', 'createdAt', 'updatedAt',
    ],
    InternshipSyncRun: ['startedAt', 'finishedAt'],
    InterviewQuestion: ['createdAt'],
    ChatConversation: ['createdAt', 'updatedAt'],
    ChatMessage: ['createdAt'],
    UserProfile: ['createdAt', 'updatedAt'],
    UserSkill: ['createdAt'],
    SavedInternship: ['createdAt'],
    UserRoadmapProgress: ['completedAt'],
    AuditEvent: ['createdAt'],
    NotificationPreference: [],
    InternshipSkill: [],
    SkillAssessment: ['createdAt', 'updatedAt'],
    AssessmentAttempt: ['startedAt', 'submittedAt'],
    InterviewPracticeSession: ['completedAt'],
    Resume: ['createdAt', 'updatedAt'],
    Application: [
      'dateApplied', 'deadline', 'reminderDate',
      'interviewDate', 'createdAt', 'updatedAt',
    ],
    ApplicationStatusHistory: ['timestamp'],
    Notification: ['createdAt'],
    PushSubscription: ['createdAt'],
    MatchAssessment: ['createdAt'],
  };

  function prepare(model: string, row: Row): Row {
    const result = { ...row };

    for (const field of dateFields[model] ?? []) {
      if (result[field] !== null && result[field] !== undefined) {
        result[field] = new Date(result[field]);
      }
    }

    return result;
  }

  async function insert(
    model: string,
    rows: Row[],
    transform: (row: Row) => Row | null = (row) => row
  ) {
    const delegate = (prisma as any)[
      model.charAt(0).toLowerCase() + model.slice(1)
    ];

    const mapped = rows
      .map(transform)
      .filter((row): row is Row => row !== null)
      .map((row) => prepare(model, row));

    if (!mapped.length) {
      console.log(`${model}: 0 eligible rows`);
      return;
    }

    if (DRY_RUN) {
      console.log(
        `${model}: ${mapped.length} eligible rows; no writes performed`
      );
      return;
    }

    const result = await delegate.createMany({
      data: mapped,
      skipDuplicates: true,
    });

    console.log(`${model}: inserted ${result.count} rows`);
  }

  // Read existing rows so local IDs can be mapped to live IDs
  // when a unique name or URL already exists.
  const companies = data.Company ?? [];
  const skills = data.Skill ?? [];
  const sources = data.InternshipSource ?? [];

  console.log('\n--- Global records ---');
  await insert('Company', companies);
  await insert('Skill', skills);
  await insert('InternshipSource', sources);
  await insert('InterviewQuestion', data.InterviewQuestion ?? []);

  console.log('\n--- Existing records that must be preserved ---');
  console.log(
    `Live roadmaps: ${await prisma.learningRoadmap.count()}`
  );
  console.log(
    `Live roadmap steps: ${await prisma.roadmapStep.count()}`
  );
  console.log(
    `Live users: ${liveUsers.length}`
  );

  console.log('\n--- Dry-run summary ---');
  console.log('No records have been written or changed.');
  console.log(
    'This preliminary check does not yet import dependent records.'
  );
}

main()
  .catch((error) => {
    console.error('Migration check failed:', error.message ?? error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
