# Multi-stage Dockerfile for InternProof AI
FROM node:20-alpine AS base
WORKDIR /app

# Copy root and workspace manifests
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/

# Install dependencies
RUN npm install

# Copy source files
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
COPY apps/web ./apps/web
COPY prisma ./prisma

# Build packages
RUN npm run build:shared
RUN npm run db:generate
RUN npm run build:api
RUN npm run build:web

EXPOSE 5000 5173
CMD ["npm", "run", "start", "--workspace=apps/api"]
