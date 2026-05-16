import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import pool from './config/db';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import userRoutes from './routes/users';
import collectionRoutes from './routes/collections';
import recommendationRoutes from './routes/recommendations';
import { rateLimit } from './middleware/rateLimit';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

  app.use('/api/auth', authRateLimit, authRoutes);
  app.use('/api/content', contentRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/collections', collectionRoutes);
  app.use('/api/recommendations', recommendationRoutes);

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? message : undefined,
    });
  });

  return app;
}
