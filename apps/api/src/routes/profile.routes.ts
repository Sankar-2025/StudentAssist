import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth } from '../middlewares/auth';
import { logAuditEvent } from '../services/audit.service';

const router = Router();

const UpdateProfileSchema = z.object({
  displayName: z.string().min(2).optional(),
  educationLevel: z.string().optional(),
  university: z.string().optional(),
  degree: z.string().optional(),
  graduationYear: z.number().int().min(2024).max(2035).optional(),
  country: z.string().optional(),
  preferredLocations: z.array(z.string()).optional(),
  preferredWorkModes: z.array(z.string()).optional(),
  targetRole: z.string().optional(),
  targetCompanies: z.array(z.string()).optional(),
  experienceLevel: z.string().optional(),
  preferredDuration: z.string().optional(),
  bio: z.string().max(1000).optional(),
});

const AddSkillSchema = z.object({
  name: z.string().min(1),
  proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).default('INTERMEDIATE'),
});

// GET /api/profile
router.get('/', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.user!.userId },
      include: {
        userSkills: {
          include: { skill: true },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    return res.json({
      success: true,
      profile: {
        ...profile,
        preferredLocations: JSON.parse(profile.preferredLocations || '[]'),
        preferredWorkModes: JSON.parse(profile.preferredWorkModes || '[]'),
        targetCompanies: JSON.parse(profile.targetCompanies || '[]'),
      },
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/profile
router.put('/', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const data = UpdateProfileSchema.parse(req.body);

    const updatePayload: any = {};
    if (data.displayName !== undefined) updatePayload.displayName = data.displayName;
    if (data.educationLevel !== undefined) updatePayload.educationLevel = data.educationLevel;
    if (data.university !== undefined) updatePayload.university = data.university;
    if (data.degree !== undefined) updatePayload.degree = data.degree;
    if (data.graduationYear !== undefined) updatePayload.graduationYear = data.graduationYear;
    if (data.country !== undefined) updatePayload.country = data.country;
    if (data.preferredLocations !== undefined)
      updatePayload.preferredLocations = JSON.stringify(data.preferredLocations);
    if (data.preferredWorkModes !== undefined)
      updatePayload.preferredWorkModes = JSON.stringify(data.preferredWorkModes);
    if (data.targetRole !== undefined) updatePayload.targetRole = data.targetRole;
    if (data.targetCompanies !== undefined)
      updatePayload.targetCompanies = JSON.stringify(data.targetCompanies);
    if (data.experienceLevel !== undefined) updatePayload.experienceLevel = data.experienceLevel;
    if (data.preferredDuration !== undefined) updatePayload.preferredDuration = data.preferredDuration;
    if (data.bio !== undefined) updatePayload.bio = data.bio;

    const profile = await prisma.userProfile.update({
      where: { userId: req.user!.userId },
      data: updatePayload,
      include: {
        userSkills: {
          include: { skill: true },
        },
      },
    });

    await logAuditEvent({
      userId: req.user!.userId,
      eventType: 'PROFILE_UPDATED',
      details: { fields: Object.keys(data) },
    });

    return res.json({
      success: true,
      profile: {
        ...profile,
        preferredLocations: JSON.parse(profile.preferredLocations || '[]'),
        preferredWorkModes: JSON.parse(profile.preferredWorkModes || '[]'),
        targetCompanies: JSON.parse(profile.targetCompanies || '[]'),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/profile/skills
router.post('/skills', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { name, proficiency } = AddSkillSchema.parse(req.body);

    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    // Find or create skill
    const skill = await prisma.skill.upsert({
      where: { name: name.trim() },
      update: {},
      create: { name: name.trim(), category: 'User Added' },
    });

    const userSkill = await prisma.userSkill.upsert({
      where: {
        profileId_skillId: {
          profileId: profile.id,
          skillId: skill.id,
        },
      },
      update: { proficiency },
      create: {
        profileId: profile.id,
        skillId: skill.id,
        proficiency,
        verified: true,
      },
      include: { skill: true },
    });

    return res.status(201).json({ success: true, userSkill });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/profile/skills/:skillId
router.delete('/skills/:skillId', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { skillId } = req.params;

    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    await prisma.userSkill.deleteMany({
      where: {
        profileId: profile.id,
        skillId,
      },
    });

    return res.json({ success: true, message: 'Skill removed successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /api/profile/all-skills
router.get('/all-skills', async (req: Request, res: Response, next) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json({ success: true, skills });
  } catch (err) {
    next(err);
  }
});

export default router;
