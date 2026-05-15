'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ContentItem, FeedResponse } from '@discovery-hub/shared';
import { apiRequest, ApiError } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { mapDbRowToContentItem } from '../../lib/content';
import Button from '../common/Button';
import ContentCard from '../ContentCard';

interface Props {
  onRequireAuth: () => void;
}

export default function ForYouFeed({ onRequireAuth }: Props) {
  const { user, token } = useAuth();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async () => {
    return apiRequest<FeedResponse>('/api/recommendations/feed', { auth: true });
  }, []);

  const applyFeed = useCallback(
    (data: FeedResponse) => {
      setInterests(data.userInterests ?? []);
      setItems((data.items ?? []).map(mapDbRowToContentItem));
    },
    []
  );

  useEffect(() => {
    if (!user || !token) {
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        const data = await fetchFeed();
        if (!cancelled) {
          applyFeed(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 401) {
            onRequireAuth();
          }
          setError((err as Error).message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [user, token, fetchFeed, applyFeed, onRequireAuth]);

  const loadFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFeed();
      applyFeed(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onRequireAuth();
      }
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="mb-4 text-slate-600">Sign in to see recommendations based on your interests.</p>
        <Button onClick={onRequireAuth}>Sign in</Button>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Personalized for you</h2>
          {interests.length > 0 ? (
            <p className="text-sm text-slate-500">Interests: {interests.join(', ')}</p>
          ) : (
            <p className="text-sm text-slate-500">Update your profile interests to improve recommendations.</p>
          )}
        </div>
        <Button variant="secondary" onClick={() => void loadFeed()} disabled={loading}>
          Refresh
        </Button>
      </div>

      {loading ? <p className="text-slate-600">Loading your feed…</p> : null}
      {error ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p> : null}
      {!loading && !error && items.length === 0 ? (
        <p className="text-slate-600">No recommendations yet. Sync content from the discover tab first.</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ContentCard
            key={item.id ?? item.sourceId}
            item={item}
            showSaveActions
            onRequireAuth={onRequireAuth}
          />
        ))}
      </div>
    </section>
  );
}
