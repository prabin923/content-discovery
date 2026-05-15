'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ContentItem, DiscoverResponse, DiscoverSource } from '@discovery-hub/shared';
import { apiRequest } from '../../lib/api';
import ContentCard from '../ContentCard';
import SearchBar from './SearchBar';

function filterItemsBySource(items: ContentItem[], source: DiscoverSource): ContentItem[] {
  switch (source) {
    case 'youtube':
      return items.filter((item) => item.type === 'video');
    case 'products':
      return items.filter((item) => item.type === 'product');
    case 'papers':
      return items.filter((item) => item.type === 'paper');
    default:
      return items;
  }
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

interface Props {
  onRequireAuth?: () => void;
}

export default function ContentDiscovery({ onRequireAuth }: Props) {
  const [query, setQuery] = useState('technology');
  const [source, setSource] = useState<DiscoverSource>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceErrors, setSourceErrors] = useState<string[]>([]);
  const [items, setItems] = useState<ContentItem[]>([]);

  const visibleItems = useMemo(() => filterItemsBySource(items, source), [items, source]);

  const byType = useMemo(
    () =>
      visibleItems.reduce(
        (acc, item) => {
          acc[item.type] += 1;
          return acc;
        },
        { video: 0, product: 0, paper: 0 }
      ),
    [visibleItems]
  );

  const runSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSourceErrors([]);
    try {
      const params = new URLSearchParams({ q: query, source, limit: '12' });
      const data = await apiRequest<DiscoverResponse>(`/api/content/discover?${params.toString()}`);
      const nextItems = data.items ?? [];
      setItems(nextItems);
      setSourceErrors(data.errors ?? []);

      if (nextItems.length === 0 && (data.errors?.length ?? 0) > 0) {
        setError(data.errors.join(' · '));
      }
    } catch (err) {
      setError((err as Error).message);
      setItems([]);
      setSourceErrors([]);
    } finally {
      setLoading(false);
    }
  }, [query, source]);

  useEffect(() => {
    void runSearch();
    // Re-fetch when source filter changes; query is read from state inside runSearch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  return (
    <section>
      <SearchBar
        query={query}
        source={source}
        loading={loading}
        onQueryChange={setQuery}
        onSourceChange={setSource}
        onSubmit={() => void runSearch()}
      />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <Stat label="Videos" value={byType.video} />
        <Stat label="Products" value={byType.product} />
        <Stat label="Papers" value={byType.paper} />
      </div>

      {error ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p> : null}
      {!error && sourceErrors.length > 0 ? (
        <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          {sourceErrors.join(' · ')}
        </p>
      ) : null}
      {!loading && !error && visibleItems.length === 0 ? (
        <p className="text-slate-600">
          {source === 'youtube'
            ? 'No videos found. Add YOUTUBE_API_KEY to backend/.env for YouTube results.'
            : 'No results for this filter. Try another source or query.'}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => (
          <ContentCard
            key={item.sourceId}
            item={item}
            showSaveActions
            onRequireAuth={onRequireAuth}
          />
        ))}
      </div>
    </section>
  );
}
