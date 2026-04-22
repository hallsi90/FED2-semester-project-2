// navigation.ts
// Creates the shared navigation markup for logged-out and logged-in users across desktop and mobile views.

import { ROUTES } from "../constants/routes";
import { getAuthState } from "../utils/auth-state";

function createLoggedOutDesktopNavigation(): string {
  return `
    <nav aria-label="Desktop navigation" class="hidden md:block">
      <ul class="flex items-center gap-6 text-sm font-medium">
        <li>
          <a href="${ROUTES.home}" class="text-text-main transition hover:text-primary-action">
            Listings
          </a>
        </li>
        <li>
          <a href="${ROUTES.login}" class="text-text-main transition hover:text-primary-action">
            Log in
          </a>
        </li>
        <li>
          <a
            href="${ROUTES.register}"
            class="rounded-xl bg-primary-action px-4 py-2 text-white transition hover:bg-primary-action-hover"
          >
            Register
          </a>
        </li>
      </ul>
    </nav>
  `;
}

function createLoggedInDesktopNavigation(
  profileName: string,
  credits: number,
): string {
  return `
    <nav aria-label="Desktop navigation" class="hidden md:block">
      <ul class="flex items-center gap-6 text-sm font-medium">
        <li>
          <a href="${ROUTES.home}" class="text-text-main transition hover:text-primary-action">
            Listings
          </a>
        </li>
        <li>
          <a href="${ROUTES.createListing}" class="text-text-main transition hover:text-primary-action">
            Create listing
          </a>
        </li>
        <li>
          <span class="rounded-full bg-background px-3 py-1 text-sm font-semibold text-primary-action">
            Credits: ${(credits ?? 0).toLocaleString("en-US")}
          </span>
        </li>
        <li class="relative">
          <button
            id="profile-menu-button"
            type="button"
            aria-label="Open profile menu"
            aria-expanded="false"
            aria-controls="profile-menu"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-border-neutral bg-white text-text-main transition hover:border-primary-action hover:text-primary-action"
          >
            <span class="text-sm font-semibold">${profileName.charAt(0).toUpperCase()}</span>
          </button>

          <div
            id="profile-menu"
            class="absolute right-0 top-full z-50 mt-3 hidden w-44 rounded-2xl border border-border-neutral bg-white p-3 shadow-md"
          >
            <ul class="space-y-2 text-sm font-medium">
              <li>
                <a href="${ROUTES.profile}" class="block text-text-main transition hover:text-primary-action">
                  Profile
                </a>
              </li>
              <li>
                <button
                  id="logout-button-desktop"
                  type="button"
                  class="block text-text-main transition hover:text-primary-action"
                >
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  `;
}

function createLoggedOutMobileNavigation(): string {
  return `
    <div class="relative md:hidden">
      <button
        id="mobile-menu-button"
        type="button"
        aria-label="Open menu"
        aria-expanded="false"
        aria-controls="mobile-menu"
        class="flex h-10 w-10 items-center justify-center rounded-lg border border-border-neutral bg-white text-text-main transition hover:border-primary-action hover:text-primary-action"
      >
        <span class="text-xl leading-none">☰</span>
      </button>

      <div
        id="mobile-menu"
        class="absolute right-0 top-full z-50 mt-3 hidden w-64 rounded-2xl border border-border-neutral bg-white p-4 shadow-md"
      >
        <nav aria-label="Mobile navigation">
          <ul class="space-y-3 text-sm font-medium">
            <li>
              <a href="${ROUTES.home}" class="block text-text-main transition hover:text-primary-action">
                Listings
              </a>
            </li>
            <li>
              <a href="${ROUTES.login}" class="block text-text-main transition hover:text-primary-action">
                Log in
              </a>
            </li>
            <li>
              <a href="${ROUTES.register}" class="block text-text-main transition hover:text-primary-action">
                Register
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  `;
}

function createLoggedInMobileNavigation(credits: number): string {
  return `
    <div class="relative md:hidden">
      <button
        id="mobile-menu-button"
        type="button"
        aria-label="Open menu"
        aria-expanded="false"
        aria-controls="mobile-menu"
        class="flex h-10 w-10 items-center justify-center rounded-lg border border-border-neutral bg-white text-text-main transition hover:border-primary-action hover:text-primary-action"
      >
        <span class="text-xl leading-none">☰</span>
      </button>

      <div
        id="mobile-menu"
        class="absolute right-0 top-full z-50 mt-3 hidden w-64 rounded-2xl border border-border-neutral bg-white p-4 shadow-md"
      >
        <div class="mb-4 rounded-xl bg-background px-3 py-2 text-sm font-semibold text-primary-action">
          Credits: ${(credits ?? 0).toLocaleString("en-US")}
        </div>

        <nav aria-label="Mobile navigation">
          <ul class="space-y-3 text-sm font-medium">
            <li>
              <a href="${ROUTES.home}" class="block text-text-main transition hover:text-primary-action">
                Listings
              </a>
            </li>
            <li>
              <a href="${ROUTES.createListing}" class="block text-text-main transition hover:text-primary-action">
                Create listing
              </a>
            </li>
            <li>
              <a href="${ROUTES.profile}" class="block text-text-main transition hover:text-primary-action">
                Profile
              </a>
            </li>
            <li>
              <button
                id="logout-button-mobile"
                type="button"
                class="block text-text-main transition hover:text-primary-action"
              >
                Log out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  `;
}

export function createNavigation(): string {
  const authState = getAuthState();

  if (authState.isAuthenticated && authState.profile) {
    return `
      <div class="relative flex items-center gap-3">
        ${createLoggedInDesktopNavigation(
          authState.profile.name,
          authState.profile.credits,
        )}
        ${createLoggedInMobileNavigation(authState.profile.credits)}
      </div>
    `;
  }

  return `
    <div class="flex items-center gap-3">
      ${createLoggedOutDesktopNavigation()}
      ${createLoggedOutMobileNavigation()}
    </div>
  `;
}
