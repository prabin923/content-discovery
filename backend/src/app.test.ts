import './config/env';
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from './app';

describe('app', () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    app = createApp();
  });

  it('returns validation error for empty library search', async () => {
    const response = await request(app).get('/api/content/search').query({ q: '' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });
});
