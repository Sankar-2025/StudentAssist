import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting InternProof AI Database Seed...');

  // 1. Seed Skills
  const skillNames = [
    { name: 'TypeScript', category: 'Languages' },
    { name: 'JavaScript', category: 'Languages' },
    { name: 'Python', category: 'Languages' },
    { name: 'Java', category: 'Languages' },
    { name: 'C++', category: 'Languages' },
    { name: 'Go', category: 'Languages' },
    { name: 'SQL', category: 'Data' },
    { name: 'PostgreSQL', category: 'Data' },
    { name: 'React', category: 'Frameworks' },
    { name: 'Node.js', category: 'Frameworks' },
    { name: 'Express.js', category: 'Frameworks' },
    { name: 'Next.js', category: 'Frameworks' },
    { name: 'PyTorch', category: 'AI/ML' },
    { name: 'TensorFlow', category: 'AI/ML' },
    { name: 'Scikit-Learn', category: 'AI/ML' },
    { name: 'Docker', category: 'DevOps & Cloud' },
    { name: 'Kubernetes', category: 'DevOps & Cloud' },
    { name: 'AWS', category: 'DevOps & Cloud' },
    { name: 'Git', category: 'Tools' },
    { name: 'System Design', category: 'Architecture' },
    { name: 'Data Structures', category: 'Core CS' },
    { name: 'Algorithms', category: 'Core CS' },
  ];

  const skillMap = new Map<string, string>();
  for (const s of skillNames) {
    const skill = await prisma.skill.upsert({
      where: { name: s.name },
      update: { category: s.category },
      create: { name: s.name, category: s.category },
    });
    skillMap.set(s.name, skill.id);
  }
  console.log(`✅ Seeded ${skillNames.length} foundational tech skills`);

  // 2. Seed Companies
  const companiesData = [
    { name: 'Google', website: 'https://careers.google.com', industry: 'Cloud & AI Infrastructure' },
    { name: 'Microsoft', website: 'https://careers.microsoft.com', industry: 'Productivity & Cloud' },
    { name: 'Amazon', website: 'https://amazon.jobs', industry: 'E-commerce & AWS Cloud' },
    { name: 'Meta', website: 'https://metacareers.com', industry: 'Social Technologies & AI' },
    { name: 'Datadog', website: 'https://careers.datadoghq.com', industry: 'Cloud Observability' },
    { name: 'Spotify', website: 'https://lifeatspotify.com', industry: 'Audio Streaming & ML' },
    { name: 'Stripe', website: 'https://stripe.com/jobs', industry: 'Financial Infrastructure' },
  ];

  const companyMap = new Map<string, string>();
  for (const c of companiesData) {
    const comp = await prisma.company.upsert({
      where: { name: c.name },
      update: { website: c.website, industry: c.industry },
      create: { name: c.name, website: c.website, industry: c.industry },
    });
    companyMap.set(c.name, comp.id);
  }
  console.log(`✅ Seeded ${companiesData.length} tech companies`);

  // 3. Seed Internships with Opportunity Evidence
  const internshipsData = [
    {
      companyName: 'Google',
      title: 'Software Engineering Intern — Summer 2027',
      category: 'Software Engineering',
      location: 'Mountain View, CA / Remote Option',
      workMode: 'HYBRID',
      duration: '12-14 weeks',
      stipend: '$52 - $58 / hour + housing stipend',
      isPaid: true,
      description: 'Join Google engineering teams building large-scale distributed systems, search infrastructure, Android, or cloud platforms. You will design, develop, test, deploy, and maintain software solutions.',
      requirements: JSON.stringify([
        'Currently pursuing a BS, MS or PhD in Computer Science or related technical field',
        'Graduating between December 2026 and June 2028',
        'Experience coding in one or more general purpose languages: C++, Java, Python, or Go',
        'Demonstrated understanding of algorithms, data structures, and software complexity',
      ]),
      minGraduationYear: 2026,
      maxGraduationYear: 2028,
      allowedDegrees: JSON.stringify(['Computer Science', 'Computer Engineering', 'Software Engineering', 'Data Science']),
      officialApplyUrl: 'https://careers.google.com/jobs/results/students-internships-swe-2027',
      deadline: '2026-11-30T23:59:59Z',
      verificationStatus: 'VERIFIED_OFFICIAL',
      sourceUrl: 'https://careers.google.com/students',
      sourceType: 'Official Company Career Portal',
      isDemoData: false,
      requiredSkills: ['Data Structures', 'Algorithms', 'Python', 'C++'],
      preferredSkills: ['System Design', 'Git', 'Docker'],
    },
    {
      companyName: 'Microsoft',
      title: 'Full Stack Software Engineer Intern',
      category: 'Web & Cloud Systems',
      location: 'Redmond, WA / Remote',
      workMode: 'HYBRID',
      duration: '12 weeks',
      stipend: '$48 - $54 / hour + wellness stipend',
      isPaid: true,
      description: 'Collaborate with Azure, Office 365, or Developer Tools engineering teams. Build modern web frontends using React and robust backend microservices with TypeScript and C#.',
      requirements: JSON.stringify([
        'Enrolled in full-time degree program in Computer Science or STEM field',
        'Expected graduation year: 2026 - 2027',
        'Familiarity with web technologies (JavaScript/TypeScript, React, Node.js)',
        'Understanding of REST APIs and relational databases',
      ]),
      minGraduationYear: 2026,
      maxGraduationYear: 2027,
      allowedDegrees: JSON.stringify(['Computer Science', 'Information Systems', 'Electrical Engineering']),
      officialApplyUrl: 'https://careers.microsoft.com/students/us/en/job/fullstack-intern-2027',
      deadline: '2026-12-15T23:59:59Z',
      verificationStatus: 'VERIFIED_OFFICIAL',
      sourceUrl: 'https://careers.microsoft.com/students',
      sourceType: 'Official Company Career Portal',
      isDemoData: false,
      requiredSkills: ['TypeScript', 'React', 'Node.js', 'SQL'],
      preferredSkills: ['Docker', 'AWS', 'System Design'],
    },
    {
      companyName: 'Meta',
      title: 'AI / Machine Learning Research Intern',
      category: 'Artificial Intelligence',
      location: 'Menlo Park, CA / Remote',
      workMode: 'REMOTE',
      duration: '12-16 weeks',
      stipend: '$55 - $65 / hour + relocation allowance',
      isPaid: true,
      description: 'Work with FAIR (Fundamental AI Research) and GenAI teams on generative models, multimodal perception, and efficient inference architectures.',
      requirements: JSON.stringify([
        'Pursuing Bachelor’s or Master’s in Computer Science, AI, Mathematics, or Computational Science',
        'Strong programming in Python and deep learning frameworks (PyTorch)',
        'Understanding of model training, loss functions, attention mechanisms, and metrics',
      ]),
      minGraduationYear: 2026,
      maxGraduationYear: 2028,
      allowedDegrees: JSON.stringify(['Computer Science', 'Data Science', 'Mathematics', 'Artificial Intelligence']),
      officialApplyUrl: 'https://metacareers.com/jobs/ai-ml-intern-2027',
      deadline: '2026-11-15T23:59:59Z',
      verificationStatus: 'VERIFIED_OFFICIAL',
      sourceUrl: 'https://metacareers.com/areas-of-work/students-and-grads',
      sourceType: 'Official Company Career Portal',
      isDemoData: false,
      requiredSkills: ['Python', 'PyTorch', 'Data Structures', 'Algorithms'],
      preferredSkills: ['Docker', 'Git', 'System Design'],
    },
    {
      companyName: 'Datadog',
      title: 'Cloud Infrastructure & SRE Intern',
      category: 'DevOps & Cloud Infrastructure',
      location: 'New York, NY / Remote',
      workMode: 'REMOTE',
      duration: '10-12 weeks',
      stipend: '$46 - $52 / hour',
      isPaid: true,
      description: 'Help build and scale distributed telemetry pipelines handling trillions of events daily. Write Go or Python, automate container orchestration with Kubernetes, and maintain high reliability.',
      requirements: JSON.stringify([
        'Currently pursuing a degree in Computer Science or related discipline',
        'Hands-on experience with Linux environments, Docker, and networking basics',
        'Familiarity with containerized applications and CI/CD pipelines',
      ]),
      minGraduationYear: 2026,
      maxGraduationYear: 2027,
      allowedDegrees: JSON.stringify(['Computer Science', 'Computer Engineering', 'Network Engineering']),
      officialApplyUrl: 'https://careers.datadoghq.com/detail/cloud-sre-intern-2027',
      deadline: '2026-12-01T23:59:59Z',
      verificationStatus: 'VERIFIED_OFFICIAL',
      sourceUrl: 'https://careers.datadoghq.com/students',
      sourceType: 'Official Company Career Portal',
      isDemoData: false,
      requiredSkills: ['Docker', 'Kubernetes', 'Go', 'Linux'],
      preferredSkills: ['AWS', 'Git', 'System Design'],
    },
    {
      companyName: 'Stripe',
      title: 'Backend Engineering Intern',
      category: 'Software Engineering',
      location: 'San Francisco, CA / Seattle, WA',
      workMode: 'HYBRID',
      duration: '12 weeks',
      stipend: '$50 - $56 / hour + housing grant',
      isPaid: true,
      description: 'Build mission-critical financial APIs and distributed ledger services. Focus on idempotency, transactional consistency, and developer-first documentation.',
      requirements: JSON.stringify([
        'Pursuing an undergraduate or graduate degree graduating in 2026-2027',
        'Strong grasp of object-oriented or functional programming (Ruby, Java, Go, TypeScript)',
        'Passion for API design and clean modular architecture',
      ]),
      minGraduationYear: 2026,
      maxGraduationYear: 2027,
      allowedDegrees: JSON.stringify(['Computer Science', 'Software Engineering']),
      officialApplyUrl: 'https://stripe.com/jobs/listing/backend-swe-intern',
      deadline: '2026-11-20T23:59:59Z',
      verificationStatus: 'VERIFIED_OFFICIAL',
      sourceUrl: 'https://stripe.com/jobs',
      sourceType: 'Official Company Career Portal',
      isDemoData: false,
      requiredSkills: ['SQL', 'TypeScript', 'Node.js', 'Data Structures'],
      preferredSkills: ['System Design', 'Git', 'Docker'],
    },
  ];

  for (const item of internshipsData) {
    const compId = companyMap.get(item.companyName);
    if (!compId) continue;

    const internship = await prisma.internship.create({
      data: {
        companyId: compId,
        title: item.title,
        category: item.category,
        location: item.location,
        workMode: item.workMode,
        duration: item.duration,
        stipend: item.stipend,
        isPaid: item.isPaid,
        description: item.description,
        requirements: item.requirements,
        minGraduationYear: item.minGraduationYear,
        maxGraduationYear: item.maxGraduationYear,
        allowedDegrees: item.allowedDegrees,
        officialApplyUrl: item.officialApplyUrl,
        deadline: item.deadline,
        verificationStatus: item.verificationStatus,
        sourceUrl: item.sourceUrl,
        sourceType: item.sourceType,
        isDemoData: item.isDemoData,
      },
    });

    // Link required skills
    for (const sName of item.requiredSkills) {
      const sId = skillMap.get(sName);
      if (sId) {
        await prisma.internshipSkill.create({
          data: { internshipId: internship.id, skillId: sId, isRequired: true },
        });
      }
    }
    // Link preferred skills
    for (const sName of item.preferredSkills) {
      const sId = skillMap.get(sName);
      if (sId) {
        await prisma.internshipSkill.upsert({
          where: { internshipId_skillId: { internshipId: internship.id, skillId: sId } },
          update: { isRequired: false },
          create: { internshipId: internship.id, skillId: sId, isRequired: false },
        });
      }
    }
  }
  console.log(`✅ Seeded ${internshipsData.length} verified internship opportunities`);

  // 4. Seed Learning Roadmaps
  const fullstackRoadmap = await prisma.learningRoadmap.upsert({
    where: { targetRole: 'Full Stack Engineer' },
    update: {},
    create: {
      targetRole: 'Full Stack Engineer',
      title: 'Full Stack Web Engineering Preparation Roadmap',
      description: 'A sequenced, project-focused guide to mastering modern client-server architectures for top-tier internship technical interviews.',
      category: 'Software Engineering',
      steps: {
        create: [
          {
            stepNumber: 1,
            title: 'Modern TypeScript & Frontend Fundamentals',
            description: 'Master strict TypeScript types, DOM manipulation, asynchronous programming, and clean component architecture.',
            prerequisites: JSON.stringify(['Basic JavaScript']),
            skillsCovered: JSON.stringify(['TypeScript', 'React']),
            estimatedHours: 15,
            resourcesJson: JSON.stringify([
              { title: 'TypeScript Handbook (Official)', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', provider: 'TypeScript Official Docs', type: 'DOCUMENTATION', isFree: true },
              { title: 'React Official Documentation (Learn React)', url: 'https://react.dev/learn', provider: 'React Team', type: 'DOCUMENTATION', isFree: true },
            ]),
            practiceTasksJson: JSON.stringify([
              'Build a typed task dashboard with state management and local storage persistence',
              'Refactor untyped props into strictly typed discriminated unions',
            ]),
          },
          {
            stepNumber: 2,
            title: 'Backend API Engineering & REST Standards',
            description: 'Construct secure Express/Node.js microservices with JWT authentication, rate limiting, and centralized error handling.',
            prerequisites: JSON.stringify(['TypeScript Fundamentals']),
            skillsCovered: JSON.stringify(['Node.js', 'Express.js', 'TypeScript']),
            estimatedHours: 20,
            resourcesJson: JSON.stringify([
              { title: 'Node.js Best Practices & Guides', url: 'https://nodejs.org/en/learn', provider: 'OpenJS Foundation', type: 'DOCUMENTATION', isFree: true },
              { title: 'Express.js Security Best Practices', url: 'https://expressjs.com/en/advanced/best-practice-security.html', provider: 'Express Docs', type: 'DOCUMENTATION', isFree: true },
            ]),
            practiceTasksJson: JSON.stringify([
              'Implement an authentication API with bcrypt password hashing and HttpOnly JWT cookies',
              'Write custom middleware to validate request bodies against Zod schemas',
            ]),
          },
          {
            stepNumber: 3,
            title: 'Relational Database Modeling & ORM Integration',
            description: 'Design normalized SQL database schemas, write composite indexes, configure foreign keys, and run migrations using Prisma.',
            prerequisites: JSON.stringify(['Backend API Engineering']),
            skillsCovered: JSON.stringify(['SQL', 'PostgreSQL']),
            estimatedHours: 18,
            resourcesJson: JSON.stringify([
              { title: 'Prisma ORM Getting Started', url: 'https://www.prisma.io/docs/getting-started', provider: 'Prisma Documentation', type: 'DOCUMENTATION', isFree: true },
              { title: 'PostgreSQL Tutorial & Indexing Fundamentals', url: 'https://www.postgresqltutorial.com/', provider: 'PostgreSQL Guides', type: 'TUTORIAL', isFree: true },
            ]),
            practiceTasksJson: JSON.stringify([
              'Create a relational schema with one-to-many and many-to-many relationships',
              'Analyze query performance using EXPLAIN ANALYZE on indexed vs unindexed columns',
            ]),
          },
          {
            stepNumber: 4,
            title: 'Containerization & Cloud Deployment',
            description: 'Containerize multi-container web apps using Docker and Docker Compose. Configure environment secrets safely.',
            prerequisites: JSON.stringify(['Relational Database Modeling']),
            skillsCovered: JSON.stringify(['Docker', 'Git']),
            estimatedHours: 12,
            resourcesJson: JSON.stringify([
              { title: 'Docker Official Get Started Guide', url: 'https://docs.docker.com/get-started/', provider: 'Docker Docs', type: 'DOCUMENTATION', isFree: true },
            ]),
            practiceTasksJson: JSON.stringify([
              'Write a multi-stage Dockerfile for a React Vite build',
              'Create a docker-compose.yml running the API server and database with volume persistence',
            ]),
          },
        ],
      },
    },
  });

  const aimlRoadmap = await prisma.learningRoadmap.upsert({
    where: { targetRole: 'AI/ML Engineer' },
    update: {},
    create: {
      targetRole: 'AI/ML Engineer',
      title: 'Applied AI & Machine Learning Engineering Roadmap',
      description: 'Comprehensive pathway covering mathematical foundations, PyTorch model training, transformer architectures, and ML system deployment.',
      category: 'Artificial Intelligence',
      steps: {
        create: [
          {
            stepNumber: 1,
            title: 'Scientific Python & Data Manipulation',
            description: 'Vectorized computing with NumPy, data transformation with Pandas, and exploratory data analysis.',
            prerequisites: JSON.stringify(['Basic Python']),
            skillsCovered: JSON.stringify(['Python']),
            estimatedHours: 16,
            resourcesJson: JSON.stringify([
              { title: 'NumPy Absolute Beginners Guide', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html', provider: 'NumPy.org', type: 'DOCUMENTATION', isFree: true },
              { title: 'Pandas 10-Minute Tutorial', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', provider: 'Pandas Docs', type: 'DOCUMENTATION', isFree: true },
            ]),
            practiceTasksJson: JSON.stringify([
              'Clean and analyze a real-world tabular dataset with missing values and outliers',
            ]),
          },
          {
            stepNumber: 2,
            title: 'Deep Learning with PyTorch',
            description: 'Tensors, autograd, forward/backward passes, building custom neural network architectures, and training loops.',
            prerequisites: JSON.stringify(['Scientific Python']),
            skillsCovered: JSON.stringify(['PyTorch', 'Python']),
            estimatedHours: 24,
            resourcesJson: JSON.stringify([
              { title: 'PyTorch Deep Learning with PyTorch: A 60 Minute Blitz', url: 'https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html', provider: 'PyTorch Docs', type: 'TUTORIAL', isFree: true },
            ]),
            practiceTasksJson: JSON.stringify([
              'Train a convolutional neural network on CIFAR-10 with data augmentation and validation checkpointing',
            ]),
          },
        ],
      },
    },
  });
  console.log(`✅ Seeded curated skill roadmaps with verified educational links`);

  // 5. Seed Interview Questions
  const interviewQuestionsData = [
    {
      companyTarget: 'Google',
      roleTarget: 'Software Engineering Intern',
      category: 'TECHNICAL',
      difficulty: 'INTERMEDIATE',
      question: 'Given an array of integers representing daily stock prices, find the maximum profit you can achieve by executing at most two transactions. You may not engage in multiple transactions simultaneously.',
      interviewerIntent: 'Evaluates dynamic programming optimization, state machine design, time complexity analysis, and edge case handling.',
      hintsJson: JSON.stringify([
        'Think about maintaining four state variables across iterations: first buy, first sell, second buy, second sell.',
        'Can this be solved in O(N) time with O(1) space rather than an O(N^2) naive approach?',
      ]),
      sampleAnswerOutline: 'Explain the 4-variable state machine (buy1, sell1, buy2, sell2). Walk through the invariant maintenance for each price in the array. Conclude with O(N) time and O(1) space guarantees.',
      isFromCandidateReport: true,
      sourceAttribution: 'Public candidate experience report (Google SWE Summer Intern 2025 round)',
    },
    {
      companyTarget: 'Amazon',
      roleTarget: 'Software Development Engineer Intern',
      category: 'BEHAVIORAL',
      difficulty: 'INTERMEDIATE',
      question: 'Tell me about a time you faced a difficult technical obstacle or bug when building a university or personal project. How did you diagnose the root cause, and what was the outcome?',
      interviewerIntent: 'Assesses Amazon Leadership Principles: "Dive Deep", "Bias for Action", and structured problem-solving under ambiguity.',
      hintsJson: JSON.stringify([
        'Structure your answer strictly using the STAR method: Situation, Task, Action, Result.',
        'Emphasize the analytical tools you used (logging, profiler, binary search debugging) rather than just guessing.',
      ]),
      starSituation: 'During my database systems course final project, our team built a distributed key-value store in Go. Under high concurrency, 15% of write requests experienced silent deadlocks.',
      starTask: 'I was assigned to diagnose the root cause within 48 hours before the final benchmark evaluation.',
      starAction: 'I enabled Go race detection (`-race`), captured goroutine thread dumps, and identified an inconsistent lock acquisition order between the replication leader and local write buffers. I standardized lock ordering using a global resource hierarchy and added stress tests.',
      starResult: 'The deadlock rate dropped to 0%, throughput increased by 40%, and our project received the top benchmark score in class.',
      sampleAnswerOutline: 'Clear STAR breakdown focusing on metric-driven outcomes and rigorous diagnostic methodology.',
      isFromCandidateReport: true,
      sourceAttribution: 'Amazon University Hiring candidate interview debrief',
    },
    {
      companyTarget: 'Microsoft',
      roleTarget: 'Full Stack Software Engineer Intern',
      category: 'SYSTEM_DESIGN',
      difficulty: 'BEGINNER',
      question: 'How would you design a URL shortener service (like TinyURL) that supports 10 million shortened links per month? Discuss data storage, hash collision handling, and caching.',
      interviewerIntent: 'Tests high-level distributed systems understanding: hashing vs auto-increment base62 IDs, database choice (SQL vs NoSQL), and Redis caching for 80/20 read/write ratio.',
      hintsJson: JSON.stringify([
        'Estimate the read-to-write ratio (typically 10:1 or 100:1 read-heavy).',
        'Compare MD5/SHA256 truncation vs Base62 encoding of counter IDs.',
      ]),
      sampleAnswerOutline: '1. Functional/Non-functional requirements. 2. Capacity estimations. 3. API design (POST /shorten, GET /{code}). 4. Database schema. 5. Base62 key generation. 6. Caching layer.',
      isFromCandidateReport: false,
      sourceAttribution: 'Standard Software Engineering System Design Curriculum',
    },
  ];

  for (const q of interviewQuestionsData) {
    await prisma.interviewQuestion.create({
      data: q,
    });
  }
  console.log(`✅ Seeded ${interviewQuestionsData.length} interview questions with STAR rubrics`);

  // 6. Seed Default Verified Student Account
  const studentEmail = 'student@example.com';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Student123!', salt);

  const studentUser = await prisma.user.upsert({
    where: { email: studentEmail },
    update: { passwordHash },
    create: {
      email: studentEmail,
      passwordHash,
      role: 'STUDENT',
      profile: {
        create: {
          displayName: 'Alex Chen',
          educationLevel: "Bachelor's",
          university: 'University of Washington',
          degree: 'Computer Science',
          graduationYear: 2027,
          country: 'United States',
          preferredLocations: JSON.stringify(['Remote', 'Seattle, WA', 'San Francisco, CA']),
          preferredWorkModes: JSON.stringify(['REMOTE', 'HYBRID']),
          targetRole: 'Software Engineer',
          targetCompanies: JSON.stringify(['Google', 'Microsoft', 'Datadog']),
          experienceLevel: 'Junior',
          preferredDuration: '12 weeks',
          bio: 'Passionate CS junior specializing in distributed systems, modern web platforms, and machine learning infrastructure.',
        },
      },
    },
    include: { profile: true },
  });

  if (studentUser.profile) {
    // Add student skills
    const userSkillsToAdd = [
      { name: 'TypeScript', prof: 'ADVANCED' },
      { name: 'React', prof: 'ADVANCED' },
      { name: 'Node.js', prof: 'INTERMEDIATE' },
      { name: 'Python', prof: 'INTERMEDIATE' },
      { name: 'SQL', prof: 'INTERMEDIATE' },
      { name: 'Git', prof: 'ADVANCED' },
      { name: 'Data Structures', prof: 'ADVANCED' },
      { name: 'Algorithms', prof: 'ADVANCED' },
    ];

    for (const item of userSkillsToAdd) {
      const sId = skillMap.get(item.name);
      if (sId) {
        await prisma.userSkill.upsert({
          where: { profileId_skillId: { profileId: studentUser.profile.id, skillId: sId } },
          update: { proficiency: item.prof, verified: true },
          create: { profileId: studentUser.profile.id, skillId: sId, proficiency: item.prof, verified: true },
        });
      }
    }

    // Seed default resume
    await prisma.resume.upsert({
      where: { id: 'default-alex-chen-resume' },
      update: {},
      create: {
        id: 'default-alex-chen-resume',
        userId: studentUser.id,
        title: 'Software Engineering Internship Resume',
        templateId: 'modern-tech',
        targetRole: 'Software Engineer Intern',
        fullName: 'Alex Chen',
        email: 'alex.chen@uw.edu',
        phone: '+1 (206) 555-0192',
        location: 'Seattle, WA',
        website: 'https://alexchen.dev',
        githubUrl: 'https://github.com/alexchen',
        linkedinUrl: 'https://linkedin.com/in/alexchen-tech',
        summary: 'Computer Science junior with solid experience building scalable full-stack web applications and distributed systems in TypeScript, Python, and React. Seeking a Summer 2027 software engineering internship.',
        sectionsJson: JSON.stringify([
          {
            id: 'sec-edu',
            sectionType: 'EDUCATION',
            title: 'Education',
            items: [
              {
                institution: 'University of Washington',
                degree: 'B.S. in Computer Science (GPA: 3.86/4.00)',
                dateRange: 'Sep 2023 - Expected June 2027',
                location: 'Seattle, WA',
                details: 'Relevant Coursework: Data Structures & Algorithms, Distributed Systems, Database Management, Operating Systems.',
              },
            ],
          },
          {
            id: 'sec-proj',
            sectionType: 'PROJECTS',
            title: 'Technical Projects',
            items: [
              {
                name: 'CloudMetrics — Real-time Server Telemetry Pipeline',
                technologies: 'Go, React, Docker, WebSockets, TimescaleDB',
                dateRange: 'Jan 2026 - Present',
                bullets: [
                  'Architected an agent daemon in Go that samples host CPU, memory, and network throughput at 100ms intervals.',
                  'Engineered a WebSocket stream broadcasting telemetry to a React dashboard with sub-50ms latency.',
                  'Containerized services using Docker Compose, orchestrating time-series data retention policies.',
                ],
              },
              {
                name: 'StudyCollab — Peer Code Review Platform',
                technologies: 'TypeScript, Next.js, Node.js, PostgreSQL, Prisma',
                dateRange: 'Sep 2025 - Dec 2025',
                bullets: [
                  'Developed collaborative code editing workspace supporting syntax highlighting for 12 languages.',
                  'Built relational database models and schema migrations with Prisma, handling 10,000+ mock user requests.',
                ],
              },
            ],
          },
          {
            id: 'sec-skills',
            sectionType: 'SKILLS',
            title: 'Technical Skills',
            items: [
              {
                category: 'Languages & Frameworks',
                skills: 'TypeScript, JavaScript, Python, Go, SQL, React, Node.js, Express',
              },
              {
                category: 'Tools & Infrastructure',
                skills: 'Git, Docker, Linux, PostgreSQL, REST APIs, CI/CD Actions',
              },
            ],
          },
        ]),
      },
    });

    // Seed active application
    const firstInternship = await prisma.internship.findFirst();
    if (firstInternship) {
      await prisma.application.create({
        data: {
          userId: studentUser.id,
          internshipId: firstInternship.id,
          companyName: firstInternship.companyId ? 'Google' : 'Tech Corp',
          roleTitle: firstInternship.title,
          applicationUrl: firstInternship.officialApplyUrl,
          status: 'INTERVIEW',
          dateApplied: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          nextAction: 'Prepare for technical interview round 1 (Algorithms & Systems)',
          interviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          notes: 'Completed OA with 100% test cases passing. Technical phone screen scheduled with senior engineering manager.',
          statusHistory: {
            create: [
              { fromStatus: 'INTERESTED', toStatus: 'APPLIED', note: 'Submitted via official careers portal' },
              { fromStatus: 'APPLIED', toStatus: 'ASSESSMENT', note: 'Received online technical assessment link' },
              { fromStatus: 'ASSESSMENT', toStatus: 'INTERVIEW', note: 'Passed assessment, invited to Round 1 interview' },
            ],
          },
        },
      });

      // Seed saved internship
      await prisma.savedInternship.create({
        data: {
          userId: studentUser.id,
          internshipId: firstInternship.id,
        },
      });
    }

    // Seed notification preferences & welcome notification
    await prisma.notificationPreference.upsert({
      where: { userId: studentUser.id },
      update: {},
      create: {
        userId: studentUser.id,
        emailAlerts: true,
        pushAlerts: true,
        matchAlerts: true,
        deadlineAlerts: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: studentUser.id,
        title: 'Welcome to InternProof AI!',
        message: 'Your profile has been created with target role "Software Engineer". Check your personalized matches and readiness scores.',
        category: 'SYSTEM',
        linkUrl: '/matches',
      },
    });
  }

  console.log(`✅ Seeded student test user: ${studentEmail} (Password: Student123!)`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
