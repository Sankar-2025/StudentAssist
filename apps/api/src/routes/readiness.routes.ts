import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireAuth } from '../middlewares/auth';
import { calculateInternshipMatch } from '@internproof/shared';
import { formatInternship } from './internships.routes';

const router = Router();

// Helper to construct StudentProfileDTO from database UserProfile
async function getProfileDTO(userId: string) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    include: {
      userSkills: {
        include: { skill: true },
      },
    },
  });

  if (!profile) return null;

  return {
    id: profile.id,
    userId: profile.userId,
    displayName: profile.displayName,
    educationLevel: profile.educationLevel,
    university: profile.university || undefined,
    degree: profile.degree || undefined,
    graduationYear: profile.graduationYear || undefined,
    country: profile.country || undefined,
    preferredLocations: JSON.parse(profile.preferredLocations || '[]'),
    preferredWorkModes: JSON.parse(profile.preferredWorkModes || '[]'),
    targetRole: profile.targetRole,
    targetCompanies: JSON.parse(profile.targetCompanies || '[]'),
    experienceLevel: profile.experienceLevel,
    preferredDuration: profile.preferredDuration || undefined,
    bio: profile.bio || undefined,
    skills: profile.userSkills.map((us) => ({
      name: us.skill.name,
      proficiency: us.proficiency as any,
      verified: us.verified,
    })),
  };
}

// GET /api/readiness/matches — Personalized Matches
router.get('/matches', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const profileDTO = await getProfileDTO(req.user!.userId);
    if (!profileDTO) {
      return res.status(404).json({ success: false, error: 'Student profile not found. Please complete your profile.' });
    }

    const internships = await prisma.internship.findMany({
      include: {
        company: true,
        skills: {
          include: { skill: true },
        },
      },
    });

    const saved = await prisma.savedInternship.findMany({
      where: { userId: req.user!.userId },
      select: { internshipId: true },
    });
    const savedIds = new Set(saved.map((s) => s.internshipId));

    const matches = internships.map((item) => {
      const formatted = formatInternship(item);
      const assessment = calculateInternshipMatch(profileDTO, formatted as any);

      return {
        internship: {
          ...formatted,
          isSaved: savedIds.has(item.id),
        },
        assessment,
      };
    });

    // Sort by match score descending
    matches.sort((a, b) => b.assessment.totalScore - a.assessment.totalScore);

    return res.json({
      success: true,
      matches,
      summary: {
        totalEvaluated: matches.length,
        topScore: matches[0]?.assessment.totalScore || 0,
        averageScore: Math.round(
          matches.reduce((acc, m) => acc + m.assessment.totalScore, 0) / Math.max(1, matches.length)
        ),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/readiness/assess/:internshipId — Single Opportunity Detailed Assessment
router.get('/assess/:internshipId', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { internshipId } = req.params;

    const profileDTO = await getProfileDTO(req.user!.userId);
    if (!profileDTO) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const item = await prisma.internship.findUnique({
      where: { id: internshipId },
      include: {
        company: true,
        skills: {
          include: { skill: true },
        },
      },
    });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Internship not found' });
    }

    const formatted = formatInternship(item);
    const assessment = calculateInternshipMatch(profileDTO, formatted as any);

    // Persist or update match assessment
    await prisma.matchAssessment.upsert({
      where: {
        userId_internshipId: {
          userId: req.user!.userId,
          internshipId,
        },
      },
      update: {
        totalScore: assessment.totalScore,
        skillsScore: assessment.skillsScore,
        educationScore: assessment.educationScore,
        careerScore: assessment.careerScore,
        locationScore: assessment.locationScore,
        experienceScore: assessment.experienceScore,
        eligibilityStatus: assessment.eligibilityStatus,
        rawResult: JSON.stringify(assessment),
      },
      create: {
        userId: req.user!.userId,
        internshipId,
        totalScore: assessment.totalScore,
        skillsScore: assessment.skillsScore,
        educationScore: assessment.educationScore,
        careerScore: assessment.careerScore,
        locationScore: assessment.locationScore,
        experienceScore: assessment.experienceScore,
        eligibilityStatus: assessment.eligibilityStatus,
        rawResult: JSON.stringify(assessment),
      },
    });

    return res.json({
      success: true,
      internship: formatted,
      assessment,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
