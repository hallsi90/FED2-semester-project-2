import { getAccessToken, getProfile } from "./auth-storage";
import type { Profile } from "../types/api";

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  profile: Profile | null;
}

// Returns the current authentication state from localStorage.
export function getAuthState(): AuthState {
  const accessToken = getAccessToken();
  const profile = getProfile();

  return {
    isAuthenticated: Boolean(accessToken && profile),
    accessToken,
    profile,
  };
}
