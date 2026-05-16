'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ThemePreference } from '@discovery-hub/shared';
import { apiRequest } from './api';
import { useAuth } from '@/hooks/useAuth';

interface ThemeContextValue {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemePreference) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  root.classList.toggle('dark', isDark);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [theme, setThemeState] = useState<ThemePreference>('system');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!user || !token) {
      setThemeState('system');
      applyTheme('system');
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
        // use default
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
      applyTheme(next);
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

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
