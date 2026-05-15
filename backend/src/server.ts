import './config/env';
import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import pool from './config/db';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import userRoutes from './routes/users';
import collectionRoutes from './routes/collections';
import recommendationRoutes from './routes/recommendations';
import { startContentSyncJob } from './jobs/contentSync';

const app: Express = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      db: 'connected',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      db: 'disconnected',
      message: error instanceof Error ? error.message : 'Database unavailable',
      timestamp: new Date().toISOString(),
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Error handling middleware
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  const message = err instanceof Error ? err.message : 'Unknown error';
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? message : undefined,
  });
});

// Start server
app.listen(port, () => {
  console.log(`✓ Server is running on http://localhost:${port}`);
  console.log(`✓ Health check available at http://localhost:${port}/health`);
  startContentSyncJob();
});
