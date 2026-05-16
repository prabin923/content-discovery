'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { ContentItem } from '@discovery-hub/shared';
import { apiRequest, ApiError } from '../lib/api';
import { ensureContentId } from '../lib/content-actions';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../lib/toast';
import AddToCollectionModal from './features/AddToCollectionModal';
import Button from './common/Button';

interface Props {
  item: ContentItem;
  showSaveActions?: boolean;
  initialSaved?: boolean;
  onRequireAuth?: () => void;
  onSavedChange?: (saved: boolean) => void;
}

export default function ContentCard({
  item,
  showSaveActions = false,
  initialSaved = false,
  onRequireAuth,
  onSavedChange,
}: Props) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [saved, setSaved] = useState(initialSaved);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [resolvedItem, setResolvedItem] = useState(item);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setResolvedItem(item);
  }, [item]);

  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  const trackView = async (contentId: number) => {
    try {
      await apiRequest(`/api/content/${contentId}/view`, {
        method: 'POST',
        auth: Boolean(user),
      });
    } catch {
      // non-blocking
    }
  };

  const toggleSave = async () => {
    if (!user) {
      onRequireAuth?.();
      return;
    }

    setBusy(true);
    try {
      const contentId = resolvedItem.id ?? (await ensureContentId(resolvedItem));
      setResolvedItem((prev) => ({ ...prev, id: contentId }));

      if (saved) {
        await apiRequest(`/api/users/me/saved/${contentId}`, { method: 'DELETE', auth: true });
        setSaved(false);
        onSavedChange?.(false);
        showToast('Removed from saved', 'info');
      } else {
        await apiRequest(`/api/users/me/saved/${contentId}`, { method: 'POST', auth: true });
        setSaved(true);
        onSavedChange?.(true);
        showToast('Saved to your library', 'success');
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onRequireAuth?.();
      }
      showToast((err as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const openCollectionModal = () => {
    if (!user) {
      onRequireAuth?.();
      return;
    }
    setCollectionOpen(true);
  };

  const onOpenSource = async () => {
    if (resolvedItem.id) {
      void trackView(resolvedItem.id);
    }
  };

  return (
    <>
      <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {resolvedItem.thumbnailUrl ? (
          <div className="relative mb-3 h-40 w-full overflow-hidden rounded-lg">
            <Image
              src={resolvedItem.thumbnailUrl}
              alt={resolvedItem.title}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="mb-3 flex h-40 w-full items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            No preview
          </div>
        )}

        <div className="mb-2 flex items-center gap-2 text-xs">
          <span className="rounded-full bg-indigo-100 px-2 py-1 font-semibold capitalize text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {resolvedItem.type}
          </span>
          <span className="text-slate-500 dark:text-slate-400">{resolvedItem.sourcePlatform}</span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100">
          {resolvedItem.title}
        </h3>
        <p className="mb-4 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{resolvedItem.description}</p>

        <div className="mt-auto space-y-2">
          <div className="flex flex-wrap gap-1">
            {resolvedItem.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            {showSaveActions ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="px-2 py-1 text-xs"
                  onClick={() => void toggleSave()}
                  disabled={busy}
                >
                  {saved ? 'Unsave' : 'Save'}
                </Button>
                <Button variant="ghost" className="px-2 py-1 text-xs" onClick={openCollectionModal}>
                  Collection
                </Button>
              </div>
            ) : (
              <span />
            )}
            <a
              href={resolvedItem.sourceUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => void onOpenSource()}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Open
            </a>
          </div>
        </div>
      </article>

      <AddToCollectionModal
        item={resolvedItem}
        open={collectionOpen}
        onClose={() => setCollectionOpen(false)}
        onRequireAuth={() => onRequireAuth?.()}
        onSuccess={() => showToast('Added to collection', 'success')}
      />
    </>
  );
}
