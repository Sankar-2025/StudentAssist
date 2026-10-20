import dotenv from 'dotenv';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

dotenv.config({
  path: path.resolve(process.cwd(), 'apps/api/.env'),
});

const prisma = new PrismaClient();

async function main() {
  const roadmaps = [
    {
      targetRole: 'Full Stack Engineer',
      title: 'Full Stack Web Engineering Preparation Roadmap',
      description: 'A project-focused guide to frontend, backend, databases, and deployment with video courses.',
      category: 'Software Engineering',
      steps: [
        {
          stepNumber: 1,
          title: 'Modern TypeScript & Frontend Fundamentals',
          description: 'Master strict TypeScript types, asynchronous programming, React, and clean component architecture.',
          prerequisites: JSON.stringify(['Basic JavaScript']),
          skillsCovered: JSON.stringify(['TypeScript', 'React']),
          estimatedHours: 15,
          resourcesJson: JSON.stringify([
            { title: 'React & TypeScript Full Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=FJDVKeh7RJI', provider: 'freeCodeCamp (Video)', type: 'VIDEO', isFree: true },
            { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', provider: 'TypeScript Official Docs', type: 'DOCUMENTATION', isFree: true },
            { title: 'React Learn Guide', url: 'https://react.dev/learn', provider: 'React Team', type: 'DOCUMENTATION', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Build a typed task dashboard using React and TypeScript.',
            'Refactor untyped props into strictly typed interfaces.',
          ]),
        },
        {
          stepNumber: 2,
          title: 'Backend API Engineering & REST Standards',
          description: 'Build Express and Node.js services with authentication, validation, and error handling.',
          prerequisites: JSON.stringify(['TypeScript Fundamentals']),
          skillsCovered: JSON.stringify(['Node.js', 'Express.js', 'TypeScript']),
          estimatedHours: 20,
          resourcesJson: JSON.stringify([
            { title: 'Node.js and Express.js - Full Backend Course', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', provider: 'freeCodeCamp (Video)', type: 'VIDEO', isFree: true },
            { title: 'Node.js Learn', url: 'https://nodejs.org/en/learn', provider: 'OpenJS Foundation', type: 'DOCUMENTATION', isFree: true },
            { title: 'Express Security Best Practices', url: 'https://expressjs.com/en/advanced/best-practice-security.html', provider: 'Express Docs', type: 'DOCUMENTATION', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Build an authentication API with password hashing.',
            'Validate API request bodies using Zod.',
          ]),
        },
        {
          stepNumber: 3,
          title: 'Relational Database Modeling & ORM Integration',
          description: 'Design relational schemas, configure database relationships, and use Prisma ORM.',
          prerequisites: JSON.stringify(['Backend API Engineering']),
          skillsCovered: JSON.stringify(['SQL', 'Prisma', 'PostgreSQL']),
          estimatedHours: 18,
          resourcesJson: JSON.stringify([
            { title: 'Prisma ORM & PostgreSQL Crash Course', url: 'https://www.youtube.com/watch?v=RebA5J-rlhU', provider: 'Web Dev Simplified (Video)', type: 'VIDEO', isFree: true },
            { title: 'Prisma Getting Started', url: 'https://www.prisma.io/docs/getting-started', provider: 'Prisma Documentation', type: 'DOCUMENTATION', isFree: true },
            { title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/', provider: 'PostgreSQL Guides', type: 'TUTORIAL', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Create a relational schema with one-to-many relationships.',
            'Practice database queries and indexing.',
          ]),
        },
        {
          stepNumber: 4,
          title: 'Containerization & Cloud Deployment',
          description: 'Learn Docker, containerization, Git, and safe deployment configuration.',
          prerequisites: JSON.stringify(['Relational Database Modeling']),
          skillsCovered: JSON.stringify(['Docker', 'Git']),
          estimatedHours: 12,
          resourcesJson: JSON.stringify([
            { title: 'Docker Tutorial for Beginners (Full Course)', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', provider: 'TechWorld with Nana (Video)', type: 'VIDEO', isFree: true },
            { title: 'Docker Get Started', url: 'https://docs.docker.com/get-started/', provider: 'Docker Docs', type: 'DOCUMENTATION', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Write a Dockerfile for a React application.',
            'Create a Docker Compose setup for an API and database.',
          ]),
        },
      ],
    },
    {
      targetRole: 'AI/ML Engineer',
      title: 'Applied AI & Machine Learning Engineering Roadmap',
      description: 'A learning path covering Python, data analysis, deep learning, and transformer architectures.',
      category: 'Artificial Intelligence',
      steps: [
        {
          stepNumber: 1,
          title: 'Scientific Python & Data Manipulation',
          description: 'Learn NumPy, Pandas, data transformation, and exploratory data analysis.',
          prerequisites: JSON.stringify(['Basic Python']),
          skillsCovered: JSON.stringify(['Python', 'NumPy', 'Pandas']),
          estimatedHours: 16,
          resourcesJson: JSON.stringify([
            { title: 'Python for Data Science - NumPy, Pandas & Matplotlib', url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI', provider: 'freeCodeCamp (Video)', type: 'VIDEO', isFree: true },
            { title: 'NumPy Beginners Guide', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html', provider: 'NumPy', type: 'DOCUMENTATION', isFree: true },
            { title: 'Pandas 10-Minute Tutorial', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', provider: 'Pandas Docs', type: 'DOCUMENTATION', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Clean and analyze a dataset containing missing values.',
          ]),
        },
        {
          stepNumber: 2,
          title: 'Deep Learning with PyTorch',
          description: 'Learn tensors, automatic differentiation, neural networks, and model training.',
          prerequisites: JSON.stringify(['Scientific Python']),
          skillsCovered: JSON.stringify(['PyTorch', 'Python', 'Deep Learning']),
          estimatedHours: 24,
          resourcesJson: JSON.stringify([
            { title: 'PyTorch for Deep Learning & Machine Learning - Full Course', url: 'https://www.youtube.com/watch?v=V_xro1bcAuA', provider: 'freeCodeCamp (Video)', type: 'VIDEO', isFree: true },
            { title: 'PyTorch 60 Minute Blitz', url: 'https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html', provider: 'PyTorch Docs', type: 'TUTORIAL', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Train and evaluate a neural network on a sample dataset.',
          ]),
        },
        {
          stepNumber: 3,
          title: 'NLP & Transformer Models',
          description: 'Fine-tune pretrained transformers with Hugging Face for real NLP tasks.',
          prerequisites: JSON.stringify(['Deep Learning with PyTorch']),
          skillsCovered: JSON.stringify(['Transformers', 'Hugging Face', 'NLP']),
          estimatedHours: 20,
          resourcesJson: JSON.stringify([
            { title: 'Transformers & Large Language Models Full Course', url: 'https://www.youtube.com/watch?v=XfpMkf4rD6E', provider: 'freeCodeCamp (Video)', type: 'VIDEO', isFree: true },
            { title: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn/nlp-course', provider: 'Hugging Face Docs', type: 'DOCUMENTATION', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Fine-tune a DistilBERT text classifier on custom data.',
          ]),
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
          description: 'Master Linux directory architecture, process management, permissions, bash scripting, SSH, and networking.',
          prerequisites: JSON.stringify(['Basic Command Line']),
          skillsCovered: JSON.stringify(['Linux', 'Bash', 'Computer Networking', 'SSH']),
          estimatedHours: 16,
          resourcesJson: JSON.stringify([
            { title: 'Linux Operating System - Crash Course for Beginners', url: 'https://www.youtube.com/watch?v=sWbGOq-72gw', provider: 'freeCodeCamp (Video)', type: 'VIDEO', isFree: true },
            { title: 'Computer Networking Course - Beginner to Advanced', url: 'https://www.youtube.com/watch?v=IPvYjXCsTg8', provider: 'freeCodeCamp (Video)', type: 'VIDEO', isFree: true },
            { title: 'The Linux Command Line Documentation Guide', url: 'https://linuxcommand.org/tlcl.php', provider: 'LinuxCommand Docs', type: 'DOCUMENTATION', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Write an automated Bash backup script that compresses log files and handles rotation.',
            'Set up a secure SSH key pair with custom firewall rules using UFW/iptables.',
          ]),
        },
        {
          stepNumber: 2,
          title: 'Containerization with Docker & Multi-Container Workflows',
          description: 'Build lightweight container images, multi-stage Dockerfiles, Docker Compose stacks, and volume persistence.',
          prerequisites: JSON.stringify(['Linux & Shell Automation']),
          skillsCovered: JSON.stringify(['Docker', 'Docker Compose', 'Container Security']),
          estimatedHours: 18,
          resourcesJson: JSON.stringify([
            { title: 'Docker Tutorial for Beginners - Complete Hands-On Training', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', provider: 'TechWorld with Nana (Video)', type: 'VIDEO', isFree: true },
            { title: 'Docker Crash Course for Web Developers', url: 'https://www.youtube.com/watch?v=pg19Z8LL06w', provider: 'Traversy Media (Video)', type: 'VIDEO', isFree: true },
            { title: 'Docker Official Documentation & Guides', url: 'https://docs.docker.com/get-started/', provider: 'Docker Docs', type: 'DOCUMENTATION', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Containerize a full-stack Node.js + React + PostgreSQL app with Docker Compose.',
            'Optimize Dockerfile layer caching to reduce production image size below 100MB.',
          ]),
        },
        {
          stepNumber: 3,
          title: 'AWS Cloud Architecture & Serverless Computing',
          description: 'Architect highly available cloud solutions using Amazon EC2, VPC networking, IAM security policies, S3 storage, and AWS Lambda.',
          prerequisites: JSON.stringify(['Docker & Containerization']),
          skillsCovered: JSON.stringify(['AWS', 'Cloud Architecture', 'Amazon S3', 'EC2', 'IAM', 'Serverless']),
          estimatedHours: 22,
          resourcesJson: JSON.stringify([
            { title: 'AWS Certified Cloud Practitioner Training Course', url: 'https://www.youtube.com/watch?v=SOTamWNgDKc', provider: 'freeCodeCamp (Video)', type: 'VIDEO', isFree: true },
            { title: 'AWS Cloud Fundamentals Video Masterclass', url: 'https://www.youtube.com/watch?v=k1RI5locZE4', provider: 'Traversy Media (Video)', type: 'VIDEO', isFree: true },
            { title: 'AWS Architecture Center & Well-Architected Framework', url: 'https://aws.amazon.com/architecture/', provider: 'AWS Documentation', type: 'DOCUMENTATION', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Deploy an auto-scaling group behind an Application Load Balancer with HTTPS in a custom VPC.',
            'Create an event-driven serverless pipeline with AWS S3, Lambda, and email alerts.',
          ]),
        },
        {
          stepNumber: 4,
          title: 'Infrastructure as Code (Terraform) & Automated CI/CD Pipelines',
          description: 'Automate infrastructure provisioning with Terraform, set up automated CI/CD pipelines with GitHub Actions, and master Kubernetes.',
          prerequisites: JSON.stringify(['AWS Cloud Architecture']),
          skillsCovered: JSON.stringify(['Terraform', 'GitHub Actions', 'CI/CD', 'Kubernetes']),
          estimatedHours: 24,
          resourcesJson: JSON.stringify([
            { title: 'Terraform Course - Automate Cloud Infrastructure with IaC', url: 'https://www.youtube.com/watch?v=SLB_c_ayRMo', provider: 'freeCodeCamp (Video)', type: 'VIDEO', isFree: true },
            { title: 'Kubernetes Tutorial for Beginners [Full Course]', url: 'https://www.youtube.com/watch?v=X48VuDVv0do', provider: 'TechWorld with Nana (Video)', type: 'VIDEO', isFree: true },
            { title: 'GitHub Actions Official CI/CD Guide', url: 'https://docs.github.com/en/actions', provider: 'GitHub Docs', type: 'DOCUMENTATION', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Write reusable Terraform modules to provision an entire cloud environment with remote state locking.',
            'Configure a complete GitHub Actions workflow that runs linter, test suite, and builds/pushes Docker images automatically.',
          ]),
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
          prerequisites: JSON.stringify(['Basic SQL & Python']),
          skillsCovered: JSON.stringify(['SQL', 'PostgreSQL', 'Data Warehousing', 'Dimensional Modeling']),
          estimatedHours: 18,
          resourcesJson: JSON.stringify([
            { title: 'SQL Tutorial - Full Database Course for Beginners & Intermediate', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', provider: 'freeCodeCamp (Video)', type: 'VIDEO', isFree: true },
            { title: 'Advanced SQL for Data Engineers Video Masterclass', url: 'https://www.youtube.com/watch?v=BHwzDmx6vGQ', provider: 'Seattle Data Guy (Video)', type: 'VIDEO', isFree: true },
            { title: 'PostgreSQL Window Functions & Optimization Manual', url: 'https://www.postgresql.org/docs/current/tutorial-window.html', provider: 'PostgreSQL Official Docs', type: 'DOCUMENTATION', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Design a Star Schema for an e-commerce platform with Fact and Dimension tables.',
            'Write complex analytical SQL queries using partition window functions and recursive CTEs.',
          ]),
        },
        {
          stepNumber: 2,
          title: 'Distributed Computing & Data Transformation with Apache Spark (PySpark)',
          description: 'Process terabyte-scale datasets with PySpark DataFrames, Spark SQL, partitioned Parquet storage, and lazy evaluation optimizations.',
          prerequisites: JSON.stringify(['Advanced SQL', 'Python Fundamentals']),
          skillsCovered: JSON.stringify(['Python', 'Apache Spark', 'PySpark', 'Parquet', 'Distributed Systems']),
          estimatedHours: 22,
          resourcesJson: JSON.stringify([
            { title: 'Apache Spark Full Course - Learn PySpark in 4 Hours', url: 'https://www.youtube.com/watch?v=_C8kWso4ne4', provider: 'freeCodeCamp (Video)', type: 'VIDEO', isFree: true },
            { title: 'PySpark Tutorial for Beginners - Hands-on Project Training', url: 'https://www.youtube.com/watch?v=bkJZVMtQQPE', provider: 'DataTalksClub (Video)', type: 'VIDEO', isFree: true },
            { title: 'Apache Spark Official Quick Start & API Guide', url: 'https://spark.apache.org/docs/latest/quick-start.html', provider: 'Apache Foundation', type: 'DOCUMENTATION', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Build an ETL job in PySpark that ingests raw JSON logs, transforms schema, and outputs partitioned Snappy Parquet files.',
            'Optimize Spark shuffle operations and inspect Spark UI DAG stages for skew mitigation.',
          ]),
        },
        {
          stepNumber: 3,
          title: 'Workflow Orchestration with Apache Airflow & Data Build Tool (dbt)',
          description: 'Author Directed Acyclic Graphs (DAGs) in Python, manage task dependencies and retries, and transform analytical data with dbt.',
          prerequisites: JSON.stringify(['PySpark & Python']),
          skillsCovered: JSON.stringify(['Apache Airflow', 'dbt', 'Data Pipelines', 'Data Quality']),
          estimatedHours: 20,
          resourcesJson: JSON.stringify([
            { title: 'Apache Airflow Complete Hands-On Video Tutorial', url: 'https://www.youtube.com/watch?v=K9AnJ9_ZAXE', provider: 'Marc Lamberti (Video)', type: 'VIDEO', isFree: true },
            { title: 'dbt (Data Build Tool) Crash Course from Scratch', url: 'https://www.youtube.com/watch?v=5rNqVojb8Cc', provider: 'Kahan Data Solutions (Video)', type: 'VIDEO', isFree: true },
            { title: 'Apache Airflow Core Concepts Documentation', url: 'https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/index.html', provider: 'Apache Airflow Docs', type: 'DOCUMENTATION', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Create a production Airflow DAG with custom PythonOperators, alerts, and cron scheduling.',
            'Build modular dbt data transformation models with automated schema tests and unique constraint validations.',
          ]),
        },
        {
          stepNumber: 4,
          title: 'Cloud Data Warehouses (Snowflake / BigQuery) & Streaming with Apache Kafka',
          description: 'Connect cloud data lakes to Snowflake or BigQuery, establish real-time event streaming architectures with Kafka, and monitor pipelines.',
          prerequisites: JSON.stringify(['Workflow Orchestration']),
          skillsCovered: JSON.stringify(['Apache Kafka', 'Snowflake', 'BigQuery', 'Streaming Analytics']),
          estimatedHours: 24,
          resourcesJson: JSON.stringify([
            { title: 'Apache Kafka Full Course for Beginners - Event Streaming', url: 'https://www.youtube.com/watch?v=R873BlNVUB4', provider: 'freeCodeCamp (Video)', type: 'VIDEO', isFree: true },
            { title: 'Snowflake Cloud Data Platform - Complete Architecture Guide', url: 'https://www.youtube.com/watch?v=tT8l_1K9r4M', provider: 'freeCodeCamp (Video)', type: 'VIDEO', isFree: true },
            { title: 'Confluent Kafka Developer Documentation & Architecture Guide', url: 'https://developer.confluent.io/what-is-apache-kafka/', provider: 'Confluent Docs', type: 'DOCUMENTATION', isFree: true },
          ]),
          practiceTasksJson: JSON.stringify([
            'Implement a real-time Kafka producer and consumer with schema validation using Python.',
            'Build a continuous data loading pipeline into Snowflake using Snowpipe and external stages.',
          ]),
        },
      ],
    },
  ];

  for (const r of roadmaps) {
    const roadmap = await prisma.learningRoadmap.upsert({
      where: { targetRole: r.targetRole },
      update: {
        title: r.title,
        description: r.description,
        category: r.category,
      },
      create: {
        targetRole: r.targetRole,
        title: r.title,
        description: r.description,
        category: r.category,
      },
    });

    for (const step of r.steps) {
      await prisma.roadmapStep.upsert({
        where: {
          roadmapId_stepNumber: {
            roadmapId: roadmap.id,
            stepNumber: step.stepNumber,
          },
        },
        update: {
          title: step.title,
          description: step.description,
          prerequisites: step.prerequisites,
          skillsCovered: step.skillsCovered,
          estimatedHours: step.estimatedHours,
          resourcesJson: step.resourcesJson,
          practiceTasksJson: step.practiceTasksJson,
        },
        create: {
          roadmapId: roadmap.id,
          stepNumber: step.stepNumber,
          title: step.title,
          description: step.description,
          prerequisites: step.prerequisites,
          skillsCovered: step.skillsCovered,
          estimatedHours: step.estimatedHours,
          resourcesJson: step.resourcesJson,
          practiceTasksJson: step.practiceTasksJson,
        },
      });
    }

    console.log(`Synced roadmap ${r.targetRole}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
