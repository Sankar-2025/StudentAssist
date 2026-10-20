// ==============================================================================
// StudentAssist — Shared Domain Types, Constants, and Match Engine Contracts
// ==============================================================================

export enum VerificationStatus {
  VERIFIED_OFFICIAL = 'VERIFIED_OFFICIAL',
  PARTNER_FEED = 'PARTNER_FEED',
  COMMUNITY_REPORTED = 'COMMUNITY_REPORTED',
  UNVERIFIED = 'UNVERIFIED',
}

export enum EligibilityStatus {
  ELIGIBLE = 'ELIGIBLE',
  POTENTIALLY_ELIGIBLE = 'POTENTIALLY_ELIGIBLE',
  NEEDS_CONFIRMATION = 'NEEDS_CONFIRMATION',
  INELIGIBLE = 'INELIGIBLE',
}

export enum WorkMode {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  ONSITE = 'ONSITE',
}

export enum ApplicationStatus {
  INTERESTED = 'INTERESTED',
  PREPARING = 'PREPARING',
  READY_TO_APPLY = 'READY_TO_APPLY',
  APPLIED = 'APPLIED',
  ASSESSMENT = 'ASSESSMENT',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum QuestionCategory {
  TECHNICAL = 'TECHNICAL',
  BEHAVIORAL = 'BEHAVIORAL',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
  HR = 'HR',
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface MatchScoreWeights {
  skills: number;
  education: number;
  career: number;
  location: number;
  experience: number;
}

export const DEFAULT_MATCH_WEIGHTS: MatchScoreWeights = {
  skills: 0.40,
  education: 0.25,
  career: 0.20,
  location: 0.10,
  experience: 0.05,
};

export interface MatchAssessmentResult {
  totalScore: number; // 0 - 100
  skillsScore: number;
  educationScore: number;
  careerScore: number;
  locationScore: number;
  experienceScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  demonstratedSkills: string[];
  recommendedLearningOrder: string[];
  eligibilityStatus: EligibilityStatus;
  eligibilityReasons: string[];
  estimatedPrepWeeks: number;
  calculatedAt: string;
}

export interface StudentProfileDTO {
  id: string;
  userId: string;
  displayName: string;
  educationLevel: string; // e.g. "Bachelor's", "Master's"
  university?: string;
  degree?: string; // e.g. "Computer Science"
  graduationYear?: number;
  country?: string;
  preferredLocations: string[];
  preferredWorkModes: WorkMode[];
  targetRole: string; // e.g. "Software Engineer", "AI/ML Engineer"
  targetCompanies: string[];
  experienceLevel: string; // "Freshman", "Sophomore", "Junior", "Senior", "Master's / Graduate"
  preferredDuration?: string; // e.g. "10-12 weeks", "Summer 2026"
  bio?: string;
  skills: Array<{
    name: string;
    proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    verified: boolean;
  }>;
}

export interface OpportunityEvidence {
  sourceUrl: string;
  sourceType: string;
  lastCheckedDate: string;
  deadline?: string;
  deadlineVerified: boolean;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  compensationDetails?: string;
}

export interface InternshipDTO {
  id: string;
  companyName: string;
  companyLogoUrl?: string;
  companyWebsite?: string;
  title: string;
  category: string;
  location: string;
  workMode: WorkMode;
  duration?: string;
  stipend?: string;
  isPaid: boolean;
  description: string;
  requirements: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  minGraduationYear?: number;
  maxGraduationYear?: number;
  allowedDegrees: string[];
  officialApplyUrl: string;
  deadline?: string;
  verificationStatus: VerificationStatus;
  evidence: OpportunityEvidence;
  isDemoData: boolean;
  postedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapStepDTO {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  prerequisites: string[];
  skillsCovered: string[];
  estimatedHours: number;
  isCompleted: boolean;
  resources: Array<{
    title: string;
    url: string;
    provider: string;
    type: 'DOCUMENTATION' | 'COURSE' | 'TUTORIAL' | 'BOOK';
    isFree: boolean;
  }>;
  practiceTasks: string[];
}

export interface InterviewQuestionDTO {
  id: string;
  companyTarget?: string;
  roleTarget?: string;
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  question: string;
  interviewerIntent: string;
  hints: string[];
  starGuide?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  sampleAnswerOutline: string;
  isFromCandidateReport: boolean;
  sourceAttribution?: string;
}

export interface ResumeSectionDTO {
  id: string;
  sectionType: 'SUMMARY' | 'EDUCATION' | 'EXPERIENCE' | 'PROJECTS' | 'SKILLS' | 'CERTIFICATIONS' | 'ACHIEVEMENTS' | 'LINKS';
  title: string;
  items: any[];
}

export interface ResumeDTO {
  id: string;
  userId: string;
  title: string;
  templateId: 'modern-tech' | 'executive-clean' | 'minimalist-academic';
  targetRole?: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  summary: string;
  sections: ResumeSectionDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDTO {
  id: string;
  userId: string;
  internshipId?: string;
  internship?: InternshipDTO;
  companyName: string;
  roleTitle: string;
  applicationUrl?: string;
  status: ApplicationStatus;
  dateApplied?: string;
  deadline?: string;
  nextAction?: string;
  reminderDate?: string;
  interviewDate?: string;
  notes?: string;
  statusHistory: Array<{
    id: string;
    fromStatus?: ApplicationStatus;
    toStatus: ApplicationStatus;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationDTO {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'MATCH' | 'DEADLINE' | 'ROADMAP' | 'SYSTEM';
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export * from './matcher';
