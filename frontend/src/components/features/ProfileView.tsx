'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import type { UserProfileResponse } from '@discovery-hub/shared';
import { apiRequest, ApiError } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

interface Props {
  onRequireAuth: () => void;
}

const SUGGESTED_INTERESTS = ['technology', 'ai', 'research', 'startups', 'design', 'science'];

export default function ProfileView({ onRequireAuth }: Props) {
  const { user, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [interestsText, setInterestsText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<UserProfileResponse>('/api/users/me', { auth: true });
      const profile = data.user;
      setFirstName(profile.first_name ?? '');
      setLastName(profile.last_name ?? '');
      setBio(profile.bio ?? '');
      setInterestsText((profile.interests ?? []).join(', '));
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
      void loadProfile();
    }
  }, [user, loadProfile]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      onRequireAuth();
      return;
    }

    const interests = interestsText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await apiRequest<UserProfileResponse>('/api/users/me', {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify({
          firstName: firstName.trim() || null,
          lastName: lastName.trim() || null,
          bio: bio.trim() || null,
          interests,
        }),
      });
      setMessage('Profile updated. Your For You feed will use these interests.');
      await refreshProfile();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const addInterest = (tag: string) => {
    const current = interestsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (!current.includes(tag)) {
      setInterestsText([...current, tag].join(', '));
    }
  };

  if (!user) {
    return (
      <Card className="text-center">
        <p className="mb-4 text-slate-600">Sign in to manage your profile and interests.</p>
        <Button onClick={onRequireAuth}>Sign in</Button>
      </Card>
    );
  }

  if (loading) {
    return <p className="text-slate-600">Loading profile…</p>;
  }

  return (
    <Card className="max-w-xl">
      <h2 className="mb-1 text-lg font-semibold text-slate-900">Profile</h2>
      <p className="mb-4 text-sm text-slate-500">
        Signed in as {user.email} ({user.username})
      </p>

      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-slate-600">First name</span>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Last name</span>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="text-slate-600">Bio</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="text-slate-600">Interests (comma-separated)</span>
          <input
            value={interestsText}
            onChange={(e) => setInterestsText(e.target.value)}
            placeholder="technology, ai, research"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {SUGGESTED_INTERESTS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addInterest(tag)}
              className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 hover:bg-indigo-100 hover:text-indigo-700"
            >
              + {tag}
            </button>
          ))}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-green-700">{message}</p> : null}

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save profile'}
        </Button>
      </form>
    </Card>
  );
}
