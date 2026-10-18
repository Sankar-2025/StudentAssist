
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';

const prisma = new PrismaClient();
const data = JSON.parse(
  readFileSync('full-sqlite-export.json', 'utf8')
);

async function main() {
  const localUsers = data.User ?? [];
  const localProfiles = data.UserProfile ?? [];
  const localSkills = data.UserSkill ?? [];

  // Match the local account to the live account by email.
  const localUser = localUsers.find(
    (user: any) =>
      user.id === 'ff196dd3-cc2c-4542-8b66-b21573340cac'
  );

  if (!localUser?.email) {
    throw new Error('Matching local user/email not found.');
  }

  const liveUser = await prisma.user.findUnique({
    where: { email: localUser.email },
  });

  if (!liveUser) {
    throw new Error('No matching live user found by email.');
  }

  const localProfile = localProfiles.find(
    (profile: any) => profile.userId === localUser.id
  );

  if (!localProfile) {
    throw new Error('Local profile for the matched user not found.');
  }

  const liveProfile = await prisma.userProfile.findUnique({
    where: { userId: liveUser.id },
  });

  if (!liveProfile) {
    throw new Error('Live profile not found. Stopping safely.');
  }

  const liveSkills = await prisma.skill.findMany();
  const skillsById = new Map(
    liveSkills.map(skill => [skill.id, skill])
  );

  const localSkillLinks = localSkills.filter(
    (link: any) => link.profileId === localProfile.id
  );

  let inserted = 0;
  let skipped = 0;

  for (const link of localSkillLinks) {
    const skill = skillsById.get(link.skillId);

    if (!skill) {
      console.log(`Skipping missing skill ID: ${link.skillId}`);
      skipped++;
      continue;
    }

    const existing = await prisma.userSkill.findFirst({
      where: {
        profileId: liveProfile.id,
        skillId: skill.id,
      },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.userSkill.create({
      data: {
        id: link.id,
        profileId: liveProfile.id,
        skillId: skill.id,
        proficiency: link.proficiency,
        verified: link.verified === true || link.verified === 1,
        createdAt: new Date(link.createdAt),
      },
    });

    inserted++;
  }

  console.log(`Skills inserted: ${inserted}`);
  console.log(`Skills skipped: ${skipped}`);
  console.log(
    'Total skill links for live profile:',
    await prisma.userSkill.count({
      where: { profileId: liveProfile.id },
    })
  );
}

main()
  .catch(error => {
    console.error('Import stopped:', error.message ?? error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
