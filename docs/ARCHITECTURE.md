# InternProof AI — System Architecture & Intelligence Engine

## 1. High-Level Architecture Overview

InternProof AI is designed as a modular, secure, high-performance monorepo platform tailored for college students and early-career software/AI engineers.

```
┌─────────────────────────────────────────────────────────────┐
│                 Frontend Client (apps/web)                  │
│       React 18 + Vite + Tailwind CSS + Lucide + Recharts    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST
┌──────────────────────────────▼──────────────────────────────┐
│                  Backend API (apps/api)                     │
│       Express.js + TypeScript + Helmet + JWT + RateLimit    │
├─────────────────────────────────────────────────────────────┤
│  Readiness Intelligence Engine  │   AI Career Mentor Service │
│  (Explainable Weighted Matcher) │  (Gemini / OpenAI / Fallback)
└──────────────────────────────┬──────────────────────────────┘
                               │ Prisma ORM
┌──────────────────────────────▼──────────────────────────────┐
│                      Database Layer                         │
│    SQLite (Zero-config local) / PostgreSQL (Production)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Internship Readiness Intelligence Engine

The core signature capability of InternProof AI is the **Internship Readiness Intelligence Engine**. Rather than relying on black-box opacity or keyword matching, it computes a transparent, explainable match score (0 - 100%) grounded in five documented factors:

### Factor Weight Distribution:
1. **Skill Alignment (40%)**:
   - Compares the student's demonstrated skills with the opportunity's required skills (2x points) and preferred skills (1x point).
   - Accounts for proficiency levels (`EXPERT`, `ADVANCED`, `INTERMEDIATE`, `BEGINNER`).
2. **Education & Graduation Alignment (25%)**:
   - Assesses whether the student's expected graduation year satisfies the opportunity's verified candidate window (e.g. 2026 - 2028).
   - Validates that the student's academic major aligns with accepted degree fields.
3. **Career Interest Alignment (20%)**:
   - Correlates the student's target career role with the internship title, category, and preferred target companies.
4. **Location & Work Mode Alignment (10%)**:
   - Evaluates compatibility between student preferences (Remote, Hybrid, Onsite) and the job listing. Remote positions receive high baseline compatibility.
5. **Academic Standing & Experience (5%)**:
   - Assesses class standing (Junior / Senior / Sophomore / Graduate) against internship expectations.

### Explainability & Uncertainty Classification:
Each match assessment generates one of four verified eligibility states:
- **`ELIGIBLE`**: Student satisfies degree, graduation timeline, and foundational prerequisites.
- **`POTENTIALLY_ELIGIBLE`**: Core competencies match, but graduation year or specific engineering concentration requires manual confirmation.
- **`NEEDS_CONFIRMATION`**: Crucial information (e.g., student graduation date or unlisted criteria) is missing.
- **`INELIGIBLE`**: Clear requirement mismatch (e.g., graduation year out of range, or unaccepted degree discipline).

---

## 3. Data Freshness & Opportunity Evidence Traceability

To eliminate hallucinations and fake listings:
- Every opportunity includes an **Opportunity Evidence Panel**.
- Tracks `sourceUrl` (official careers portal), `sourceType`, `lastCheckedDate`, `deadlineVerified`, and `verificationStatus`.
- Tiered status markers:
  - `VERIFIED_OFFICIAL`: Official corporate careers portal listing.
  - `PARTNER_FEED`: Authorized university or hiring partner feed.
  - `COMMUNITY_REPORTED`: Community report flagged for verification.
  - Development sample data is explicitly tagged `isDemoData: true`.
