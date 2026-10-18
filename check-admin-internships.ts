
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    select: {
      email: true,
      role: true,
    },
  });

  console.log('Live account:', user);

  const internships = await prisma.internship.findMany({
    select: {
      title: true,
      verificationStatus: true,
      officialApplyUrl: true,
      isDemoData: true,
    },
  });

  console.log('\nLive internships:', internships.length);
  console.log(internships);
}

main()
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
