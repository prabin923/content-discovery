import cron from 'node-cron';
import pool from '../config/db';
import { discoverProducts } from '../services/productService';
import { discoverPapers } from '../services/paperService';
import { discoverYouTubeContent } from '../services/youtubeService';
import { upsertContentItem } from '../services/contentRepository';

async function runScheduledSync(): Promise<void> {
  const startedAt = Date.now();
  const errors: string[] = [];

  try {
    const [products, papers, videos] = await Promise.all([
      discoverProducts({ q: 'innovation', limit: 20 }).catch((error: unknown) => {
        errors.push(`products: ${(error as Error).message}`);
        return [];
      }),
      discoverPapers({ q: 'machine learning', limit: 20 }).catch((error: unknown) => {
        errors.push(`papers: ${(error as Error).message}`);
        return [];
      }),
      discoverYouTubeContent({ q: 'technology trends', limit: 20 }).catch((error: unknown) => {
        errors.push(`youtube: ${(error as Error).message}`);
        return [];
      }),
    ]);

    const merged = [...products, ...papers, ...videos];
    for (const item of merged) {
      await upsertContentItem(item);
    }

    await pool.query(
      `
      INSERT INTO sync_logs (source_platform, items_synced, items_added, items_updated, sync_duration_ms, status, error_message, synced_at)
      VALUES ('all', $1, $1, 0, $2, $3, $4, NOW())
      `,
      [merged.length, Date.now() - startedAt, errors.length ? 'partial' : 'success', errors.join('; ') || null]
    );
  } catch (error) {
    await pool.query(
      `
      INSERT INTO sync_logs (source_platform, items_synced, items_added, items_updated, sync_duration_ms, status, error_message, synced_at)
      VALUES ('all', 0, 0, 0, $1, 'failed', $2, NOW())
      `,
      [Date.now() - startedAt, (error as Error).message]
    );
    console.error('Scheduled sync failure:', error);
  }
}

export function startContentSyncJob(): void {
  const schedule = process.env.CONTENT_SYNC_CRON ?? '*/30 * * * *';
  cron.schedule(schedule, () => {
    void runScheduledSync();
  });
  console.log(`✓ Content sync job started (${schedule})`);
}
