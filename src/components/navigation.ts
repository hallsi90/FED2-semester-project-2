import { ROUTES } from "../constants/routes";
import { getAuthState } from "../utils/auth-state";

// Creates the shared navigation markup for logged-out and logged-in users across desktop and mobile views.

function createMenuButtonIcon(): string {
  return `
    <span class="relative flex h-5 w-5 items-center justify-center">
      <svg
        data-menu-icon="open"
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </svg>

      <svg
        data-menu-icon="close"
        xmlns="http://www.w3.org/2000/svg"
        class="hidden h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
      </svg>
    </span>
  `;
}

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
  avatarUrl?: string,
  avatarAlt?: string,
): string {
  const safeProfileName = profileName.trim() || "User";
  const safeAvatarUrl = avatarUrl?.trim() || "";
  const safeAvatarAlt = avatarAlt?.trim() || `${safeProfileName} avatar`;

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
            class="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border-neutral bg-white text-text-main transition hover:border-primary-action hover:text-primary-action"
          >
            ${
              safeAvatarUrl
                ? `
                  <img
                    src="${safeAvatarUrl}"
                    alt="${safeAvatarAlt}"
                    class="h-full w-full object-cover"
                  />
                `
                : `
                  <span class="text-sm font-semibold">${safeProfileName.charAt(0).toUpperCase()}</span>
                `
            }
          </button>

          <div
            id="profile-menu"
            class="absolute right-0 top-full z-50 mt-4 hidden w-44 rounded-2xl border border-border-neutral bg-white p-3 shadow-2xl ring-1 ring-black/10 md:mt-5 lg:mt-6"
          >
            <ul class="space-y-2 text-sm font-medium">
              <li>
                <a href="${ROUTES.profile}" class="block rounded-lg px-2 py-2.5 text-text-main transition hover:bg-background hover:text-primary-action">
                  Profile
                </a>
              </li>
              <li>
                <button
                  id="logout-button-desktop"
                  type="button"
                  class="block w-full rounded-lg px-2 py-2.5 text-left text-text-main transition hover:bg-background hover:text-primary-action cursor-pointer"
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
        class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border-neutral bg-white text-text-main transition hover:border-primary-action hover:text-primary-action"
      >
        ${createMenuButtonIcon()}
      </button>

      <div
        id="mobile-menu"
        class="absolute right-0 top-full z-50 mt-4 hidden w-52 rounded-2xl border border-border-neutral bg-white p-4 shadow-2xl ring-1 ring-black/10 sm:w-56"
      >
        <nav aria-label="Mobile navigation">
          <ul class="space-y-1 text-sm font-medium">
            <li>
              <a href="${ROUTES.home}" class="block rounded-lg px-2 py-2.5 text-text-main transition hover:bg-background hover:text-primary-action">
                Listings
              </a>
            </li>
            <li>
              <a href="${ROUTES.login}" class="block rounded-lg px-2 py-2.5 text-text-main transition hover:bg-background hover:text-primary-action">
                Log in
              </a>
            </li>
            <li>
              <a href="${ROUTES.register}" class="block rounded-lg px-2 py-2.5 text-text-main transition hover:bg-background hover:text-primary-action">
                Register
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  `;
}

function createLoggedInMobileNavigation(
  profileName: string,
  credits: number,
  avatarUrl?: string,
  avatarAlt?: string,
): string {
  const safeProfileName = profileName.trim() || "User";
  const safeAvatarUrl = avatarUrl?.trim() || "";
  const safeAvatarAlt = avatarAlt?.trim() || `${safeProfileName} avatar`;

  return `
    <div class="relative md:hidden">
      <button
        id="mobile-menu-button"
        type="button"
        aria-label="Open account menu"
        aria-expanded="false"
        aria-controls="mobile-menu"
        class="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border-neutral bg-white text-text-main transition hover:border-primary-action hover:text-primary-action"
      >
        ${
          safeAvatarUrl
            ? `
              <img
                src="${safeAvatarUrl}"
                alt="${safeAvatarAlt}"
                class="h-full w-full object-cover"
              />
            `
            : `
              <span class="text-sm font-semibold">${safeProfileName.charAt(0).toUpperCase()}</span>
            `
        }
      </button>

      <div
        id="mobile-menu"
        class="absolute right-0 top-full z-50 mt-4 hidden w-56 rounded-2xl border border-border-neutral bg-white p-4 shadow-2xl ring-1 ring-black/10 sm:w-64"
      >
        <div class="mb-4 rounded-xl bg-background px-3 py-2 text-sm font-semibold text-primary-action">
          Credits: ${(credits ?? 0).toLocaleString("en-US")}
        </div>

        <nav aria-label="Mobile navigation">
          <ul class="space-y-1 text-sm font-medium">
            <li>
              <a href="${ROUTES.home}" class="block rounded-lg px-2 py-2.5 text-text-main transition hover:bg-background hover:text-primary-action">
                Listings
              </a>
            </li>
            <li>
              <a href="${ROUTES.createListing}" class="block rounded-lg px-2 py-2.5 text-text-main transition hover:bg-background hover:text-primary-action">
                Create listing
              </a>
            </li>
            <li>
              <a href="${ROUTES.profile}" class="block rounded-lg px-2 py-2.5 text-text-main transition hover:bg-background hover:text-primary-action">
                Profile
              </a>
            </li>
            <li>
              <button
                id="logout-button-mobile"
                type="button"
                class="block w-full rounded-lg px-2 py-2.5 text-left text-text-main transition hover:bg-background hover:text-primary-action cursor-pointer"
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
          authState.profile.name?.trim() || "User",
          authState.profile.credits ?? 0,
          authState.profile.avatar?.url,
          authState.profile.avatar?.alt,
        )}
        ${createLoggedInMobileNavigation(
          authState.profile.name?.trim() || "User",
          authState.profile.credits ?? 0,
          authState.profile.avatar?.url,
          authState.profile.avatar?.alt,
        )}
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
