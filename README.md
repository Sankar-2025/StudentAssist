# StudentAssist — Student Internship Intelligence & Readiness Platform

> A complete, production-ready full-stack software intelligence platform designed for college students and early-career tech professionals (Software Engineers, AI/ML Engineers, Cloud Architects, Data Scientists).

---

## 🌟 Key Differentiating Features

### 1. 🎯 Internship Readiness Intelligence Engine
- Transparent, explainable match score (0 - 100%) calculated across five documented factors:
  - **Skills Alignment (40%)**: Compares student demonstrated skills against required and preferred qualifications.
  - **Education & Eligibility (25%)**: Validates graduation timeline (e.g. 2026 - 2028) and accepted degree majors.
  - **Career-Interest Alignment (20%)**: Correlates target career roles with opportunity domains.
  - **Location & Work Mode (10%)**: Evaluates compatibility with Remote, Hybrid, or Onsite preferences.
  - **Academic Standing (5%)**: Evaluates experience readiness (Freshman, Sophomore, Junior, Senior, Graduate).
- **Uncertainty Classification**: Clearly distinguishes between `ELIGIBLE`, `POTENTIALLY_ELIGIBLE`, `NEEDS_CONFIRMATION`, and `INELIGIBLE`.
- **Skill-Gap Analysis**: Highlights demonstrated skills, missing competencies, prioritized learning sequence, and estimated prep time in weeks.

### 2. 🔍 Discover Verified Internships
- Extensible discovery feed backed by **Opportunity Evidence Panels**:
  - Displays primary source URL (official career portal), last-checked timestamp, verified deadline status, and qualification checklist.
  - Tiered verification badges (`VERIFIED_OFFICIAL`, `PARTNER_FEED`, `COMMUNITY_REPORTED`).
  - Multi-dimensional filtering by work mode, verification status, and paid compensation.

### 3. 🗺️ Personalized Skill Roadmaps
- Sequenced, milestone-driven preparation pathways (Full Stack Web Engineer, AI/ML Engineer, Cloud & DevOps).
- Prerequisite milestones, estimated hours, hands-on mini-projects, and official documentation links (React, TypeScript, PyTorch, Docker).
- Interactive completion checkboxes stored in the database.

### 4. 🧪 Company-Specific Interview Lab
- Curated question repository across Technical (DSA, System Design), Behavioral (STAR method), and HR rounds.
- Public candidate report citations with source attributions.
- Automated rubric-based evaluation scoring answers on Structure (35%), Technical Depth (45%), and Clarity (20%).
- Saved practice sessions and score progress history.

### 5. 🤖 AI Career Mentor
- Contextual career coach aware of the student's profile, university, active applications, and target role.
- Transparent provider disclosure: Supports Google Gemini (`GEMINI_API_KEY`), OpenAI (`OPENAI_API_KEY`), or an intelligent **Offline Career Advisor Mode** with honest status indication.

### 6. 📄 Resume Studio & ATS Optimizer
- Interactive resume builder supporting multiple clean templates (*Modern Tech*, *Executive Clean*, *Minimalist Academic*).
- Live preview pane with printable PDF export.
- **ATS Keyword Optimizer**: Scans resume against job descriptions to calculate keyword density and recommend phrasing enhancements.

### 7. 📋 Application Pipeline Tracker
- Visual Kanban board and list view spanning 9 stages (`INTERESTED`, `PREPARING`, `READY_TO_APPLY`, `APPLIED`, `ASSESSMENT`, `INTERVIEW`, `OFFER`, `REJECTED`, `WITHDRAWN`).
- Interview scheduling, deadline reminders, notes, and status transition audit history.

### 8. 🔔 Notification Center & Web Push Architecture
- In-app notification center with category filtering (Matches, Deadlines, Milestones, System).
- User alert preferences and quiet hours configuration.
- Complete Web Push API architecture with VAPID key lifecycle management and graceful local fallback.

### 9. 📺 YouTube Candidate Experience Hub
- Curated debriefs from verified channels (Google Students, Microsoft Life, Meta Careers, Amazon Talent) with clear disclaimers that individual hiring outcomes differ.

### 10. 🛡️ Security, Privacy & GDPR Controls
- OWASP Top 10 compliance: Bcrypt hashing, strict JWT authentication, helmet headers, rate limiting, and parameterized queries.
- Strict per-user resource isolation (users can never access or modify another student's resumes or applications).
- GDPR Data Portability: One-click export of complete account data as formatted JSON (`/api/privacy/export-data`).
- Verified account deletion with password re-authentication.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Lucide Icons, Recharts |
| **Backend** | Node.js (v24), Express.js, TypeScript, Helmet, CORS, Cookie-Parser, Zod, BcryptJS, JWT |
| **Database** | Prisma ORM, SQLite (`file:./dev.db`) for zero-config portable local dev, PostgreSQL ready for production |
| **Testing** | Vitest, Supertest (12 automated unit, integration, and security tests) |
| **DevOps** | Multi-stage Dockerfile, docker-compose.yml |

---

## 🚀 Quickstart Guide

### 1. Prerequisites
Ensure Node.js (v20+ or v24+) and npm are installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize Database & Seed
```bash
# Build shared types
npm run build:shared

# Initialize database schema
npm run db:push

# Seed opportunities, roadmaps, interview questions, and demo student
npm run db:seed
```

### 4. Start Development Servers
In terminal 1 (API Server on `http://localhost:5000`):
```bash
npm run dev:api
```

In terminal 2 (Web Client on `http://localhost:5173`):
```bash
npm run dev:web
```

---

## 🔑 Demo Student Credentials

To inspect the platform immediately with seeded skills, saved internships, and active applications:
- **Email:** `student@example.com`
- **Password:** `Student123!`
- *(A one-click "Sign in as Demo Student" button is also provided directly on the Login screen).*

---

## 🧪 Automated Test Verification

Run the full automated test suite:
```bash
npm test
```

### Verified Results:
```
Test Files  2 passed (2)
     Tests  12 passed (12)
- Unit tests: Matcher scoring, graduation eligibility boundaries, skill-gap sequencing
- Integration tests: Health endpoint, listings evidence, auth flow, security data isolation
```

---

## 📁 Repository Structure

```
StudentAssist/
├── apps/
│   ├── api/                   # Express + TypeScript API server
│   │   ├── prisma/            # Database schema & seed script
│   │   ├── src/               # Routes, services, middlewares, config
│   │   └── package.json
│   └── web/                   # React + Vite + Tailwind frontend
│       ├── src/               # 12 application pages, components, context
│       ├── index.html
│       └── package.json
├── packages/
│   └── shared/                # Domain models, matcher algorithms, DTOs
├── tests/
│   ├── unit/                  # Matching & eligibility unit tests
│   └── integration/           # REST API & security isolation tests
├── docs/
│   ├── ARCHITECTURE.md        # Architectural diagrams & formula specs
│   ├── SECURITY.md            # OWASP mitigations & audit controls
│   ├── API.md                 # REST API endpoints & schemas
│   ├── DEPLOYMENT.md          # Cloud & Docker deployment guidelines
│   └── TESTING.md             # Test suite execution logs
├── .env.example               # Environment variables template
├── .gitignore                 # Secrets & build artifact exclusion
├── Dockerfile                 # Containerized multi-stage build
├── docker-compose.yml         # Multi-container Postgres + API orchestration
├── package.json               # Root monorepo workspace coordinator
└── README.md
```

## India Internship Collector (admin review required)

The API includes an opt-in scheduled collector. It runs once about 10 seconds after API startup and every 6 hours thereafter. It only discovers links from official source pages that an administrator explicitly adds; discovered items go to a review queue and are **not published automatically**. A source fetch failure is logged and never causes listings to be deleted or closed.

### Apply the schema update

From the repository root, run:

```bash
npm run db:push
npm run db:generate
```

Restart the API after applying the schema. The public internship list is now India-only (`country = India`) and hides deadlines earlier than today. Existing records whose country is `Unknown` are intentionally hidden until you review and classify them; the collector does not relabel old US demo data as Indian.

### Admin API

Use a valid JWT whose user role is `ADMIN`. Do not make a student account an admin in the public registration flow.

- `GET /api/admin/internship-imports/sources` — list configured sources and last sync status.
- `POST /api/admin/internship-imports/sources` — add a source, JSON example:

```json
{
  "sourceName": "Official institute careers page",
  "sourceUrl": "https://replace-with-the-institute-official-internship-page.example/",
  "sourceType": "AUTO",
  "organizationType": "IIT_IISc",
  "active": true
}
```

Replace the example URL with a real official URL before saving it; the example is deliberately not a real source. Supported organization types: `IIT_IISc`, `ISRO`, `DRDO`, `GOVERNMENT`, `MNC`, `OTHER`. `AUTO` detects RSS/Atom feeds or falls back to matching internship links on the configured HTML page.

- `POST /api/admin/internship-imports/sync` — run a sync immediately.
- `GET /api/admin/internship-imports/candidates?status=PENDING` — review newly discovered links.
- `POST /api/admin/internship-imports/candidates/:id/reject` with `{ "notes": "..." }` — reject a candidate.
- `POST /api/admin/internship-imports/candidates/:id/approve` — publish after human verification. Required fields include `indiaEligible: true`, `companyName`, `title`, `location`, `description` (at least 20 characters), `applyUrl`, and `sourceUrl`. Optional fields include `companyWebsite`, `category`, `workMode`, `duration`, `stipend`, `isPaid`, `requirements`, `allowedDegrees`, `deadline` (ISO datetime), and `notes`. Past deadlines are rejected and URLs must use HTTPS.

### Accuracy and source coverage notes

The first adapter supports RSS/Atom and official HTML pages that expose internship links in their markup. Many IIT, ISRO, DRDO and MNC sites use JavaScript-only pages, login-gated job systems, external applicant-tracking systems, or prohibit crawling. Those require a permitted official feed/API or a source-specific adapter. Add one official source URL per institute/company/career portal; there is no honest way to promise literally every Indian opening from a single URL. The collector only discovers candidates; an admin must verify India eligibility, live application link, deadline and details before publishing. Configure only sources you are authorized to fetch, and respect each site's terms and robots policy.


### Enable the admin review page (local development)

The frontend page is available at `/admin/internship-imports`, and the sidebar link appears only for an `ADMIN` account. For local development, use Prisma Studio (`npx prisma studio --schema apps/api/prisma/schema.prisma` from the repository root, if your workspace's Prisma CLI resolves there) or your trusted database admin tool to change **your own** user row's `role` from `STUDENT` to `ADMIN`. Do not expose an endpoint that lets users self-assign admin roles. Sign out and sign back in after changing the role so the JWT contains the new role.
