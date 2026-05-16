export type ThemePreference = 'light' | 'dark' | 'system';

export interface UserPreferences {
  preferred_categories: string[] | null;
  notification_enabled: boolean;
  email_digest: boolean;
  theme: ThemePreference;
}

export interface UserPreferencesResponse {
  preferences: UserPreferences;
}

export interface UpdateUserPreferencesRequest {
  preferredCategories?: string[];
  notificationEnabled?: boolean;
  emailDigest?: boolean;
  theme?: ThemePreference;
}
