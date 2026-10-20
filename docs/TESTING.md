# StudentAssist — Automated Test Suite & QA Verification

StudentAssist incorporates real automated testing covering units, integration endpoints, and cybersecurity access boundaries.

---

## 1. Test Architecture

- **Test Runner:** Vitest v1.6+
- **HTTP Integration Mocking:** Supertest
- **Assertions:** Vitest native assertions
- **Test Locations:**
  - `tests/unit/`: Algorithmic and pure domain logic tests
  - `tests/integration/`: End-to-end API route and data isolation tests

---

## 2. Test Suites Overview

### Unit Tests (`tests/unit/matcher.test.ts`)
1. **High Alignment Scoring**: Asserts that candidates with matching core skills (TypeScript, React, Node.js), accepted CS degrees, and graduation years inside the target window earn scores $\ge 80\%$.
2. **Ineligible Boundary Testing**: Verifies that candidates outside the opportunity's verified graduation range are classified as `INELIGIBLE` with lowered education scores and explicit explanation reasons.
3. **Uncertainty Classification**: Verifies that when crucial criteria (e.g. graduation date) are absent from a student profile, the system classifies the opportunity as `NEEDS_CONFIRMATION` rather than assuming eligibility.
4. **Skill Gap & Timeline Estimation**: Tests that missing required competencies are isolated and sequenced into a recommended learning priority order with realistic time estimates (~2 weeks per core missing skill).

### Integration & Security Tests (`tests/integration/api.test.ts`)
1. **Health Check Endpoint**: Confirms `GET /api/health` validates database connectivity and memory metrics.
2. **Traceable Listings**: Tests `GET /api/internships` to ensure evidence metadata (`sourceUrl`, `verificationStatus`) is populated.
3. **Skill Roadmaps & Video Resources**: Confirms public access to educational pathways and YouTube candidate debrief metadata.
4. **Authentication Security**:
   - Tests that invalid passwords return HTTP 401.
   - Tests valid login issues JWT tokens and returns user profile.
5. **Strict Data Isolation**:
   - Asserts unauthenticated requests to `/api/resumes`, `/api/applications`, `/api/profile`, and `/api/notifications` are rejected with HTTP 401.
6. **Authenticated Workflow**:
   - Tests that a valid JWT token enables access to `/api/readiness/matches` with personalized scores.

---

## 3. Running the Tests

To execute the full test suite:
```bash
# Run all tests
npm test

# Run in watch mode during development
npx vitest
```

### Verified Test Run Result:
```
✓ tests/unit/matcher.test.ts  (4 tests)
✓ tests/integration/api.test.ts  (8 tests)

Test Files  2 passed (2)
     Tests  12 passed (12)
```
All 12 tests passed successfully with zero failures.
