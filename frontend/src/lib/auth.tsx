'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthResponse, User, UserProfileResponse } from '@discovery-hub/shared';
import { AuthContext, type AuthContextValue } from './auth-context';
import { apiRequest, getStoredToken, setStoredToken } from './api';

function mapProfileUser(row: UserProfileResponse['user']): User {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    firstName: row.first_name,
    lastName: row.last_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    interests: row.interests,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAuthUser(data: AuthResponse): User {
  return {
    id: data.user.id,
    email: data.user.email,
    username: data.user.username,
    createdAt: data.user.createdAt,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const stored = getStoredToken();
    if (!stored) {
      setUser(null);
      setToken(null);
      return;
    }

    const data = await apiRequest<UserProfileResponse>('/api/users/me', { auth: true });
    setUser(mapProfileUser(data.user));
    setToken(stored);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const stored = getStoredToken();
      if (!stored) {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }
      try {
        const data = await apiRequest<UserProfileResponse>('/api/users/me', { auth: true });
        if (!cancelled) {
          setUser(mapProfileUser(data.user));
          setToken(stored);
        }
      } catch {
        if (!cancelled) {
          setStoredToken(null);
          setUser(null);
          setToken(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  const applyAuth = useCallback((data: AuthResponse) => {
    setStoredToken(data.token);
    setToken(data.token);
    setUser(mapAuthUser(data));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiRequest<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      applyAuth(data);
      await refreshProfile();
    },
    [applyAuth, refreshProfile]
  );

  const register = useCallback(
    async (email: string, username: string, password: string) => {
      const data = await apiRequest<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, username, password }),
      });
      applyAuth(data);
      await refreshProfile();
    },
    [applyAuth, refreshProfile]
  );

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, loading, login, register, logout, refreshProfile }),
    [user, token, loading, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
