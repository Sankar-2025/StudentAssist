import app from './app';
import { config } from './config';
import { scheduleInternshipCollector } from './services/internship-collector.service';

const stopCollector = scheduleInternshipCollector();

const server = app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`🚀 InternProof AI API Server is running!`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🌍 Environment: ${config.env}`);
  console.log(`🛡️ CORS Origin: ${config.clientUrl}`);
  console.log(`====================================================`);
});

process.on('SIGINT', () => {
  stopCollector();
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  stopCollector();
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
