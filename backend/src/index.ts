import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/auth';

// Route imports
import profileRoutes from './routes/profile';
import weeklyPlanRoutes from './routes/weeklyPlan';
import reelScriptRoutes from './routes/reelScript';
import captionRoutes from './routes/captions';
import videoRoutes from './routes/video';
import authorityScoreRoutes from './routes/authorityScore';
import libraryRoutes from './routes/library';
import statsRoutes from './routes/stats';
import calendarRoutes from './routes/calendar';
import paymentRoutes, { handleWebhook } from './routes/payments';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Stripe webhook needs raw body BEFORE express.json()
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected API routes (all require auth)
app.use('/api/profile', authMiddleware, profileRoutes);
app.use('/api/weekly-plan', authMiddleware, weeklyPlanRoutes);
app.use('/api/reel-script', authMiddleware, reelScriptRoutes);
app.use('/api/captions', authMiddleware, captionRoutes);
app.use('/api/video', authMiddleware, videoRoutes);
app.use('/api/authority-score', authMiddleware, authorityScoreRoutes);
app.use('/api/library', authMiddleware, libraryRoutes);
app.use('/api/stats', authMiddleware, statsRoutes);
app.use('/api/calendar', authMiddleware, calendarRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

