
import dotenv from 'dotenv';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

// Load DATABASE_URL from the project's root .env file.
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

// Use the same Prisma schema as the API project.
const prisma = new PrismaClient();

async function main() {
  const fullStackSteps = [
    {
      stepNumber: 1,
      title: 'Modern TypeScript & Frontend Fundamentals',
      description:
        'Master strict TypeScript types, asynchronous programming, React, and clean component architecture.',
      prerequisites: JSON.stringify(['Basic JavaScript']),
      skillsCovered: JSON.stringify(['TypeScript', 'React']),
      estimatedHours: 15,
      resourcesJson: JSON.stringify([
        {
          title: 'TypeScript Handbook',
          url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
          provider: 'TypeScript Official Docs',
          type: 'DOCUMENTATION',
          isFree: true,
        },
        {
          title: 'React Learn',
          url: 'https://react.dev/learn',
          provider: 'React Team',
          type: 'DOCUMENTATION',
          isFree: true,
        },
      ]),
      practiceTasksJson: JSON.stringify([
        'Build a typed task dashboard using React and TypeScript.',
        'Refactor untyped props into strictly typed interfaces.',
      ]),
    },
    {
      stepNumber: 2,
      title: 'Backend API Engineering & REST Standards',
      description:
        'Build Express and Node.js services with authentication, validation, and error handling.',
      prerequisites: JSON.stringify(['TypeScript Fundamentals']),
      skillsCovered: JSON.stringify(['Node.js', 'Express.js', 'TypeScript']),
      estimatedHours: 20,
      resourcesJson: JSON.stringify([
        {
          title: 'Node.js Learn',
          url: 'https://nodejs.org/en/learn',
          provider: 'OpenJS Foundation',
          type: 'DOCUMENTATION',
          isFree: true,
        },
        {
          title: 'Express Security Best Practices',
          url: 'https://expressjs.com/en/advanced/best-practice-security.html',
          provider: 'Express Docs',
          type: 'DOCUMENTATION',
          isFree: true,
        },
      ]),
      practiceTasksJson: JSON.stringify([
        'Build an authentication API with password hashing.',
        'Validate API request bodies using Zod.',
      ]),
    },
    {
      stepNumber: 3,
      title: 'Relational Database Modeling & ORM Integration',
      description:
        'Design relational schemas, configure database relationships, and use Prisma ORM.',
      prerequisites: JSON.stringify(['Backend API Engineering']),
      skillsCovered: JSON.stringify(['SQL', 'Prisma']),
      estimatedHours: 18,
      resourcesJson: JSON.stringify([
        {
          title: 'Prisma Getting Started',
          url: 'https://www.prisma.io/docs/getting-started',
          provider: 'Prisma Documentation',
          type: 'DOCUMENTATION',
          isFree: true,
        },
        {
          title: 'PostgreSQL Tutorial',
          url: 'https://www.postgresqltutorial.com/',
          provider: 'PostgreSQL Guides',
          type: 'TUTORIAL',
          isFree: true,
        },
      ]),
      practiceTasksJson: JSON.stringify([
        'Create a relational schema with one-to-many relationships.',
        'Practice database queries and indexing.',
      ]),
    },
    {
      stepNumber: 4,
      title: 'Containerization & Cloud Deployment',
      description:
        'Learn Docker, containerization, Git, and safe deployment configuration.',
      prerequisites: JSON.stringify(['Relational Database Modeling']),
      skillsCovered: JSON.stringify(['Docker', 'Git']),
      estimatedHours: 12,
      resourcesJson: JSON.stringify([
        {
          title: 'Docker Get Started',
          url: 'https://docs.docker.com/get-started/',
          provider: 'Docker Docs',
          type: 'DOCUMENTATION',
          isFree: true,
        },
      ]),
      practiceTasksJson: JSON.stringify([
        'Write a Dockerfile for a React application.',
        'Create a Docker Compose setup for an API and database.',
      ]),
    },
  ];

  const aiMlSteps = [
    {
      stepNumber: 1,
      title: 'Scientific Python & Data Manipulation',
      description:
        'Learn NumPy, Pandas, data transformation, and exploratory data analysis.',
      prerequisites: JSON.stringify(['Basic Python']),
      skillsCovered: JSON.stringify(['Python', 'NumPy', 'Pandas']),
      estimatedHours: 16,
      resourcesJson: JSON.stringify([
        {
          title: 'NumPy Beginners Guide',
          url: 'https://numpy.org/doc/stable/user/absolute_beginners.html',
          provider: 'NumPy',
          type: 'DOCUMENTATION',
          isFree: true,
        },
        {
          title: 'Pandas 10-Minute Tutorial',
          url: 'https://pandas.pydata.org/docs/user_guide/10min.html',
          provider: 'Pandas Docs',
          type: 'DOCUMENTATION',
          isFree: true,
        },
      ]),
      practiceTasksJson: JSON.stringify([
        'Clean and analyze a dataset containing missing values.',
      ]),
    },
    {
      stepNumber: 2,
      title: 'Deep Learning with PyTorch',
      description:
        'Learn tensors, automatic differentiation, neural networks, and model training.',
      prerequisites: JSON.stringify(['Scientific Python']),
      skillsCovered: JSON.stringify(['PyTorch', 'Python']),
      estimatedHours: 24,
      resourcesJson: JSON.stringify([
        {
          title: 'PyTorch 60 Minute Blitz',
          url: 'https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html',
          provider: 'PyTorch Docs',
          type: 'TUTORIAL',
          isFree: true,
        },
      ]),
      practiceTasksJson: JSON.stringify([
        'Train and evaluate a neural network on a sample dataset.',
      ]),
    },
  ];

  // Create the Full Stack roadmap if it does not already exist.
  const fullStack = await prisma.learningRoadmap.upsert({
    where: {
      targetRole: 'Full Stack Engineer',
    },
    update: {},
    create: {
      targetRole: 'Full Stack Engineer',
      title: 'Full Stack Web Engineering Preparation Roadmap',
      description:
        'A project-focused guide to frontend, backend, databases, and deployment.',
      category: 'Software Engineering',
      steps: {
        create: fullStackSteps,
      },
    },
  });

  // Create the AI/ML roadmap if it does not already exist.
  const aiMl = await prisma.learningRoadmap.upsert({
    where: {
      targetRole: 'AI/ML Engineer',
    },
    update: {},
    create: {
      targetRole: 'AI/ML Engineer',
      title: 'Applied AI & Machine Learning Engineering Roadmap',
      description:
        'A learning path covering Python, data analysis, and deep learning.',
      category: 'Artificial Intelligence',
      steps: {
        create: aiMlSteps,
      },
    },
  });

  console.log('Roadmap setup completed.');
  console.log(`Full Stack Engineer: ${fullStack.id}`);
  console.log(`AI/ML Engineer: ${aiMl.id}`);
}

main()
  .catch((error) => {
    console.error('Failed to seed roadmaps:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
