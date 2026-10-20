// ==============================================================================
// StudentAssist — Explainable Match Score & Skill Gap Analysis Engine
// ==============================================================================

import {
  DEFAULT_MATCH_WEIGHTS,
  EligibilityStatus,
  InternshipDTO,
  MatchAssessmentResult,
  MatchScoreWeights,
  StudentProfileDTO,
  WorkMode,
} from './index';

export function calculateInternshipMatch(
  profile: StudentProfileDTO,
  internship: InternshipDTO,
  weights: MatchScoreWeights = DEFAULT_MATCH_WEIGHTS
): MatchAssessmentResult {
  const profileSkillsMap = new Map<string, string>();
  for (const s of profile.skills || []) {
    profileSkillsMap.set(s.name.trim().toLowerCase(), s.proficiency);
  }

  const required = (internship.requiredSkills || []).map((s) => s.trim().toLowerCase());
  const preferred = (internship.preferredSkills || []).map((s) => s.trim().toLowerCase());
  const allNeededSkills = Array.from(new Set([...required, ...preferred]));

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const demonstratedSkills: string[] = [];

  let skillPointsEarned = 0;
  let totalSkillPointsPossible = (required.length * 2) + preferred.length;
  if (totalSkillPointsPossible === 0) totalSkillPointsPossible = 1;

  for (const req of required) {
    if (profileSkillsMap.has(req)) {
      matchedSkills.push(req);
      demonstratedSkills.push(req);
      const prof = profileSkillsMap.get(req);
      if (prof === 'EXPERT' || prof === 'ADVANCED') skillPointsEarned += 2;
      else if (prof === 'INTERMEDIATE') skillPointsEarned += 1.6;
      else skillPointsEarned += 1.2;
    } else {
      missingSkills.push(req);
    }
  }

  for (const pref of preferred) {
    if (profileSkillsMap.has(pref)) {
      matchedSkills.push(pref);
      if (!demonstratedSkills.includes(pref)) demonstratedSkills.push(pref);
      skillPointsEarned += 1;
    } else {
      if (!missingSkills.includes(pref)) missingSkills.push(pref);
    }
  }

  const rawSkillsScore = Math.min(100, Math.round((skillPointsEarned / totalSkillPointsPossible) * 100));

  // 2. Education & Eligibility Alignment (0 - 100)
  let educationScore = 100;
  const eligibilityReasons: string[] = [];
  let eligibilityStatus: EligibilityStatus = EligibilityStatus.ELIGIBLE;

  if (internship.minGraduationYear && internship.maxGraduationYear && profile.graduationYear) {
    if (
      profile.graduationYear >= internship.minGraduationYear &&
      profile.graduationYear <= internship.maxGraduationYear
    ) {
      eligibilityReasons.push(`Graduation year (${profile.graduationYear}) satisfies range [${internship.minGraduationYear}-${internship.maxGraduationYear}].`);
    } else {
      educationScore -= 50;
      eligibilityStatus = EligibilityStatus.INELIGIBLE;
      eligibilityReasons.push(`Graduation year (${profile.graduationYear}) does not match required range [${internship.minGraduationYear}-${internship.maxGraduationYear}].`);
    }
  } else if (!profile.graduationYear && (internship.minGraduationYear || internship.maxGraduationYear)) {
    educationScore -= 20;
    eligibilityStatus = EligibilityStatus.NEEDS_CONFIRMATION;
    eligibilityReasons.push('Graduation year is unverified in your profile.');
  }

  if (internship.allowedDegrees && internship.allowedDegrees.length > 0 && profile.degree) {
    const studentDegreeLower = profile.degree.toLowerCase();
    const degreeMatches = internship.allowedDegrees.some((d) =>
      studentDegreeLower.includes(d.toLowerCase()) || d.toLowerCase().includes(studentDegreeLower)
    );
    if (degreeMatches) {
      eligibilityReasons.push(`Academic degree (${profile.degree}) aligns with accepted fields.`);
    } else {
      educationScore -= 35;
      if (eligibilityStatus !== EligibilityStatus.INELIGIBLE) {
        eligibilityStatus = EligibilityStatus.POTENTIALLY_ELIGIBLE;
      }
      eligibilityReasons.push(`Degree (${profile.degree}) differs from strictly listed degree fields.`);
    }
  }

  educationScore = Math.max(0, Math.min(100, educationScore));

  // 3. Career-interest alignment (0 - 100)
  let careerScore = 50;
  const targetRole = (profile.targetRole || '').toLowerCase();
  const title = internship.title.toLowerCase();
  const category = internship.category.toLowerCase();

  if (targetRole) {
    if (title.includes(targetRole) || targetRole.includes(title)) {
      careerScore = 100;
    } else if (category.includes(targetRole) || targetRole.includes(category)) {
      careerScore = 85;
    } else {
      const roleTokens = targetRole.split(/\s+/).filter(Boolean);
      const matchedTokens = roleTokens.filter((token) => title.includes(token) || category.includes(token));
      careerScore = Math.round((matchedTokens.length / Math.max(1, roleTokens.length)) * 75);
    }
  }
  if (profile.targetCompanies && profile.targetCompanies.length > 0) {
    const isTargetCompany = profile.targetCompanies.some((c) =>
      internship.companyName.toLowerCase().includes(c.toLowerCase())
    );
    if (isTargetCompany) careerScore = Math.min(100, careerScore + 15);
  }
  careerScore = Math.max(0, Math.min(100, careerScore));

  // 4. Location and work-mode preferences (0 - 100)
  let locationScore = 60;
  if (profile.preferredWorkModes && profile.preferredWorkModes.length > 0) {
    if (profile.preferredWorkModes.includes(internship.workMode)) {
      locationScore = 100;
    } else if (internship.workMode === WorkMode.REMOTE) {
      locationScore = 90;
    } else {
      locationScore = 40;
    }
  }
  if (profile.preferredLocations && profile.preferredLocations.length > 0 && internship.location) {
    const locMatches = profile.preferredLocations.some((loc) =>
      internship.location.toLowerCase().includes(loc.toLowerCase()) || loc.toLowerCase().includes(internship.location.toLowerCase())
    );
    if (locMatches) locationScore = Math.min(100, locationScore + 10);
  }
  locationScore = Math.max(0, Math.min(100, locationScore));

  // 5. Experience alignment (0 - 100)
  let experienceScore = 75;
  if (profile.experienceLevel) {
    const exp = profile.experienceLevel.toLowerCase();
    if (exp.includes('junior') || exp.includes('senior') || exp.includes('master')) {
      experienceScore = 90;
    } else if (exp.includes('sophomore')) {
      experienceScore = 75;
    } else {
      experienceScore = 60;
    }
  }

  // Calculate Weighted Total
  const totalScore = Math.round(
    rawSkillsScore * weights.skills +
    educationScore * weights.education +
    careerScore * weights.career +
    locationScore * weights.location +
    experienceScore * weights.experience
  );

  // Recommended learning order (prioritize missing required skills first)
  const recommendedLearningOrder = [...missingSkills];

  // Estimated preparation time: 1-2 weeks per missing required skill
  const missingRequiredCount = required.filter((r) => !profileSkillsMap.has(r)).length;
  const estimatedPrepWeeks = Math.max(1, missingRequiredCount * 2);

  return {
    totalScore,
    skillsScore: rawSkillsScore,
    educationScore,
    careerScore,
    locationScore,
    experienceScore,
    matchedSkills,
    missingSkills,
    demonstratedSkills,
    recommendedLearningOrder,
    eligibilityStatus,
    eligibilityReasons,
    estimatedPrepWeeks,
    calculatedAt: new Date().toISOString(),
  };
}
