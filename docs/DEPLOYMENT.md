# InternProof AI — Deployment & Infrastructure Guide

This guide covers deploying InternProof AI across local, containerized, and production cloud environments.

---

## 1. Local Development Setup

### Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+` or `v11+`

### Quickstart Commands
```bash
# 1. Install dependencies
npm install

# 2. Build shared contracts
npm run build:shared

# 3. Initialize SQLite database & generate Prisma client
npm run db:push

# 4. Seed verified opportunities, roadmaps, questions, and test user
npm run db:seed

# 5. Start API Server (Runs on http://localhost:5000)
npm run dev:api

# 6. In a second terminal, start Vite Web Client (Runs on http://localhost:5173)
npm run dev:web
```

Default student credentials:
- **Email:** `student@example.com`
- **Password:** `Student123!`

---

## 2. Production Database Deployment (PostgreSQL)

While SQLite provides immediate zero-config execution locally, production deployments should use managed PostgreSQL (Supabase, Neon, AWS RDS, or Railway).

### Migration Steps for PostgreSQL:
1. In `apps/api/prisma/schema.prisma`, update the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set your production connection string in `.env`:
   ```bash
   DATABASE_URL="postgresql://user:password@db.supabase.co:5432/internproof?schema=public&sslmode=require"
   ```
3. Run the Prisma migration:
   ```bash
   npx prisma migrate deploy
   ```

---

## 3. Production Deployment (PaaS / Cloud)

### Frontend (Vercel / Netlify / Cloudflare Pages)
- **Root Directory:** `apps/web`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL`: URL of your backend API (e.g. `https://api.internproof.ai`)

### Backend API (Railway / Render / AWS ECS / Fly.io)
- **Root Directory:** Project root or `apps/api`
- **Build Command:** `npm run build:shared && npm run build:api`
- **Start Command:** `npm run start --workspace=apps/api`
- **Environment Variables:**
  - `NODE_ENV=production`
  - `PORT=5000`
  - `CLIENT_URL=https://app.internproof.ai`
  - `DATABASE_URL=postgresql://...`
  - `JWT_SECRET=<secure_random_32_char_string>`
  - `GEMINI_API_KEY=<optional_gemini_key>`
  - `OPENAI_API_KEY=<optional_openai_key>`

---

## 4. Docker & Containerized Deployment

A multi-stage `Dockerfile` and `docker-compose.yml` are provided in the repository root:
```bash
# Build and run entire stack
docker compose up -d --build
```
This launches the PostgreSQL database, API server, and web frontend in isolated networks with automated healthchecks.
