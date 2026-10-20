# StudentAssist — Security Architecture & Verification

StudentAssist treats cybersecurity and student data privacy as core architectural requirements, rigorously implementing protections against the OWASP Top 10 vulnerabilities.

---

## 1. Authentication & Session Management
- **Password Security**: Passwords hashed using `bcryptjs` with salt work factor of 10. Passwords must be at least 8 characters.
- **Session Tokens**: Cryptographically signed JSON Web Tokens (JWT) verified per request.
- **Cookie Security**: Auth cookies configured with `httpOnly: true`, `sameSite: 'lax'`, and `secure: true` in production environments.
- **Brute Force Defense**: `/api/auth/login` and `/api/auth/register` are protected by an isolated rate limiter (20 attempts per 15-minute window).

---

## 2. Authorization & Per-User Resource Isolation
- Strict database-level per-user access control enforces that students can **only** read, edit, or delete their own private resources:
  - Resumes (`where: { id, userId: req.user.userId }`)
  - Applications (`where: { id, userId: req.user.userId }`)
  - Practice Sessions (`where: { userId: req.user.userId }`)
  - Notifications (`where: { userId: req.user.userId }`)
  - Profile & Skills (`where: { userId: req.user.userId }`)
- Attempts to query or mutate another user's resources return `404 Not Found` or `401 Unauthorized`, completely preventing IDOR (Insecure Direct Object Reference) vulnerabilities.

---

## 3. Injection Protections
- **SQL Injection**: All database operations use Prisma ORM with parameterized queries. No raw unchecked string concatenations are executed in application routes.
- **Cross-Site Scripting (XSS)**: React handles contextual HTML entity encoding automatically. Dangerous `dangerouslySetInnerHTML` is forbidden throughout client code.
- **Input Validation**: All API request bodies pass through strict Zod schemas, stripping unvalidated fields and preventing parameter pollution.

---

## 4. HTTP Headers & Denial of Service Safeguards
- **Helmet**: Injects security headers including `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and HSTS.
- **Payload Limits**: Body parsing middleware restricted to `1mb` to prevent ReDoS and memory exhaustion attacks.
- **Rate Limiting**: Global API rate limiting allows up to 300 requests per 15-minute window per IP.

---

## 5. Security Audit Logging & Privacy (GDPR Compliance)
- **Security Audit Trail**: Crucial security actions (`USER_REGISTERED`, `LOGIN_SUCCESS`, `LOGIN_FAILED`, `PASSWORD_CHANGED`, `DATA_EXPORT_REQUESTED`, `ACCOUNT_DELETED`) are written to the `AuditEvent` database table with IP address and timestamp.
- **GDPR Portability**: Students can export their complete profile, application history, resumes, and interview practice logs in structured JSON format (`GET /api/privacy/export-data`).
- **Account Deletion**: Verified deletion endpoint (`DELETE /api/privacy/delete-account`) cascades and permanently purges all user data.
