
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';

const prisma = new PrismaClient();
const data = JSON.parse(
  readFileSync('full-sqlite-export.json', 'utf8')
);

async function main() {
  console.log('\n--- LIVE USER PROFILES ---');
  console.log(await prisma.userProfile.findMany({
    select: {
      id: true,
      userId: true,
      displayName: true,
    },
  }));

  console.log('\n--- LIVE SKILLS ---');
  console.log(await prisma.skill.findMany({
    select: { id: true, name: true },
  }));

  console.log('\n--- LOCAL USER SKILLS ---');
  console.log((data.UserSkill ?? []).map((row: any) => ({
    id: row.id,
    profileId: row.profileId,
    skillId: row.skillId,
    proficiency: row.proficiency,
    verified: row.verified,
  })));

  console.log('\n--- LOCAL USER PROFILES ---');
  console.log((data.UserProfile ?? []).map((row: any) => ({
    id: row.id,
    userId: row.userId,
    displayName: row.displayName,
  })));
}

main()
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
