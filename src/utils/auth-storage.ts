import { STORAGE_KEYS } from "../constants/storage";
import { getFromStorage, removeFromStorage, saveToStorage } from "./helpers";
import type { Profile } from "../types/api";

interface StoredAuth {
  accessToken: string;
  profile: Profile;
}

// Saves authentication data after successful login.
export function saveAuth(auth: StoredAuth): void {
  localStorage.setItem(STORAGE_KEYS.accessToken, auth.accessToken);
  saveToStorage(STORAGE_KEYS.profile, auth.profile);
}

// Returns the saved access token, or null if missing.
export function getAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.accessToken);
}

// Returns the saved profile, or null if missing/invalid.
export function getProfile(): Profile | null {
  return getFromStorage<Profile>(STORAGE_KEYS.profile);
}

// Returns true if the user appears to be logged in.
export function isLoggedIn(): boolean {
  return Boolean(getAccessToken());
}

// Clears all saved authentication data.
export function clearAuth(): void {
  removeFromStorage(STORAGE_KEYS.profile);
  localStorage.removeItem(STORAGE_KEYS.accessToken);
}
