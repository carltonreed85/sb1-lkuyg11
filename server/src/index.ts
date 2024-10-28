import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { patientRouter } from './routes/patients';
import { referralRouter } from './routes/referrals';
import { settingsRouter } from './routes/settings';
import { logger } from './utils/logger';
import path from 'path';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || '*'
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/patients', patientRouter);
app.use('/api/referrals', referralRouter);
app.use('/api/settings', settingsRouter);

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Closing HTTP server and database connections');
  await prisma.$disconnect();
  process.exit(0);
});