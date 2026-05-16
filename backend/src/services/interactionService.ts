import pool from '../config/db';

export type InteractionType = 'view' | 'like' | 'save' | 'share';

export async function recordInteraction(
  userId: number,
  contentId: number,
  interactionType: InteractionType
): Promise<void> {
  await pool.query(
    `
    INSERT INTO user_interactions (user_id, content_id, interaction_type, created_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (user_id, content_id, interaction_type) DO NOTHING
    `,
    [userId, contentId, interactionType]
  );
}

export async function recordView(contentId: number, userId?: number): Promise<void> {
  await pool.query('UPDATE content SET view_count = view_count + 1 WHERE id = $1', [contentId]);

  if (userId) {
    await recordInteraction(userId, contentId, 'view');
  }
}
