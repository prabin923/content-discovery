'use client';

import { useCallback, useEffect, useState } from 'react';
import type { DbContentRow } from '@discovery-hub/shared';
import { apiRequest, ApiError } from '@/lib/api';
import { mapDbRowToContentItem } from '@/lib/content';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import ContentCard from '@/components/ContentCard';

interface Props {
  onRequireAuth: () => void;
}

export default function SavedItemsView({ onRequireAuth }: Props) {
  const { user } = useAuth();
  const [items, setItems] = useState<ReturnType<typeof mapDbRowToContentItem>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSaved = useCallback(async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<{ items: DbContentRow[] }>('/api/users/me/saved', { auth: true });
      setItems((data.items ?? []).map(mapDbRowToContentItem));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onRequireAuth();
      }
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user, onRequireAuth]);

  useEffect(() => {
    if (user) {
      void loadSaved();
    }
  }, [user, loadSaved]);

  if (!user) {
    return (
      <Card className="text-center">
        <p className="mb-4 text-slate-600">Sign in to view your saved library.</p>
        <Button onClick={onRequireAuth}>Sign in</Button>
      </Card>
    );
  }

  if (loading) {
    return <p className="text-slate-600">Loading saved items…</p>;
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Saved library</h2>
        <Button variant="secondary" onClick={() => void loadSaved()}>
          Refresh
        </Button>
      </div>

      {error ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p> : null}
      {!error && items.length === 0 ? (
        <p className="text-slate-600">Nothing saved yet. Save items from Discover or For You.</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item.id ?? item.sourceId} item={item} showSaveActions onRequireAuth={onRequireAuth} />
        ))}
      </div>
    </section>
  );
}
