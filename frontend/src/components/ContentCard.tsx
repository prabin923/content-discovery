'use client';

import { useState } from 'react';
import type { ContentItem } from '@discovery-hub/shared';
import { apiRequest, ApiError } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import Button from './common/Button';

interface Props {
  item: ContentItem;
  showSaveActions?: boolean;
  onRequireAuth?: () => void;
}

export default function ContentCard({ item, showSaveActions = false, onRequireAuth }: Props) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const saveItem = async () => {
    if (!item.id) {
      return;
    }
    if (!user) {
      onRequireAuth?.();
      return;
    }
    try {
      await apiRequest(`/api/users/me/saved/${item.id}`, { method: 'POST', auth: true });
      setSaved(true);
      setMessage('Saved');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onRequireAuth?.();
      }
      setMessage((err as Error).message);
    }
  };

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {item.thumbnailUrl ? (
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          className="mb-3 h-40 w-full rounded-lg object-cover"
        />
      ) : (
        <div className="mb-3 flex h-40 w-full items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500">
          No preview
        </div>
      )}

      <div className="mb-2 flex items-center gap-2 text-xs">
        <span className="rounded-full bg-indigo-100 px-2 py-1 font-semibold capitalize text-indigo-700">
          {item.type}
        </span>
        <span className="text-slate-500">{item.sourcePlatform}</span>
      </div>

      <h3 className="mb-2 line-clamp-2 text-base font-semibold text-slate-900">{item.title}</h3>
      <p className="mb-4 line-clamp-3 text-sm text-slate-600">{item.description}</p>

      <div className="mt-auto space-y-2">
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2">
          {showSaveActions && item.id ? (
            <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => void saveItem()} disabled={saved}>
              {saved ? 'Saved' : 'Save'}
            </Button>
          ) : (
            <span />
          )}
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Open
          </a>
        </div>
        {message ? <p className="text-xs text-slate-500">{message}</p> : null}
      </div>
    </article>
  );
}
