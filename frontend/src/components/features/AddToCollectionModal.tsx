'use client';

import { useEffect, useState } from 'react';
import type { CollectionSummary, ContentItem, PublicCollectionsResponse } from '@discovery-hub/shared';
import { apiRequest, ApiError } from '@/lib/api';
import { ensureContentId } from '@/lib/content-actions';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/common/Card';

interface Props {
  item: ContentItem | null;
  open: boolean;
  onClose: () => void;
  onRequireAuth: () => void;
  onSuccess?: () => void;
}

export default function AddToCollectionModal({ item, open, onClose, onRequireAuth, onSuccess }: Props) {
  const { user } = useAuth();
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !user) {
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiRequest<PublicCollectionsResponse>('/api/collections/mine', { auth: true });
        if (!cancelled) {
          setCollections(data.collections ?? []);
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

    void load();
    return () => {
      cancelled = true;
    };
  }, [open, user, onRequireAuth]);

  if (!open || !item) {
    return null;
  }

  const addToCollection = async (collectionId: number) => {
    if (!user) {
      onRequireAuth();
      return;
    }

    setAddingId(collectionId);
    setError(null);
    setMessage(null);
    try {
      const contentId = await ensureContentId(item);
      await apiRequest(`/api/collections/${collectionId}/items`, {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ contentId }),
      });
      setMessage(`Added to "${collections.find((c) => c.id === collectionId)?.title ?? 'collection'}"`);
      onSuccess?.();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onRequireAuth();
      }
      setError((err as Error).message);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <Card className="max-h-[80vh] w-full max-w-md overflow-y-auto">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Add to collection</h2>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.title}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            ✕
          </button>
        </div>

        {loading ? <p className="text-sm text-slate-500">Loading your collections…</p> : null}
        {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
        {message ? <p className="mb-3 text-sm text-green-700">{message}</p> : null}

        {!loading && collections.length === 0 ? (
          <p className="text-sm text-slate-600">Create a collection first from the Collections tab.</p>
        ) : null}

        <ul className="space-y-2">
          {collections.map((collection) => (
            <li key={collection.id}>
              <button
                type="button"
                disabled={addingId !== null}
                onClick={() => void addToCollection(collection.id)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50"
              >
                <span className="font-medium text-slate-900">{collection.title}</span>
                {addingId === collection.id ? (
                  <span className="ml-2 text-indigo-600">Adding…</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
