import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../auth/auth';

export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }

  try {
    const decoded = verifyToken(authHeader.slice(7));
    req.userId = decoded.userId;
  } catch {
    // ignore invalid token for optional auth
  }

  next();
}
