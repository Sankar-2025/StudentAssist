import { describe, it, expect } from 'vitest';
import {
  calculateInternshipMatch,
  EligibilityStatus,
  WorkMode,
  VerificationStatus,
  StudentProfileDTO,
  InternshipDTO,
} from '../../packages/shared/src';

describe('Internship Readiness Matcher & Eligibility Engine', () => {
  const mockProfile: StudentProfileDTO = {
    id: 'student-1',
    userId: 'user-1',
    displayName: 'Alex Chen',
    educationLevel: "Bachelor's",
    degree: 'Computer Science',
    graduationYear: 2027,
    preferredLocations: ['Remote', 'Seattle, WA'],
    preferredWorkModes: [WorkMode.REMOTE, WorkMode.HYBRID],
    targetRole: 'Software Engineer',
    targetCompanies: ['Google', 'Microsoft'],
    experienceLevel: 'Junior',
    skills: [
      { name: 'TypeScript', proficiency: 'ADVANCED', verified: true },
      { name: 'React', proficiency: 'ADVANCED', verified: true },
      { name: 'Node.js', proficiency: 'INTERMEDIATE', verified: true },
      { name: 'SQL', proficiency: 'INTERMEDIATE', verified: true },
      { name: 'Data Structures', proficiency: 'ADVANCED', verified: true },
    ],
  };

  const mockInternship: InternshipDTO = {
    id: 'intern-1',
    companyName: 'Microsoft',
    title: 'Full Stack Software Engineer Intern',
    category: 'Software Engineering',
    location: 'Redmond, WA / Remote',
    workMode: WorkMode.HYBRID,
    isPaid: true,
    description: 'Build web applications using TypeScript and React.',
    requirements: ['Pursuing BS in Computer Science', 'Graduation 2026-2027'],
    requiredSkills: ['TypeScript', 'React', 'Node.js', 'SQL'],
    preferredSkills: ['Docker', 'AWS'],
    minGraduationYear: 2026,
    maxGraduationYear: 2027,
    allowedDegrees: ['Computer Science', 'Electrical Engineering'],
    officialApplyUrl: 'https://careers.microsoft.com',
    verificationStatus: VerificationStatus.VERIFIED_OFFICIAL,
    evidence: {
      sourceUrl: 'https://careers.microsoft.com',
      sourceType: 'Official Portal',
      lastCheckedDate: '2026-10-12T00:00:00Z',
      deadlineVerified: true,
      verificationStatus: VerificationStatus.VERIFIED_OFFICIAL,
    },
    isDemoData: false,
    postedAt: '2026-10-10T00:00:00Z',
    createdAt: '2026-10-10T00:00:00Z',
    updatedAt: '2026-10-10T00:00:00Z',
  };

  it('calculates a high match score for well-aligned candidates', () => {
    const result = calculateInternshipMatch(mockProfile, mockInternship);

    expect(result.totalScore).toBeGreaterThanOrEqual(80);
    expect(result.skillsScore).toBeGreaterThanOrEqual(70);
    expect(result.educationScore).toBe(100);
    expect(result.careerScore).toBe(100);
    expect(result.locationScore).toBe(100);
    expect(result.eligibilityStatus).toBe(EligibilityStatus.ELIGIBLE);
    expect(result.demonstratedSkills).toContain('typescript');
    expect(result.demonstratedSkills).toContain('react');
    expect(result.missingSkills).toContain('docker');
    expect(result.missingSkills).toContain('aws');
  });

  it('marks candidate as INELIGIBLE when graduation year is outside required range', () => {
    const ineligibleProfile: StudentProfileDTO = {
      ...mockProfile,
      graduationYear: 2030, // Way outside [2026, 2027]
    };

    const result = calculateInternshipMatch(ineligibleProfile, mockInternship);

    expect(result.eligibilityStatus).toBe(EligibilityStatus.INELIGIBLE);
    expect(result.educationScore).toBeLessThan(100);
    expect(result.eligibilityReasons.some((r) => r.includes('does not match required range'))).toBe(true);
  });

  it('marks status as NEEDS_CONFIRMATION when graduation year is unverified', () => {
    const unverifiedProfile: StudentProfileDTO = {
      ...mockProfile,
      graduationYear: undefined,
    };

    const result = calculateInternshipMatch(unverifiedProfile, mockInternship);

    expect(result.eligibilityStatus).toBe(EligibilityStatus.NEEDS_CONFIRMATION);
    expect(result.eligibilityReasons.some((r) => r.includes('unverified'))).toBe(true);
  });

  it('accurately identifies missing skills and estimates preparation time', () => {
    const noviceProfile: StudentProfileDTO = {
      ...mockProfile,
      skills: [], // No skills
    };

    const result = calculateInternshipMatch(noviceProfile, mockInternship);

    expect(result.skillsScore).toBe(0);
    expect(result.missingSkills.length).toBeGreaterThanOrEqual(4);
    expect(result.recommendedLearningOrder).toEqual(result.missingSkills);
    expect(result.estimatedPrepWeeks).toBeGreaterThanOrEqual(4);
  });
});
