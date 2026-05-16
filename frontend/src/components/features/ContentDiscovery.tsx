'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ContentItem, DiscoverMode, DiscoverResponse, DiscoverSource, SearchResponse } from '@discovery-hub/shared';
import { apiRequest } from '../../lib/api';
import { mapDbRowToContentItem } from '../../lib/content';
import ContentCard from '../ContentCard';
import ContentCardSkeleton from '../common/ContentCardSkeleton';
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

function sourceToType(source: DiscoverSource): string | undefined {
  switch (source) {
    case 'youtube':
      return 'video';
    case 'products':
      return 'product';
    case 'papers':
      return 'paper';
    default:
      return undefined;
  }
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

interface Props {
  onRequireAuth?: () => void;
}

export default function ContentDiscovery({ onRequireAuth }: Props) {
  const [query, setQuery] = useState('technology');
  const [source, setSource] = useState<DiscoverSource>('all');
  const [mode, setMode] = useState<DiscoverMode>('live');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  const runLiveSearch = useCallback(async () => {
    const params = new URLSearchParams({ q: query, source, limit: '12' });
    const data = await apiRequest<DiscoverResponse>(`/api/content/discover?${params.toString()}`);
    setItems(data.items ?? []);
    setSourceErrors(data.errors ?? []);
    setTotalPages(1);

    if ((data.items?.length ?? 0) === 0 && (data.errors?.length ?? 0) > 0) {
      setError(data.errors.join(' · '));
    } else {
      setError(null);
    }
  }, [query, source]);

  const runLibrarySearch = useCallback(async () => {
    const type = sourceToType(source);
    const params = new URLSearchParams({ q: query, page: String(page), limit: '12' });
    if (type) {
      params.set('type', type);
    }

    const data = await apiRequest<SearchResponse & { totalPages: number }>(
      `/api/content/search?${params.toString()}`
    );
    setItems((data.items ?? []).map(mapDbRowToContentItem));
    setSourceErrors([]);
    setTotalPages(data.totalPages ?? 1);
    setError(data.total === 0 ? 'No library results. Run a live discover search or sync content first.' : null);
  }, [query, source, page]);

  const runSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSourceErrors([]);
    try {
      if (mode === 'library') {
        await runLibrarySearch();
      } else {
        await runLiveSearch();
      }
    } catch (err) {
      setError((err as Error).message);
      setItems([]);
      setSourceErrors([]);
    } finally {
      setLoading(false);
    }
  }, [mode, runLibrarySearch, runLiveSearch]);

  useEffect(() => {
    void runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, mode, page]);

  const onModeChange = (next: DiscoverMode) => {
    setMode(next);
    setPage(1);
  };

  return (
    <section>
      <SearchBar
        query={query}
        source={source}
        mode={mode}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onQueryChange={setQuery}
        onSourceChange={setSource}
        onModeChange={onModeChange}
        onSubmit={() => {
          setPage(1);
          void runSearch();
        }}
        onPageChange={setPage}
      />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <Stat label="Videos" value={byType.video} />
        <Stat label="Products" value={byType.product} />
        <Stat label="Papers" value={byType.paper} />
      </div>

      {error ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p> : null}
      {!error && sourceErrors.length > 0 ? (
        <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {sourceErrors.join(' · ')}
        </p>
      ) : null}
      {!loading && !error && visibleItems.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400">
          {mode === 'library'
            ? 'No library matches. Sync content via live discover or wait for the background sync job.'
            : source === 'youtube'
              ? 'No videos found. Add YOUTUBE_API_KEY to backend/.env for YouTube results.'
              : 'No results for this filter. Try another source or query.'}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <ContentCardSkeleton key={index} />)
          : visibleItems.map((item) => (
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
