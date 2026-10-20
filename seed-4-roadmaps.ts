import dotenv from 'dotenv';
import path from 'node:path';
import { existsSync, writeFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';

// Load env from apps/api/.env or .env
const apiEnv = path.resolve(process.cwd(), 'apps/api/.env');
const rootEnv = path.resolve(process.cwd(), '.env');

if (existsSync(apiEnv)) {
  dotenv.config({ path: apiEnv });
} else if (existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
}

const prisma = new PrismaClient();

const roadmapsData = [
  {
    targetRole: 'Full Stack Engineer',
    title: 'Full Stack Web Engineering Preparation Roadmap',
    description: 'A project-focused guide to frontend, backend, databases, and production deployment with curated training videos.',
    category: 'Software Engineering',
    steps: [
      {
        stepNumber: 1,
        title: 'Modern TypeScript & Frontend Fundamentals',
        description: 'Master strict TypeScript types, asynchronous programming, React component lifecycle, and state architecture.',
        prerequisites: ['Basic JavaScript'],
        skillsCovered: ['TypeScript', 'React'],
        estimatedHours: 15,
        resources: [
          {
            title: 'React & TypeScript Full Tutorial for Beginners',
            url: 'https://www.youtube.com/watch?v=FJDVKeh7RJI',
            provider: 'freeCodeCamp (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'TypeScript Official Handbook',
            url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
            provider: 'TypeScript Official Docs',
            type: 'DOCUMENTATION',
            isFree: true,
          },
          {
            title: 'React Interactive Documentation',
            url: 'https://react.dev/learn',
            provider: 'React Team',
            type: 'DOCUMENTATION',
            isFree: true,
          },
        ],
        practiceTasks: [
          'Build a typed task dashboard using React and TypeScript.',
          'Refactor untyped props into strictly typed interfaces.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Backend API Engineering & REST Standards',
        description: 'Build Express and Node.js microservices with JWT authentication, Zod input validation, and secure error handling.',
        prerequisites: ['TypeScript Fundamentals'],
        skillsCovered: ['Node.js', 'Express.js', 'TypeScript', 'REST API'],
        estimatedHours: 20,
        resources: [
          {
            title: 'Node.js and Express.js - Full Backend Course',
            url: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
            provider: 'freeCodeCamp (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'Node.js Official Developer Guide',
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
        ],
        practiceTasks: [
          'Build an authentication API with bcrypt password hashing and HTTP-only cookies.',
          'Validate all API request bodies and route params using Zod.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Relational Database Modeling & ORM Integration',
        description: 'Design normalized SQL relational schemas, configure foreign key constraints, indexes, and migrations with Prisma.',
        prerequisites: ['Backend API Engineering'],
        skillsCovered: ['SQL', 'PostgreSQL', 'Prisma'],
        estimatedHours: 18,
        resources: [
          {
            title: 'Prisma ORM & PostgreSQL Crash Course',
            url: 'https://www.youtube.com/watch?v=RebA5J-rlhU',
            provider: 'Web Dev Simplified (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'Prisma Getting Started Documentation',
            url: 'https://www.prisma.io/docs/getting-started',
            provider: 'Prisma Documentation',
            type: 'DOCUMENTATION',
            isFree: true,
          },
          {
            title: 'PostgreSQL Tutorial & Indexing Fundamentals',
            url: 'https://www.postgresqltutorial.com/',
            provider: 'PostgreSQL Guides',
            type: 'TUTORIAL',
            isFree: true,
          },
        ],
        practiceTasks: [
          'Create a relational schema with one-to-many and many-to-many relationships.',
          'Practice SQL query optimization using EXPLAIN ANALYZE on indexed vs unindexed columns.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Containerization & Cloud Deployment',
        description: 'Containerize full-stack applications with Docker, author multi-stage builds, and deploy with automated CI/CD.',
        prerequisites: ['Relational Database Modeling'],
        skillsCovered: ['Docker', 'Docker Compose', 'Git', 'CI/CD'],
        estimatedHours: 12,
        resources: [
          {
            title: 'Docker Tutorial for Beginners (Full Course)',
            url: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
            provider: 'TechWorld with Nana (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'Docker Official Get Started Guide',
            url: 'https://docs.docker.com/get-started/',
            provider: 'Docker Docs',
            type: 'DOCUMENTATION',
            isFree: true,
          },
        ],
        practiceTasks: [
          'Write a multi-stage Dockerfile for a React Vite application.',
          'Create a Docker Compose configuration linking the API server and PostgreSQL database.',
        ],
      },
    ],
  },
  {
    targetRole: 'AI/ML Engineer',
    title: 'Applied AI & Machine Learning Engineering Roadmap',
    description: 'A comprehensive pathway covering Python scientific computing, PyTorch model training, and Transformer architectures.',
    category: 'Artificial Intelligence',
    steps: [
      {
        stepNumber: 1,
        title: 'Scientific Python & Data Manipulation',
        description: 'Vectorized computing with NumPy, data transformation with Pandas, and exploratory data analysis on real datasets.',
        prerequisites: ['Basic Python'],
        skillsCovered: ['Python', 'NumPy', 'Pandas'],
        estimatedHours: 16,
        resources: [
          {
            title: 'Python for Data Science - NumPy, Pandas & Matplotlib',
            url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
            provider: 'freeCodeCamp (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'NumPy Absolute Beginners Guide',
            url: 'https://numpy.org/doc/stable/user/absolute_beginners.html',
            provider: 'NumPy.org',
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
        ],
        practiceTasks: [
          'Clean and analyze a real-world tabular dataset with missing values and outliers.',
          'Build an exploratory data analysis dashboard plotting feature distributions.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Deep Learning with PyTorch & Neural Networks',
        description: 'Tensors, autograd, custom neural network layers, loss functions, optimizers, and complete model training loops.',
        prerequisites: ['Scientific Python'],
        skillsCovered: ['PyTorch', 'Python', 'Deep Learning'],
        estimatedHours: 24,
        resources: [
          {
            title: 'PyTorch for Deep Learning & Machine Learning - Full Course',
            url: 'https://www.youtube.com/watch?v=V_xro1bcAuA',
            provider: 'freeCodeCamp (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'PyTorch 60-Minute Blitz Tutorial',
            url: 'https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html',
            provider: 'PyTorch Docs',
            type: 'TUTORIAL',
            isFree: true,
          },
        ],
        practiceTasks: [
          'Train a convolutional neural network on CIFAR-10 with data augmentation.',
          'Implement learning rate scheduling and model checkpointing with early stopping.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Natural Language Processing & Transformer Models',
        description: 'Fine-tune pretrained Hugging Face transformers, implement embeddings, and build practical generative AI pipelines.',
        prerequisites: ['Deep Learning with PyTorch'],
        skillsCovered: ['Transformers', 'Hugging Face', 'NLP', 'LLMs'],
        estimatedHours: 20,
        resources: [
          {
            title: 'Transformers & Large Language Models Full Course',
            url: 'https://www.youtube.com/watch?v=XfpMkf4rD6E',
            provider: 'freeCodeCamp (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'Hugging Face Official NLP Course',
            url: 'https://huggingface.co/learn/nlp-course',
            provider: 'Hugging Face Docs',
            type: 'DOCUMENTATION',
            isFree: true,
          },
        ],
        practiceTasks: [
          'Fine-tune a DistilBERT model for multi-class text sentiment classification.',
          'Build a Retrieval-Augmented Generation (RAG) prototype using vector embeddings.',
        ],
      },
    ],
  },
  {
    targetRole: 'Cloud & DevOps Engineer',
    title: 'Cloud & DevOps Engineering Career Roadmap',
    description: 'Master Linux internals, Docker containers, AWS cloud infrastructure, CI/CD automation, and Kubernetes orchestration.',
    category: 'Cloud & DevOps',
    steps: [
      {
        stepNumber: 1,
        title: 'Linux System Internals, Networking & Shell Automation',
        description: 'Master Linux directory architecture, process management, file permissions, bash scripting, SSH keys, and TCP/IP networking.',
        prerequisites: ['Basic Command Line'],
        skillsCovered: ['Linux', 'Bash', 'Computer Networking', 'SSH'],
        estimatedHours: 16,
        resources: [
          {
            title: 'Linux Operating System - Crash Course for Beginners',
            url: 'https://www.youtube.com/watch?v=sWbGOq-72gw',
            provider: 'freeCodeCamp (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'Computer Networking Course - Beginner to Advanced',
            url: 'https://www.youtube.com/watch?v=IPvYjXCsTg8',
            provider: 'freeCodeCamp (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'The Linux Command Line Documentation Guide',
            url: 'https://linuxcommand.org/tlcl.php',
            provider: 'LinuxCommand Docs',
            type: 'DOCUMENTATION',
            isFree: true,
          },
        ],
        practiceTasks: [
          'Write an automated Bash backup script that compresses log files and handles rotation.',
          'Set up a secure SSH key pair with custom firewall rules using UFW/iptables.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Containerization with Docker & Multi-Container Workflows',
        description: 'Build lightweight container images, multi-stage Dockerfiles, Docker Compose stacks, volume persistence, and isolated networks.',
        prerequisites: ['Linux & Shell Automation'],
        skillsCovered: ['Docker', 'Docker Compose', 'Container Security'],
        estimatedHours: 18,
        resources: [
          {
            title: 'Docker Tutorial for Beginners - Complete Hands-On Training',
            url: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
            provider: 'TechWorld with Nana (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'Docker Crash Course for Web Developers',
            url: 'https://www.youtube.com/watch?v=pg19Z8LL06w',
            provider: 'Traversy Media (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'Docker Official Documentation & Guides',
            url: 'https://docs.docker.com/get-started/',
            provider: 'Docker Docs',
            type: 'DOCUMENTATION',
            isFree: true,
          },
        ],
        practiceTasks: [
          'Containerize a full-stack Node.js + React + PostgreSQL app with Docker Compose.',
          'Optimize Dockerfile layer caching to reduce production image size below 100MB.',
        ],
      },
      {
        stepNumber: 3,
        title: 'AWS Cloud Architecture & Serverless Computing',
        description: 'Architect highly available cloud solutions using Amazon EC2, VPC networking, IAM security policies, S3 storage, and AWS Lambda.',
        prerequisites: ['Docker & Containerization'],
        skillsCovered: ['AWS', 'Cloud Architecture', 'Amazon S3', 'EC2', 'IAM', 'Serverless'],
        estimatedHours: 22,
        resources: [
          {
            title: 'AWS Certified Cloud Practitioner Training Course',
            url: 'https://www.youtube.com/watch?v=SOTamWNgDKc',
            provider: 'freeCodeCamp (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'AWS Cloud Fundamentals Video Masterclass',
            url: 'https://www.youtube.com/watch?v=k1RI5locZE4',
            provider: 'Traversy Media (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'AWS Architecture Center & Well-Architected Framework',
            url: 'https://aws.amazon.com/architecture/',
            provider: 'AWS Documentation',
            type: 'DOCUMENTATION',
            isFree: true,
          },
        ],
        practiceTasks: [
          'Deploy an auto-scaling group behind an Application Load Balancer with HTTPS in a custom VPC.',
          'Create an event-driven serverless pipeline with AWS S3, Lambda, and email alerts.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Infrastructure as Code (Terraform) & Automated CI/CD Pipelines',
        description: 'Automate infrastructure provisioning with Terraform, set up automated CI/CD pipelines with GitHub Actions, and master Kubernetes.',
        prerequisites: ['AWS Cloud Architecture'],
        skillsCovered: ['Terraform', 'GitHub Actions', 'CI/CD', 'Kubernetes'],
        estimatedHours: 24,
        resources: [
          {
            title: 'Terraform Course - Automate Cloud Infrastructure with IaC',
            url: 'https://www.youtube.com/watch?v=SLB_c_ayRMo',
            provider: 'freeCodeCamp (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'Kubernetes Tutorial for Beginners [Full Course]',
            url: 'https://www.youtube.com/watch?v=X48VuDVv0do',
            provider: 'TechWorld with Nana (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'GitHub Actions Official CI/CD Guide',
            url: 'https://docs.github.com/en/actions',
            provider: 'GitHub Docs',
            type: 'DOCUMENTATION',
            isFree: true,
          },
        ],
        practiceTasks: [
          'Write reusable Terraform modules to provision an entire cloud environment with remote state locking.',
          'Configure a complete GitHub Actions workflow that runs linter, test suite, and builds/pushes Docker images automatically.',
        ],
      },
    ],
  },
  {
    targetRole: 'Data Engineer',
    title: 'Data Engineering & Big Data Systems Roadmap',
    description: 'Master relational & analytical SQL, distributed data processing with Apache Spark, pipeline orchestration with Apache Airflow, and cloud data warehousing.',
    category: 'Data Engineering',
    steps: [
      {
        stepNumber: 1,
        title: 'Advanced SQL, Schema Modeling & Analytical Querying',
        description: 'Master window functions, CTEs, indexing strategies, query execution plan analysis, and Kimball dimensional data modeling.',
        prerequisites: ['Basic SQL & Python'],
        skillsCovered: ['SQL', 'PostgreSQL', 'Data Warehousing', 'Dimensional Modeling'],
        estimatedHours: 18,
        resources: [
          {
            title: 'SQL Tutorial - Full Database Course for Beginners & Intermediate',
            url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
            provider: 'freeCodeCamp (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'Advanced SQL for Data Engineers Video Masterclass',
            url: 'https://www.youtube.com/watch?v=BHwzDmx6vGQ',
            provider: 'Seattle Data Guy (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'PostgreSQL Window Functions & Optimization Manual',
            url: 'https://www.postgresql.org/docs/current/tutorial-window.html',
            provider: 'PostgreSQL Official Docs',
            type: 'DOCUMENTATION',
            isFree: true,
          },
        ],
        practiceTasks: [
          'Design a Star Schema for an e-commerce platform with Fact and Dimension tables.',
          'Write complex analytical SQL queries using partition window functions and recursive CTEs.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Distributed Computing & Data Transformation with Apache Spark (PySpark)',
        description: 'Process terabyte-scale datasets with PySpark DataFrames, Spark SQL, partitioned Parquet storage, and lazy evaluation optimizations.',
        prerequisites: ['Advanced SQL', 'Python Fundamentals'],
        skillsCovered: ['Python', 'Apache Spark', 'PySpark', 'Parquet', 'Distributed Systems'],
        estimatedHours: 22,
        resources: [
          {
            title: 'Apache Spark Full Course - Learn PySpark in 4 Hours',
            url: 'https://www.youtube.com/watch?v=_C8kWso4ne4',
            provider: 'freeCodeCamp (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'PySpark Tutorial for Beginners - Hands-on Project Training',
            url: 'https://www.youtube.com/watch?v=bkJZVMtQQPE',
            provider: 'DataTalksClub (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'Apache Spark Official Quick Start & API Guide',
            url: 'https://spark.apache.org/docs/latest/quick-start.html',
            provider: 'Apache Foundation',
            type: 'DOCUMENTATION',
            isFree: true,
          },
        ],
        practiceTasks: [
          'Build an ETL job in PySpark that ingests raw JSON logs, transforms schema, and outputs partitioned Snappy Parquet files.',
          'Optimize Spark shuffle operations and inspect Spark UI DAG stages for skew mitigation.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Workflow Orchestration with Apache Airflow & Data Build Tool (dbt)',
        description: 'Author Directed Acyclic Graphs (DAGs) in Python, manage task dependencies and retries, and transform analytical data with dbt.',
        prerequisites: ['PySpark & Python'],
        skillsCovered: ['Apache Airflow', 'dbt', 'Data Pipelines', 'Data Quality'],
        estimatedHours: 20,
        resources: [
          {
            title: 'Apache Airflow Complete Hands-On Video Tutorial',
            url: 'https://www.youtube.com/watch?v=K9AnJ9_ZAXE',
            provider: 'Marc Lamberti (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'dbt (Data Build Tool) Crash Course from Scratch',
            url: 'https://www.youtube.com/watch?v=5rNqVojb8Cc',
            provider: 'Kahan Data Solutions (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'Apache Airflow Core Concepts Documentation',
            url: 'https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/index.html',
            provider: 'Apache Airflow Docs',
            type: 'DOCUMENTATION',
            isFree: true,
          },
        ],
        practiceTasks: [
          'Create a production Airflow DAG with custom PythonOperators, alerts, and cron scheduling.',
          'Build modular dbt data transformation models with automated schema tests and unique constraint validations.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Cloud Data Warehouses (Snowflake / BigQuery) & Streaming with Apache Kafka',
        description: 'Connect cloud data lakes to Snowflake or BigQuery, establish real-time event streaming architectures with Kafka, and monitor pipelines.',
        prerequisites: ['Workflow Orchestration'],
        skillsCovered: ['Apache Kafka', 'Snowflake', 'BigQuery', 'Streaming Analytics'],
        estimatedHours: 24,
        resources: [
          {
            title: 'Apache Kafka Full Course for Beginners - Event Streaming',
            url: 'https://www.youtube.com/watch?v=R873BlNVUB4',
            provider: 'freeCodeCamp (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'Snowflake Cloud Data Platform - Complete Architecture Guide',
            url: 'https://www.youtube.com/watch?v=tT8l_1K9r4M',
            provider: 'freeCodeCamp (Video)',
            type: 'VIDEO',
            isFree: true,
          },
          {
            title: 'Confluent Kafka Developer Documentation & Architecture Guide',
            url: 'https://developer.confluent.io/what-is-apache-kafka/',
            provider: 'Confluent Docs',
            type: 'DOCUMENTATION',
            isFree: true,
          },
        ],
        practiceTasks: [
          'Implement a real-time Kafka producer and consumer with schema validation using Python.',
          'Build a continuous data loading pipeline into Snowflake using Snowpipe and external stages.',
        ],
      },
    ],
  },
];

async function main() {
  console.log('🚀 Seeding/Updating 4 Comprehensive Roadmaps with Training Videos in PostgreSQL...');

  const exportedRoadmaps: any[] = [];
  const exportedSteps: any[] = [];

  for (const rData of roadmapsData) {
    const roadmap = await prisma.learningRoadmap.upsert({
      where: { targetRole: rData.targetRole },
      update: {
        title: rData.title,
        description: rData.description,
        category: rData.category,
      },
      create: {
        targetRole: rData.targetRole,
        title: rData.title,
        description: rData.description,
        category: rData.category,
      },
    });

    exportedRoadmaps.push({
      id: roadmap.id,
      targetRole: roadmap.targetRole,
      title: roadmap.title,
      description: roadmap.description,
      category: roadmap.category,
      createdAt: roadmap.createdAt.getTime(),
    });

    for (const step of rData.steps) {
      const stepRecord = await prisma.roadmapStep.upsert({
        where: {
          roadmapId_stepNumber: {
            roadmapId: roadmap.id,
            stepNumber: step.stepNumber,
          },
        },
        update: {
          title: step.title,
          description: step.description,
          prerequisites: JSON.stringify(step.prerequisites),
          skillsCovered: JSON.stringify(step.skillsCovered),
          estimatedHours: step.estimatedHours,
          resourcesJson: JSON.stringify(step.resources),
          practiceTasksJson: JSON.stringify(step.practiceTasks),
        },
        create: {
          roadmapId: roadmap.id,
          stepNumber: step.stepNumber,
          title: step.title,
          description: step.description,
          prerequisites: JSON.stringify(step.prerequisites),
          skillsCovered: JSON.stringify(step.skillsCovered),
          estimatedHours: step.estimatedHours,
          resourcesJson: JSON.stringify(step.resources),
          practiceTasksJson: JSON.stringify(step.practiceTasks),
        },
      });

      exportedSteps.push({
        id: stepRecord.id,
        roadmapId: roadmap.id,
        stepNumber: stepRecord.stepNumber,
        title: stepRecord.title,
        description: stepRecord.description,
        prerequisites: stepRecord.prerequisites,
        skillsCovered: stepRecord.skillsCovered,
        estimatedHours: stepRecord.estimatedHours,
        resourcesJson: stepRecord.resourcesJson,
        practiceTasksJson: stepRecord.practiceTasksJson,
      });
    }

    console.log(`✅ Synced Roadmap: ${rData.targetRole} (${rData.steps.length} steps with videos)`);
  }

  // Update roadmaps-export.json
  const exportPayload = {
    roadmaps: exportedRoadmaps,
    steps: exportedSteps,
  };
  writeFileSync(
    path.resolve(process.cwd(), 'roadmaps-export.json'),
    JSON.stringify(exportPayload, null, 2),
    'utf-8'
  );
  console.log(`💾 Updated roadmaps-export.json with ${exportedRoadmaps.length} roadmaps and ${exportedSteps.length} steps.`);
}

main()
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
