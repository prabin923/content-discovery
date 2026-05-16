'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ThemePreference } from '@discovery-hub/shared';
import { apiRequest } from './api';
import { useAuth } from '@/hooks/useAuth';

const STORAGE_KEY = 'discovery-hub-theme';

interface ThemeContextValue {
  theme: ThemePreference;
  isDark: boolean;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveIsDark(theme: ThemePreference): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  if (theme === 'dark') {
    return true;
  }
  if (theme === 'light') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme: ThemePreference) {
  const root = document.documentElement;
  root.classList.toggle('dark', resolveIsDark(theme));
}

function readStoredTheme(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system';
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [theme, setThemeState] = useState<ThemePreference>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setThemeState(readStoredTheme());
  }, []);

  useEffect(() => {
    applyTheme(theme);
    setIsDark(resolveIsDark(theme));
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') {
      return;
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      applyTheme('system');
      setIsDark(resolveIsDark('system'));
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  useEffect(() => {
    if (!user || !token) {
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const data = await apiRequest<{ preferences: { theme: ThemePreference } }>('/api/users/me/preferences', {
          auth: true,
        });
        if (!cancelled && data.preferences?.theme) {
          setThemeState(data.preferences.theme);
        }
      } catch {
        // keep local storage theme
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [user, token]);

  const setTheme = useCallback(
    (next: ThemePreference) => {
      setThemeState(next);
      if (user && token) {
        void apiRequest('/api/users/me/preferences', {
          method: 'PATCH',
          auth: true,
          body: JSON.stringify({ theme: next }),
        });
      }
    },
    [user, token]
  );

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  const value = useMemo(
    () => ({ theme, isDark, setTheme, toggleTheme }),
    [theme, isDark, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
