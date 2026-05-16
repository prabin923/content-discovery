import { z } from 'zod';

export const ingestContentSchema = z.object({
  type: z.enum(['video', 'product', 'paper']),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  sourceUrl: z.string().min(1),
  sourcePlatform: z.string().min(1),
  sourceId: z.string().min(1),
  tags: z.array(z.string()).optional(),
  publishedDate: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  type: z.enum(['video', 'product', 'paper']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const preferencesSchema = z.object({
  preferredCategories: z.array(z.string()).optional(),
  notificationEnabled: z.boolean().optional(),
  emailDigest: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
});
