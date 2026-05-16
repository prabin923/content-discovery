import pool from '../config/db';
import type { DbContentRow } from '@discovery-hub/shared';
import { parseLimit, parsePage, paginationMeta } from '../utils/pagination';

interface SearchParams {
  q: string;
  type?: string | null;
  page?: number;
  limit?: number;
}

export async function searchContent(params: SearchParams) {
  const q = params.q.trim();
  const page = parsePage(params.page);
  const limit = parseLimit(params.limit, 50, 20);
  const offset = (page - 1) * limit;
  const type = params.type?.trim() || null;

  const conditions = [
    `to_tsvector('english', c.title || ' ' || COALESCE(c.description, '')) @@ plainto_tsquery('english', $1)`,
  ];
  const values: Array<string | number> = [q];
  let paramIndex = 2;

  if (type && ['video', 'product', 'paper'].includes(type)) {
    conditions.push(`c.type = $${paramIndex}`);
    values.push(type);
    paramIndex += 1;
  }

  const whereClause = conditions.join(' AND ');

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM content c WHERE ${whereClause}`,
    values
  );
  const total = countResult.rows[0].total as number;

  const result = await pool.query(
    `
    SELECT
      c.id,
      c.type,
      c.title,
      c.description,
      c.thumbnail_url,
      c.source_url,
      c.source_platform,
      c.source_id,
      c.tags,
      c.metadata,
      c.published_date,
      ts_rank(
        to_tsvector('english', c.title || ' ' || COALESCE(c.description, '')),
        plainto_tsquery('english', $1)
      ) AS rank
    FROM content c
    WHERE ${whereClause}
    ORDER BY rank DESC, COALESCE(c.published_date, c.created_at) DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `,
    [...values, limit, offset]
  );

  return {
    items: result.rows as DbContentRow[],
    meta: paginationMeta(total, page, limit),
  };
}
