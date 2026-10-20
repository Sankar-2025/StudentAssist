import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../apps/api/src/app';

describe('StudentAssist REST API & Security Isolation Tests', () => {
  it('GET /api/health returns system health and DB status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('pass');
    expect(res.body.database.status).toBe('healthy');
  });

  it('GET /api/internships returns traceable listings and evidence structures', async () => {
    const res = await request(app).get('/api/internships');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const first = res.body.data[0];
    expect(first.evidence).toBeDefined();
    expect(first.evidence.sourceUrl).toBeDefined();
    expect(first.evidence.verificationStatus).toBeDefined();
  });

  it('GET /api/roadmaps returns sequenced learning pathways', async () => {
    const res = await request(app).get('/api/roadmaps');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.roadmaps)).toBe(true);
    expect(res.body.roadmaps.length).toBeGreaterThan(0);
  });

  it('GET /api/resources/videos returns curated candidate debriefs with disclaimers', async () => {
    const res = await request(app).get('/api/resources/videos');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.disclaimer).toBeDefined();
    expect(Array.isArray(res.body.resources)).toBe(true);
  });

  it('POST /api/auth/login rejects invalid credentials with 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'student@example.com',
      password: 'WrongPassword123!',
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login accepts valid test user credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'student@example.com',
      password: 'Student123!',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('student@example.com');
  });

  it('Strict Security: rejects unauthenticated access to private resources', async () => {
    const resResumes = await request(app).get('/api/resumes');
    expect(resResumes.status).toBe(401);

    const resApps = await request(app).get('/api/applications');
    expect(resApps.status).toBe(401);

    const resProfile = await request(app).get('/api/profile');
    expect(resProfile.status).toBe(401);

    const resNotifs = await request(app).get('/api/notifications');
    expect(resNotifs.status).toBe(401);
  });

  it('Authenticated User can access personalized readiness matches', async () => {
    // 1. Login to get token
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'student@example.com',
      password: 'Student123!',
    });
    const token = loginRes.body.token;

    // 2. Fetch matches with token
    const matchRes = await request(app)
      .get('/api/readiness/matches')
      .set('Authorization', `Bearer ${token}`);

    expect(matchRes.status).toBe(200);
    expect(matchRes.body.success).toBe(true);
    expect(Array.isArray(matchRes.body.matches)).toBe(true);
    expect(matchRes.body.matches[0].assessment.totalScore).toBeGreaterThanOrEqual(0);
  });
});
