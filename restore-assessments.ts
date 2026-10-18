
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

const prisma = new PrismaClient();

async function main() {
  const databaseUrl = process.env.DATABASE_URL ?? "";

  if (!/^postgres(ql)?:\/\//.test(databaseUrl)) {
    throw new Error(
      "DATABASE_URL is not a PostgreSQL URL. Set the Render database URL first."
    );
  }

  const exportData = JSON.parse(
    readFileSync("./full-sqlite-export.json", "utf8")
  );

  const assessments = exportData.SkillAssessment ?? [];
  let inserted = 0;
  let skipped = 0;

  for (const assessment of assessments) {
    // Verify that the referenced roadmap step exists in the LIVE database.
    const step = await prisma.roadmapStep.findUnique({
      where: { id: assessment.stepId },
    });

    if (!step) {
      throw new Error(
        `Missing live roadmap step for: ${assessment.title}. Nothing else will be imported after this point.`
      );
    }

    // Preserve an assessment already present in the live database.
    const existing = await prisma.skillAssessment.findUnique({
      where: { id: assessment.id },
    });

    if (existing) {
      console.log(`SKIPPED (already exists): ${assessment.title}`);
      skipped++;
      continue;
    }

    const questions = JSON.parse(assessment.questionsJson);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error(`No questions found for: ${assessment.title}`);
    }

    await prisma.skillAssessment.create({
      data: {
        id: assessment.id,
        stepId: assessment.stepId,
        createdById: assessment.createdById ?? null,
        title: assessment.title,
        description: assessment.description ?? "",
        skillName: assessment.skillName,
        difficulty: assessment.difficulty ?? "BEGINNER",
        durationMinutes: Number(assessment.durationMinutes ?? 15),
        passingScore: Number(assessment.passingScore ?? 70),
        questionsJson: assessment.questionsJson,
        isActive:
          assessment.isActive === true || assessment.isActive === 1,
        createdAt: new Date(assessment.createdAt),
        updatedAt: new Date(assessment.updatedAt),
      },
    });

    console.log(`RESTORED: ${assessment.title}`);
    inserted++;
  }

  console.log({ inserted, skipped });
  console.log(
    "Live SkillAssessment count:",
    await prisma.skillAssessment.count()
  );
}

main()
  .catch((error) => {
    console.error("Restoration stopped:", error.message ?? error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
