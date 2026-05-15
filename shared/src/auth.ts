export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  interests?: string[] | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    createdAt?: string;
  };
}

export interface UserProfileResponse {
  user: {
    id: number;
    email: string;
    username: string;
    first_name?: string | null;
    last_name?: string | null;
    bio?: string | null;
    avatar_url?: string | null;
    interests?: string[] | null;
    created_at?: string;
    updated_at?: string;
  };
}
