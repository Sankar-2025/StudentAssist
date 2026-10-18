import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { apiLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';

// Route imports
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import internshipsRoutes from './routes/internships.routes';
import assessmentsRoutes from './routes/assessments.routes';
import readinessRoutes from './routes/readiness.routes';
import roadmapsRoutes from './routes/roadmaps.routes';
import interviewsRoutes from './routes/interviews.routes';
import mentorRoutes from './routes/mentor.routes';
import resumesRoutes from './routes/resumes.routes';
import applicationsRoutes from './routes/applications.routes';
import notificationsRoutes from './routes/notifications.routes';
import privacyRoutes from './routes/privacy.routes';
import resourcesRoutes from './routes/resources.routes';
import adminInternshipImportsRoutes from './routes/admin-internship-imports.routes';

const app = express();

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: config.env === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
  })
);

// 2. CORS configuration with credentials
const configuredOrigins = (config.clientUrl || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  'https://studentassist-1.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.onrender.com') ||
        /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
        /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Body Parsing with Size Limits (SSRF & ReDoS safeguard)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// 4. Rate Limiting for all API routes
app.use('/api', apiLimiter);

// 5. API Routes Registration
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/internships', internshipsRoutes);
app.use('/api/admin/internship-imports', adminInternshipImportsRoutes);
app.use('/api/readiness', readinessRoutes);
app.use('/api/roadmaps', roadmapsRoutes);
app.use('/api/interviews', interviewsRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/resumes', resumesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/resources', resourcesRoutes);

// 6. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl} — route not found.`,
  });
});

// 7. Central Error Handling Middleware
app.use(errorHandler);

export default app;
