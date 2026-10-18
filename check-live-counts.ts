
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const counts = {
    Company: await prisma.company.count(),
    Skill: await prisma.skill.count(),
    InternshipSource: await prisma.internshipSource.count(),
    InterviewQuestion: await prisma.interviewQuestion.count(),
    User: await prisma.user.count(),
    LearningRoadmap: await prisma.learningRoadmap.count(),
    RoadmapStep: await prisma.roadmapStep.count(),
  };

  console.log('\n--- LIVE DATABASE COUNTS ---');
  for (const [table, count] of Object.entries(counts)) {
    console.log(`${table}: ${count}`);
  }
}

main()
  .catch((error) => {
    console.error('Verification failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
