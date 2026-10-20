
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const prisma = new PrismaClient();

async function main() {
  const filePath = resolve(process.cwd(), 'roadmaps-export.json');
  const data = JSON.parse(readFileSync(filePath, 'utf8'));

  if (!data.roadmaps || !data.steps || data.roadmaps.length === 0) {
    throw new Error('Unexpected export counts. Import cancelled.');
  }

  await prisma.$transaction(async (tx) => {
    const roadmapCount = await tx.learningRoadmap.count();
    const stepCount = await tx.roadmapStep.count();

    // Stop rather than risk duplicating or replacing existing data.
    if (roadmapCount !== 0 || stepCount !== 0) {
      throw new Error(
        `Import cancelled: PostgreSQL already contains ${roadmapCount} roadmaps and ${stepCount} steps.`
      );
    }

    await tx.learningRoadmap.createMany({
      data: data.roadmaps.map((r: any) => ({
        id: r.id,
        targetRole: r.targetRole,
        title: r.title,
        description: r.description,
        category: r.category,
        createdAt: new Date(r.createdAt),
      })),
    });

    await tx.roadmapStep.createMany({
      data: data.steps.map((s: any) => ({
        id: s.id,
        roadmapId: s.roadmapId,
        stepNumber: s.stepNumber,
        title: s.title,
        description: s.description,
        prerequisites: s.prerequisites,
        skillsCovered: s.skillsCovered,
        estimatedHours: s.estimatedHours,
        resourcesJson: s.resourcesJson,
        practiceTasksJson: s.practiceTasksJson,
      })),
    });
  });

  console.log('Import successful!');
  console.log('Roadmaps imported: 2');
  console.log('Roadmap steps imported: 6');
}

main()
  .catch((error) => {
    console.error('Import failed:', error.message ?? error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
