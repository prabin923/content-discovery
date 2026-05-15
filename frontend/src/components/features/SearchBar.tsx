'use client';

import type { FormEvent } from 'react';
import type { DiscoverSource } from '@discovery-hub/shared';

interface Props {
  query: string;
  source: DiscoverSource;
  loading: boolean;
  onQueryChange: (value: string) => void;
  onSourceChange: (value: DiscoverSource) => void;
  onSubmit: () => void;
}

export default function SearchBar({
  query,
  source,
  loading,
  onQueryChange,
  onSourceChange,
  onSubmit,
}: Props) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_auto]"
    >
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search for ideas, tools, or research"
        className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-indigo-300 focus:ring-2"
      />
      <select
        value={source}
        onChange={(event) => onSourceChange(event.target.value as DiscoverSource)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-indigo-300 focus:ring-2"
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
        {loading ? 'Searching…' : 'Discover'}
      </button>
    </form>
  );
}
