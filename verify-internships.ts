
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(
    'Live internships:',
    await prisma.internship.count()
  );

  console.log(
    'Live saved internships:',
    await prisma.savedInternship.count()
  );

  console.log(
    'Live user profiles:',
    await prisma.userProfile.count()
  );

  console.log(
    'Live user skills:',
    await prisma.userSkill.count()
  );
}

main()
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
