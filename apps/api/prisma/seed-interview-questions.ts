
import dotenv from "dotenv";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

const questions = [
  // TECHNICAL — BEGINNER
  {
    category: "TECHNICAL",
    difficulty: "BEGINNER",
    roleTarget: "Software Engineer",
    question: "What is the difference between let, const, and var in JavaScript?",
    interviewerIntent: "Tests JavaScript fundamentals and variable scope.",
    hintsJson: JSON.stringify(["Scope", "Reassignment", "Hoisting"]),
    sampleAnswerOutline:
      "Explain function scope versus block scope, reassignment, redeclaration, and why let and const are generally preferred.",
  },
  {
    category: "TECHNICAL",
    difficulty: "BEGINNER",
    roleTarget: "Software Engineer",
    question: "What is the difference between an array and an object in JavaScript?",
    interviewerIntent: "Tests understanding of basic data structures.",
    hintsJson: JSON.stringify(["Indexed collections", "Key-value pairs", "Use cases"]),
    sampleAnswerOutline:
      "Describe arrays as ordered indexed collections and objects as key-value collections. Give a practical example of each.",
  },
  {
    category: "TECHNICAL",
    difficulty: "INTERMEDIATE",
    roleTarget: "Software Engineer",
    question: "Explain promises and async/await in JavaScript.",
    interviewerIntent: "Evaluates asynchronous programming knowledge.",
    hintsJson: JSON.stringify(["Promise states", "try/catch", "Asynchronous operations"]),
    sampleAnswerOutline:
      "Explain pending, fulfilled, and rejected promise states. Show how async/await improves readability and how try/catch handles errors.",
  },
  {
    category: "TECHNICAL",
    difficulty: "INTERMEDIATE",
    roleTarget: "Software Engineer",
    question: "What is the difference between authentication and authorization?",
    interviewerIntent: "Checks knowledge of application security.",
    hintsJson: JSON.stringify(["Identity", "Permissions", "Access control"]),
    sampleAnswerOutline:
      "Authentication verifies who a user is; authorization determines what that user can access. Give a login and role-permission example.",
  },
  {
    category: "TECHNICAL",
    difficulty: "INTERMEDIATE",
    roleTarget: "Software Engineer",
    question: "What is a REST API, and what are common HTTP methods?",
    interviewerIntent: "Assesses backend and API fundamentals.",
    hintsJson: JSON.stringify(["GET", "POST", "PUT", "PATCH", "DELETE", "Status codes"]),
    sampleAnswerOutline:
      "Explain resource-oriented endpoints, HTTP methods, status codes, and an example of CRUD operations.",
  },
  {
    category: "TECHNICAL",
    difficulty: "ADVANCED",
    roleTarget: "Software Engineer",
    question: "How would you investigate and optimize a slow database query?",
    interviewerIntent: "Evaluates debugging and database optimization skills.",
    hintsJson: JSON.stringify(["Execution plan", "Indexes", "Query patterns", "Measurements"]),
    sampleAnswerOutline:
      "Measure the problem, inspect the query execution plan, check indexes and joins, optimize the query, and compare performance before and after.",
  },

  // BEHAVIORAL
  {
    category: "BEHAVIORAL",
    difficulty: "BEGINNER",
    roleTarget: "Any Role",
    question: "Tell me about a project you are proud of.",
    interviewerIntent: "Evaluates ownership, communication, and project understanding.",
    hintsJson: JSON.stringify(["Problem", "Your contribution", "Outcome", "Learning"]),
    sampleAnswerOutline:
      "Describe the project's goal, your individual contribution, a challenge you handled, the outcome, and what you learned.",
  },
  {
    category: "BEHAVIORAL",
    difficulty: "INTERMEDIATE",
    roleTarget: "Any Role",
    question: "Tell me about a time you faced a difficult technical problem.",
    interviewerIntent: "Assesses problem-solving and persistence.",
    hintsJson: JSON.stringify(["Situation", "Task", "Action", "Result"]),
    sampleAnswerOutline:
      "Use STAR: explain the situation and task, describe the specific actions you took, and share the measurable or observable result.",
  },
  {
    category: "BEHAVIORAL",
    difficulty: "INTERMEDIATE",
    roleTarget: "Any Role",
    question: "Describe a time you received critical feedback.",
    interviewerIntent: "Checks self-awareness and willingness to improve.",
    hintsJson: JSON.stringify(["Listen", "Reflect", "Act", "Improve"]),
    sampleAnswerOutline:
      "Describe the feedback, how you responded constructively, what you changed, and how the change improved your work.",
  },
  {
    category: "BEHAVIORAL",
    difficulty: "INTERMEDIATE",
    roleTarget: "Any Role",
    question: "How do you manage competing deadlines?",
    interviewerIntent: "Evaluates prioritization and time management.",
    hintsJson: JSON.stringify(["Impact", "Urgency", "Planning", "Communication"]),
    sampleAnswerOutline:
      "Explain how you prioritize by impact and urgency, break work into tasks, track progress, and communicate risks early.",
  },

  // SYSTEM DESIGN
  {
    category: "SYSTEM_DESIGN",
    difficulty: "BEGINNER",
    roleTarget: "Software Engineer",
    question: "How would you design a URL shortening service?",
    interviewerIntent: "Tests basic system design and API thinking.",
    hintsJson: JSON.stringify(["API endpoints", "Unique IDs", "Database", "Redirects"]),
    sampleAnswerOutline:
      "Describe URL creation and redirect APIs, unique short-code generation, database storage, validation, and handling missing URLs.",
  },
  {
    category: "SYSTEM_DESIGN",
    difficulty: "INTERMEDIATE",
    roleTarget: "Software Engineer",
    question: "How would you design a scalable notification system?",
    interviewerIntent: "Evaluates asynchronous processing and scalability.",
    hintsJson: JSON.stringify(["Queues", "Workers", "Retries", "Delivery status"]),
    sampleAnswerOutline:
      "Explain an API, message queue, worker services, delivery providers, retry handling, idempotency, and monitoring.",
  },
  {
    category: "SYSTEM_DESIGN",
    difficulty: "ADVANCED",
    roleTarget: "Software Engineer",
    question: "How would you design a system that handles heavy traffic and remains available?",
    interviewerIntent: "Assesses scalability, reliability, and trade-off analysis.",
    hintsJson: JSON.stringify(["Load balancing", "Caching", "Replication", "Monitoring"]),
    sampleAnswerOutline:
      "Discuss requirements and bottlenecks, load balancing, caching, database replication, failure recovery, observability, and consistency trade-offs.",
  },

  // HR
  {
    category: "HR",
    difficulty: "BEGINNER",
    roleTarget: "Any Role",
    question: "Tell me about yourself.",
    interviewerIntent: "Assesses communication and relevance to the role.",
    hintsJson: JSON.stringify(["Education", "Skills", "Projects", "Career goals"]),
    sampleAnswerOutline:
      "Give a concise introduction covering education, relevant skills, one project or achievement, and why the role interests you.",
  },
  {
    category: "HR",
    difficulty: "BEGINNER",
    roleTarget: "Any Role",
    question: "Why do you want this internship or job?",
    interviewerIntent: "Evaluates motivation and role alignment.",
    hintsJson: JSON.stringify(["Role requirements", "Learning goals", "Relevant skills"]),
    sampleAnswerOutline:
      "Connect the role to your interests, explain relevant skills or projects, and identify what you hope to contribute and learn.",
  },
  {
    category: "HR",
    difficulty: "INTERMEDIATE",
    roleTarget: "Any Role",
    question: "What is one of your strengths and one area you are improving?",
    interviewerIntent: "Checks self-awareness and growth mindset.",
    hintsJson: JSON.stringify(["Specific example", "Honest reflection", "Improvement plan"]),
    sampleAnswerOutline:
      "Name a relevant strength supported by an example. Identify a genuine improvement area and explain the concrete steps you are taking.",
  },
  {
    category: "HR",
    difficulty: "INTERMEDIATE",
    roleTarget: "Any Role",
    question: "How would you handle a disagreement with a teammate?",
    interviewerIntent: "Evaluates teamwork and conflict resolution.",
    hintsJson: JSON.stringify(["Listen", "Evidence", "Respect", "Shared goals"]),
    sampleAnswerOutline:
      "Explain how you listen to both perspectives, discuss evidence respectfully, agree on a solution, and focus on the team's goals.",
  },
];

async function main() {
  let added = 0;
  let skipped = 0;

  for (const item of questions) {
    const existing = await prisma.interviewQuestion.findFirst({
      where: {
        question: item.question,
        category: item.category,
      },
      select: { id: true },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.interviewQuestion.create({
      data: {
        ...item,
        interviewerIntent: item.interviewerIntent,
        sampleAnswerOutline: item.sampleAnswerOutline,
        companyTarget: null,
        isFromCandidateReport: false,
        sourceAttribution: "InternProof AI starter question bank",
      },
    });

    added++;
  }

  console.log(`Question bank setup complete.`);
  console.log(`Questions added: ${added}`);
  console.log(`Existing questions skipped: ${skipped}`);
  console.log(`Total starter questions: ${questions.length}`);
}

main()
  .catch((error) => {
    console.error("Failed to populate interview questions:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
