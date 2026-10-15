# InternProof AI — REST API Documentation

All API endpoints are prefixed with `/api`. Authenticated endpoints accept either a `Bearer <token>` HTTP header or an `HttpOnly` session cookie.

---

## 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new student account and create profile | No |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT | No |
| `POST` | `/api/auth/logout` | Clear session cookie | Yes |
| `GET` | `/api/auth/me` | Fetch active user session & profile | Yes |

---

## 2. Student Profile & Skills (`/api/profile`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/profile` | Retrieve student profile and verified skills | Yes |
| `PUT` | `/api/profile` | Update education, standing, target role, preferences | Yes |
| `POST` | `/api/profile/skills` | Add or update demonstrated skill with proficiency | Yes |
| `DELETE`| `/api/profile/skills/:skillId` | Remove a skill from student profile | Yes |
| `GET` | `/api/profile/all-skills` | Fetch all system skills for autocomplete | No |

---

## 3. Internship Discovery & Evidence (`/api/internships`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/internships` | Query opportunities with filters (search, workMode, isPaid, verificationStatus, sortBy, page, limit) | Optional |
| `GET` | `/api/internships/:id` | Fetch detailed listing with Opportunity Evidence Panel | Optional |
| `POST` | `/api/internships/:id/save` | Bookmark opportunity to student saved list | Yes |
| `DELETE`| `/api/internships/:id/save` | Remove bookmark | Yes |
| `GET` | `/api/internships/saved/all` | List all bookmarked opportunities | Yes |

---

## 4. Readiness Intelligence & Scoring (`/api/readiness`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/readiness/matches` | Calculate personalized explainable match scores for all opportunities | Yes |
| `GET` | `/api/readiness/assess/:id`| Generate full factor breakdown, skill gap matrix, and estimated prep time for a single opportunity | Yes |

---

## 5. Skill Roadmaps (`/api/roadmaps`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/roadmaps` | List all role-specific roadmaps with milestone counts | Optional |
| `GET` | `/api/roadmaps/:role` | Get detailed milestones, prerequisites, official links, and student completion status | Optional |
| `POST` | `/api/roadmaps/steps/:stepId/toggle` | Toggle milestone completion checkbox | Yes |

---

## 6. Interview Lab (`/api/interviews`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/interviews/questions` | Filter question bank by category, company, difficulty | Optional |
| `GET` | `/api/interviews/questions/:id`| Fetch question details, hints, and STAR framework guide | Optional |
| `POST` | `/api/interviews/questions/:id/practice` | Submit answer for rubric automated evaluation | Yes |
| `GET` | `/api/interviews/history` | View student's past practice scores and feedback | Yes |

---

## 7. AI Career Mentor (`/api/mentor`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/mentor/chat` | Send prompt to context-aware career coach | Yes |
| `GET` | `/api/mentor/conversations` | List user's mentorship sessions | Yes |
| `GET` | `/api/mentor/conversations/:id` | Get message history for session | Yes |
| `DELETE`| `/api/mentor/conversations/:id` | Delete conversation history | Yes |

---

## 8. Resume Studio (`/api/resumes`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/resumes` | List user resumes | Yes |
| `GET` | `/api/resumes/:id` | Get resume document | Yes |
| `POST` | `/api/resumes` | Create new resume draft | Yes |
| `PUT` | `/api/resumes/:id` | Update resume sections | Yes |
| `DELETE`| `/api/resumes/:id` | Delete resume | Yes |
| `POST` | `/api/resumes/:id/ats-scan` | Scan resume against job description for ATS keyword density | Yes |

---

## 9. Application Tracker (`/api/applications`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/applications` | List applications with status history | Yes |
| `POST` | `/api/applications` | Track new application in pipeline | Yes |
| `PUT` | `/api/applications/:id` | Update stage, notes, dates, or next action | Yes |
| `DELETE`| `/api/applications/:id` | Delete tracked application | Yes |
| `GET` | `/api/applications/stats` | Pipeline metrics (by status, active, offers) | Yes |

---

## 10. Privacy & Security (`/api/privacy`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/privacy/change-password` | Update account password | Yes |
| `GET` | `/api/privacy/export-data` | GDPR complete data export (JSON) | Yes |
| `DELETE`| `/api/privacy/delete-account` | Permanently purge account and data | Yes |
| `GET` | `/api/privacy/audit-logs` | Retrieve recent security audit events | Yes |
