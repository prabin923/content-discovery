'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import type {
  CollectionDetailResponse,
  CollectionSummary,
  PublicCollectionsResponse,
} from '@discovery-hub/shared';
import { apiRequest, ApiError } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import Card from '../common/Card';

interface Props {
  onRequireAuth: () => void;
}

export default function CollectionsView({ onRequireAuth }: Props) {
  const { user } = useAuth();
  const [publicCollections, setPublicCollections] = useState<CollectionSummary[]>([]);
  const [myCollections, setMyCollections] = useState<CollectionSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<CollectionDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const loadLists = useCallback(async () => {
    const pub = await apiRequest<PublicCollectionsResponse>('/api/collections/public');
    const mine = user
      ? await apiRequest<PublicCollectionsResponse>('/api/collections/mine', { auth: true })
      : { collections: [] as CollectionSummary[] };
    return { publicList: pub.collections ?? [], myList: mine.collections ?? [] };
  }, [user]);

  const loadDetail = useCallback(async (id: number) => {
    return apiRequest<CollectionDetailResponse>(`/api/collections/${id}`);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const { publicList, myList } = await loadLists();
        if (!cancelled) {
          setPublicCollections(publicList);
          setMyCollections(myList);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
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
  }, [loadLists]);

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      onRequireAuth();
      return;
    }
    setCreating(true);
    setError(null);
    try {
      await apiRequest<{ collection: CollectionSummary }>('/api/collections', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ title, description, isPublic: true }),
      });
      setTitle('');
      setDescription('');
      setShowCreate(false);
      setLoading(true);
      const { publicList, myList } = await loadLists();
      setPublicCollections(publicList);
      setMyCollections(myList);
      setLoading(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onRequireAuth();
      }
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const onRemoveItem = async (collectionId: number, contentId: number) => {
    if (!user) {
      onRequireAuth();
      return;
    }
    try {
      await apiRequest(`/api/collections/${collectionId}/items/${contentId}`, {
        method: 'DELETE',
        auth: true,
      });
      if (selectedId === collectionId) {
        const data = await loadDetail(collectionId);
        setDetail(data);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onRequireAuth();
      }
      setError((err as Error).message);
    }
  };

  const onVote = async (collectionId: number, voteType: 'upvote' | 'downvote') => {
    if (!user) {
      onRequireAuth();
      return;
    }
    try {
      await apiRequest(`/api/collections/${collectionId}/vote`, {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ voteType }),
      });
      if (selectedId === collectionId) {
        const data = await loadDetail(collectionId);
        setDetail(data);
      }
      const { publicList, myList } = await loadLists();
      setPublicCollections(publicList);
      setMyCollections(myList);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onRequireAuth();
      }
      setError((err as Error).message);
    }
  };

  const renderCollectionCard = (collection: CollectionSummary) => (
    <button
      key={collection.id}
      type="button"
      onClick={() => {
        setDetailLoading(true);
        void loadDetail(collection.id)
          .then((data) => {
            setDetail(data);
            setSelectedId(collection.id);
            setError(null);
          })
          .catch((err) => setError((err as Error).message))
          .finally(() => setDetailLoading(false));
      }}
      className={`w-full rounded-xl border p-4 text-left transition hover:border-indigo-300 hover:shadow-sm ${
        selectedId === collection.id ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 bg-white'
      }`}
    >
      <h3 className="font-semibold text-slate-900">{collection.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{collection.description ?? 'No description'}</p>
      <p className="mt-2 text-xs text-slate-500">
        by {collection.username} · {collection.upvote_count} votes
      </p>
    </button>
  );

  return (
    <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Collections</h2>
          {user ? (
            <Button variant="secondary" onClick={() => setShowCreate((v) => !v)}>
              {showCreate ? 'Cancel' : 'New'}
            </Button>
          ) : (
            <Button variant="secondary" onClick={onRequireAuth}>
              Sign in to create
            </Button>
          )}
        </div>

        {showCreate && user ? (
          <Card>
            <form onSubmit={(e) => void onCreate(e)} className="space-y-3">
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Collection title"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <Button type="submit" className="w-full" disabled={creating}>
                {creating ? 'Creating…' : 'Create collection'}
              </Button>
            </form>
          </Card>
        ) : null}

        {loading ? <p className="text-sm text-slate-500">Loading…</p> : null}
        {error ? <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}

        {user && myCollections.length > 0 ? (
          <div>
            <h3 className="mb-2 text-sm font-medium text-slate-700">Your collections</h3>
            <div className="space-y-2">{myCollections.map(renderCollectionCard)}</div>
          </div>
        ) : null}

        <div>
          <h3 className="mb-2 text-sm font-medium text-slate-700">Community</h3>
          <div className="space-y-2">
            {publicCollections.length === 0 && !loading ? (
              <p className="text-sm text-slate-500">No public collections yet.</p>
            ) : (
              publicCollections.map(renderCollectionCard)
            )}
          </div>
        </div>
      </div>

      <div>
        {detailLoading ? <p className="text-slate-600">Loading collection…</p> : null}
        {!detail && !detailLoading ? (
          <Card className="text-center text-slate-500">Select a collection to view its items.</Card>
        ) : null}
        {detail ? (
          <Card>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{detail.collection.title}</h2>
                <p className="mt-1 text-slate-600">{detail.collection.description ?? 'No description'}</p>
                <p className="mt-2 text-sm text-slate-500">
                  Curated by {detail.collection.username} · {detail.collection.upvote_count} votes
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => void onVote(detail.collection.id, 'upvote')}>
                  Upvote
                </Button>
                <Button variant="ghost" onClick={() => void onVote(detail.collection.id, 'downvote')}>
                  Downvote
                </Button>
              </div>
            </div>

            {detail.items.length === 0 ? (
              <p className="text-sm text-slate-500">This collection has no items yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {detail.items.map((item) => (
                  <li key={item.content_id} className="flex gap-3 py-3">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt=""
                        className="h-16 w-24 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
                        —
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs capitalize text-indigo-600">{item.type}</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{item.title}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          Open source
                        </a>
                        {user?.id === detail.collection.curator_id ? (
                          <button
                            type="button"
                            onClick={() => void onRemoveItem(detail.collection.id, item.content_id)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ) : null}
      </div>
    </section>
  );
}
