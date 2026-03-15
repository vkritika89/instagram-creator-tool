import path from 'path';
import dotenv from 'dotenv';

// Load .env from backend directory (works even when running from project root)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

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
import videoRoutes from './routes/video';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Root — so visiting http://localhost:3001 doesn't show "Cannot GET"
app.get('/', (_req, res) => {
  res.json({
    message: 'Instagram Creator Tool API',
    health: '/api/health',
    docs: 'Use the frontend at the URL configured in FRONTEND_URL (e.g. http://localhost:5173)',
  });
});

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
app.use('/api/video', authMiddleware, videoRoutes);

// 404 for unknown routes (avoids plain "Cannot GET /some-path")
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found', path: _req.path });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

