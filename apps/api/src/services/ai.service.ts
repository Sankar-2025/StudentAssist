import { config } from '../config';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  provider: 'gemini' | 'openai' | 'offline_rule_based_advisor';
  isFallback: boolean;
  setupInstructions?: string;
}

export interface InterviewFeedback {
  score: number; // 0 - 100
  structureScore: number;
  technicalScore: number;
  clarityScore: number;
  strengths: string[];
  areasForImprovement: string[];
  suggestedAnswerStructure: string;
  isFallback: boolean;
}

export class AIService {
  
  public static async extractInternshipSkills(params: {
    title: string;
    description: string;
    requirements?: string[];
  }): Promise<{ skills: string[] }> {
    const systemPrompt = `You extract skills explicitly relevant to internship requirements.
Return only valid JSON in this exact format:
{"skills":["Python","SQL"]}
Include technical skills and clearly stated professional skills.
Do not invent skills that are not supported by the supplied text.
Use concise, commonly recognized skill names.
If no skills are supported, return {"skills":[]}.`;

    const userPrompt = `Internship title: ${params.title}

Description:
${params.description}

Requirements:
${(params.requirements || []).join(', ')}

Extract the skills supported by this information.`;

    let content: string;

    if (config.geminiApiKey) {
      try {
        content = await this.callGemini(systemPrompt, userPrompt);
      } catch (error) {
        console.warn('Gemini skill extraction failed:', error);
        if (!config.openaiApiKey) throw error;
        content = await this.callOpenAI(systemPrompt, userPrompt);
      }
    } else if (config.openaiApiKey) {
      content = await this.callOpenAI(systemPrompt, userPrompt);
    } else {
      throw new Error(
        'Skill extraction requires GEMINI_API_KEY or OPENAI_API_KEY.'
      );
    }

    const json = content.replace(/```json|```/gi, '').trim();
    const parsed = JSON.parse(json);

    if (
      !parsed ||
      !Array.isArray(parsed.skills) ||
      !parsed.skills.every(
        (skill: unknown) =>
          typeof skill === 'string' && skill.trim().length > 0
      )
    ) {
      throw new Error('AI returned an invalid skill list.');
    }
return {
  skills: Array.from(
    new Set<string>(
      (parsed.skills as string[]).map((skill) => skill.trim())
    )
  ),
};
  }

  private static async callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
    const url ='https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Query:\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1200,
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
  'Content-Type': 'application/json',
  'x-goog-api-key': config.geminiApiKey,
},
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) throw new Error('No text candidate returned by Gemini API');
    return candidate;
  }

  private static async callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
    const url = 'https://api.openai.com/v1/chat/completions';
    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1200,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.openaiApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const message = data.choices?.[0]?.message?.content;
    if (!message) throw new Error('No message returned by OpenAI API');
    return message;
  }

  public static async askCareerMentor(params: {
    studentProfile?: any;
    currentInternshipTitle?: string;
    prompt: string;
    history?: AIMessage[];
  }): Promise<AIResponse> {
    const { studentProfile, currentInternshipTitle, prompt } = params;

    const studentContext = studentProfile
      ? `Student Profile Context:
- Target Role: ${studentProfile.targetRole || 'Software Engineer'}
- Degree: ${studentProfile.degree || 'Computer Science'} (${studentProfile.educationLevel || 'Undergraduate'})
- Graduation Year: ${studentProfile.graduationYear || '2027'}
- Top Demonstrated Skills: ${(studentProfile.userSkills || []).map((s: any) => s.skill?.name || s.name).join(', ') || 'General tech skills'}
- Target Companies: ${studentProfile.targetCompanies || 'Tech companies'}`
      : 'No student profile context available.';

    const systemPrompt = `You are the InternProof AI Career Mentor. You assist college students and aspiring software/AI engineers in planning their careers, closing skill gaps, preparing for technical interviews, and applying for top internships.
Guidelines:
1. Always be realistic, encouraging, and actionable.
2. Provide step-by-step guidance, sample bullet points, or frameworks.
3. Never fabricate company policies, non-public deadlines, or guarantee interview selection.
4. If uncertain, clearly advise the student to check official company career portals.

${studentContext}
${currentInternshipTitle ? `Active Internship Context: ${currentInternshipTitle}` : ''}`;

    // 1. Try Gemini
    if (config.geminiApiKey) {
      try {
        const text = await this.callGemini(systemPrompt, prompt);
        return { content: text, provider: 'gemini', isFallback: false };
      } catch (err) {
        console.warn('Gemini API call failed, attempting fallback:', err);
      }
    }

    // 2. Try OpenAI
    if (config.openaiApiKey) {
      try {
        const text = await this.callOpenAI(systemPrompt, prompt);
        return { content: text, provider: 'openai', isFallback: false };
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to rule-based advisor:', err);
      }
    }

    // 3. Transparent Offline Career Advisor Mode
    const offlineAdvice = this.generateOfflineAdvisorResponse(prompt, studentProfile, currentInternshipTitle);
    return {
      content: offlineAdvice,
      provider: 'offline_rule_based_advisor',
      isFallback: true,
      setupInstructions:
        'To enable live generative LLM responses, set GEMINI_API_KEY or OPENAI_API_KEY in your server .env file.',
    };
  }

  public static async evaluateInterviewAnswer(params: {
    question: string;
    category: string;
    studentAnswer: string;
    interviewerIntent: string;
    starGuide?: any;
  }): Promise<InterviewFeedback> {
    const { question, category, studentAnswer, interviewerIntent } = params;

    // Check answer length and content
    const words = studentAnswer.trim().split(/\s+/).filter(Boolean).length;

    let structureScore = 70;
    let technicalScore = 70;
    let clarityScore = 75;
    const strengths: string[] = [];
    const areasForImprovement: string[] = [];

    if (words < 25) {
      structureScore = 40;
      technicalScore = 45;
      clarityScore = 55;
      areasForImprovement.push('Answer is very brief. Expand with concrete technical decisions and context.');
    } else if (words > 80) {
      structureScore += 15;
      clarityScore += 10;
      strengths.push('Provided substantial detail and thorough context.');
    }

    // Behavioral STAR checking
    if (category === 'BEHAVIORAL') {
      const lower = studentAnswer.toLowerCase();
      const hasAction = lower.includes('i ') || lower.includes('decided') || lower.includes('built') || lower.includes('implemented');
      const hasResult = lower.includes('result') || lower.includes('increased') || lower.includes('reduced') || lower.includes('learned') || lower.includes('%');

      if (hasAction && hasResult) {
        structureScore = Math.min(95, structureScore + 15);
        strengths.push('Strong adherence to the Action and Result components of the STAR framework.');
      } else {
        areasForImprovement.push('Strengthen the "Result" component: quantify the outcome or impact with metrics or key learnings.');
      }
    } else {
      // Technical checking
      const lower = studentAnswer.toLowerCase();
      if (lower.includes('complexity') || lower.includes('o(') || lower.includes('time') || lower.includes('space') || lower.includes('trade-off')) {
        technicalScore = Math.min(95, technicalScore + 20);
        strengths.push('Explicitly analyzed computational complexity and design trade-offs.');
      } else {
        areasForImprovement.push('Always mention Time and Space complexity (Big-O) when describing algorithmic approaches.');
      }
    }

    const overallScore = Math.round((structureScore * 0.35) + (technicalScore * 0.45) + (clarityScore * 0.20));

    return {
      score: overallScore,
      structureScore,
      technicalScore,
      clarityScore,
      strengths: strengths.length ? strengths : ['Clear communication tone and direct response to the prompt.'],
      areasForImprovement: areasForImprovement.length ? areasForImprovement : ['Add more specific architectural trade-offs.'],
      suggestedAnswerStructure:
        category === 'BEHAVIORAL'
          ? '1. Situation: Set context (1-2 sentences). 2. Task: What had to be solved. 3. Action: Specific technical steps YOU spearheaded. 4. Result: Quantitative impact and lessons learned.'
          : '1. Clarify constraints & edge cases. 2. State baseline approach. 3. Detail optimal approach with invariants. 4. State Big-O time and space complexity.',
      isFallback: !config.geminiApiKey && !config.openaiApiKey,
    };
  }

  private static generateOfflineAdvisorResponse(
    prompt: string,
    profile?: any,
    internshipTitle?: string
  ): string {
    const p = prompt.toLowerCase();
    const greeting = /^(hi|hello|hey|hiya|good morning|good afternoon|good evening)[!. ,]*$/i;

if (greeting.test(prompt.trim())) {
  return "Hi! 👋 I'm your InternProof AI Career Mentor. I can help you build a career roadmap, improve your resume, prepare for interviews, or find suitable internships. What would you like to work on today?";
}
    const role = profile?.targetRole || 'Software Engineer';

    if (p.includes('resume') || p.includes('cv') || p.includes('ats')) {
      return `### 📄 Resume Studio Advisor Guidance

To optimize your resume for **${role}** internships:
1. **Adopt the XYZ Achievement Formula:** "Accomplished [X] as measured by [Y] by doing [Z]." For example: *"Reduced API response latency by 35% by implementing Redis caching and database indexing."*
2. **Prioritize Relevant Projects:** Put your strongest full-stack or systems projects near the top. Include direct links to GitHub repositories and live deployments.
3. **Targeted Tech Stack:** Group skills into *Languages*, *Frameworks*, *Developer Tools*, and *Databases*. Avoid rating bars (e.g., "5/5 stars"); list proficiencies clearly.
4. **ATS Compatibility:** Stick to clean single-column layouts (available in our Resume Studio). Ensure terms match the target job description.`;
    }

    if (p.includes('interview') || p.includes('prep') || p.includes('question')) {
      return `### 🎯 Technical & Behavioral Interview Strategy for ${role}

Here is a recommended 4-pillar preparation plan:
1. **Algorithmic Foundations:** Focus on Two Pointers, Sliding Window, Trees/Graphs (BFS/DFS), and Heap/Priority Queues. Aim for clean problem breakdown over rote memorization.
2. **Communication (Think Out Loud):** Clarify constraints before typing code. Walk the interviewer through your brute force approach, then explain the optimization.
3. **STAR Behavioral Method:** Prepare 4 modular stories:
   - A challenging technical bug you diagnosed.
   - A disagreement with a teammate and how you resolved it.
   - A project where you had to learn a framework quickly.
   - A deadline crunch and how you prioritized.
4. **System & Architecture:** For internships, master high-level concepts like REST vs GraphQL, SQL vs NoSQL, indexes, caching, and rate limiting.`;
    }

    if (p.includes('skill') || p.includes('roadmap') || p.includes('gap')) {
      return `### 🗺️ Skill Roadmap Recommendations for ${role}

Based on top hiring patterns for 2026/2027 internships:
1. **Core Language Mastery:** Focus deeply on TypeScript or Python. Understand memory model, asynchronous concurrency, and typing.
2. **Microservices & API Security:** Build projects with authentication (JWT/cookies), input validation (Zod), and structured databases (PostgreSQL/Prisma).
3. **Containerization:** Learn Docker basics. Being able to write a ` + '`Dockerfile`' + ` and ` + '`docker-compose.yml`' + ` immediately distinguishes you from 90% of applicants.
4. **Follow our Roadmaps Tab:** Visit the Skill Roadmaps section in the dashboard to track step-by-step milestones with official docs.`;
    }

    return `### 💡 Career Mentor Insights for ${role} Candidates

Thank you for your question: *"${prompt}"*

Key advice for positioning yourself for top tech internships:
- **Build Depth Over Breadth:** One comprehensive, deployed full-stack or systems project with automated tests and CI/CD will impress recruiters far more than three unfinished tutorials.
- **Understand Opportunity Verification:** Review the Opportunity Evidence Panel in the **Discover Internships** section to see verified application portals, deadlines, and requirements.
- **Track Your Applications:** Move your opportunities from *Interested* through *Applied* and *Interview* in the **Application Tracker** to stay organized.

*Note: Running in Offline Career Advisor Mode. To connect real-time generative AI, add GEMINI_API_KEY or OPENAI_API_KEY to your .env file.*`;
  }
}
