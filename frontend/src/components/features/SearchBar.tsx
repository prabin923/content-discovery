'use client';

import type { FormEvent } from 'react';
import type { DiscoverMode, DiscoverSource } from '@discovery-hub/shared';

interface Props {
  query: string;
  source: DiscoverSource;
  mode: DiscoverMode;
  loading: boolean;
  page?: number;
  totalPages?: number;
  onQueryChange: (value: string) => void;
  onSourceChange: (value: DiscoverSource) => void;
  onModeChange: (value: DiscoverMode) => void;
  onSubmit: () => void;
  onPageChange?: (page: number) => void;
}

export default function SearchBar({
  query,
  source,
  mode,
  loading,
  page = 1,
  totalPages = 1,
  onQueryChange,
  onSourceChange,
  onModeChange,
  onSubmit,
  onPageChange,
}: Props) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onModeChange('live')}
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            mode === 'live'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Live APIs
        </button>
        <button
          type="button"
          onClick={() => onModeChange('library')}
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            mode === 'library'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Your library
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900 md:grid-cols-[1fr_180px_auto]"
      >
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={
            mode === 'library' ? 'Search synced content in your database' : 'Search for ideas, tools, or research'
          }
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-300 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
        />
        <select
          value={source}
          onChange={(event) => onSourceChange(event.target.value as DiscoverSource)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-300 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
        >
          <option value="all">All sources</option>
          <option value="youtube">Videos</option>
          <option value="products">Products</option>
          <option value="papers">Research papers</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Searching…' : mode === 'library' ? 'Search library' : 'Discover'}
        </button>
      </form>

      {mode === 'library' && totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3 text-sm">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange?.(page - 1)}
            className="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-50 dark:border-slate-600"
          >
            Previous
          </button>
          <span className="text-slate-600 dark:text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange?.(page + 1)}
            className="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-50 dark:border-slate-600"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
