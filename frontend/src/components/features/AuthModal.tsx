'use client';

import { useState, type FormEvent } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import { useAuth } from '../../hooks/useAuth';
import { ApiError } from '../../lib/api';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Mode = 'login' | 'register';

export default function AuthModal({ open, onClose, onSuccess }: Props) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return null;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, username, password);
      }
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <Card className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={(e) => void onSubmit(e)} className="space-y-3">
          <label className="block text-sm">
            <span className="text-slate-600">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          {mode === 'register' ? (
            <label className="block text-sm">
              <span className="text-slate-600">Username</span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          ) : null}

          <label className="block text-sm">
            <span className="text-slate-600">Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            {mode === 'register' ? (
              <span className="mt-1 block text-xs text-slate-500">
                At least 8 characters, one uppercase letter, and one number.
              </span>
            ) : null}
          </label>

          {error ? <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Register'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            className="font-medium text-indigo-600 hover:text-indigo-500"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </Card>
    </div>
  );
}
