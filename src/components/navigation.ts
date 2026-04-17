import { STORAGE_KEYS } from "../constants/storage";
import { getFromStorage } from "../utils/helpers";
import type { AuthUser } from "../types/api";

function createLoggedOutDesktopNavigation(): string {
  return `
    <nav aria-label="Desktop navigation" class="hidden md:block">
      <ul class="flex items-center gap-6 text-sm font-medium">
        <li>
          <a href="/" class="text-[#111827] transition hover:text-[#2563EB]">
            Listings
          </a>
        </li>
        <li>
          <a href="/login/" class="text-[#111827] transition hover:text-[#2563EB]">
            Log in
          </a>
        </li>
        <li>
          <a
            href="/register/"
            class="rounded-xl bg-[#2563EB] px-4 py-2 text-white transition hover:bg-[#1D4ED8]"
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
          <a href="/" class="text-[#111827] transition hover:text-[#2563EB]">
            Listings
          </a>
        </li>
        <li>
          <a href="/listing/create/" class="text-[#111827] transition hover:text-[#2563EB]">
            Create listing
          </a>
        </li>
        <li>
          <span class="rounded-full bg-[#EFF6FF] px-3 py-1 text-sm font-semibold text-[#1D4ED8]">
            Credits: ${credits}
          </span>
        </li>
        <li class="relative">
          <button
            id="profile-menu-button"
            type="button"
            aria-label="Open profile menu"
            aria-expanded="false"
            aria-controls="profile-menu"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-[#D1D5DB] bg-white text-[#111827] transition hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            <span class="text-sm font-semibold">${profileName.charAt(0).toUpperCase()}</span>
          </button>

          <div
            id="profile-menu"
            class="absolute right-0 top-full z-50 mt-3 hidden w-44 rounded-2xl border border-[#D1D5DB] bg-white p-3 shadow-md"
          >
            <ul class="space-y-2 text-sm font-medium">
              <li>
                <a href="/profile/" class="block text-[#111827] transition hover:text-[#2563EB]">
                  Profile
                </a>
              </li>
              <li>
                <button
                  type="button"
                  class="block text-[#111827] transition hover:text-[#2563EB]"
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
        class="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D1D5DB] bg-white text-[#111827] transition hover:border-[#2563EB] hover:text-[#2563EB]"
      >
        <span class="text-xl leading-none">☰</span>
      </button>

      <div
        id="mobile-menu"
        class="absolute right-0 top-full z-50 mt-3 hidden w-64 rounded-2xl border border-[#D1D5DB] bg-white p-4 shadow-md"
      >
        <nav aria-label="Mobile navigation">
          <ul class="space-y-3 text-sm font-medium">
            <li>
              <a href="/" class="block text-[#111827] transition hover:text-[#2563EB]">
                Listings
              </a>
            </li>
            <li>
              <a href="/login/" class="block text-[#111827] transition hover:text-[#2563EB]">
                Log in
              </a>
            </li>
            <li>
              <a href="/register/" class="block text-[#111827] transition hover:text-[#2563EB]">
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
        class="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D1D5DB] bg-white text-[#111827] transition hover:border-[#2563EB] hover:text-[#2563EB]"
      >
        <span class="text-xl leading-none">☰</span>
      </button>

      <div
        id="mobile-menu"
        class="absolute right-0 top-full z-50 mt-3 hidden w-64 rounded-2xl border border-[#D1D5DB] bg-white p-4 shadow-md"
      >
        <div class="mb-4 rounded-xl bg-[#EFF6FF] px-3 py-2 text-sm font-semibold text-[#1D4ED8]">
          Credits: ${credits}
        </div>

        <nav aria-label="Mobile navigation">
          <ul class="space-y-3 text-sm font-medium">
            <li>
              <a href="/" class="block text-[#111827] transition hover:text-[#2563EB]">
                Listings
              </a>
            </li>
            <li>
              <a href="/listing/create/" class="block text-[#111827] transition hover:text-[#2563EB]">
                Create listing
              </a>
            </li>
            <li>
              <a href="/profile/" class="block text-[#111827] transition hover:text-[#2563EB]">
                Profile
              </a>
            </li>
            <li>
              <button
                type="button"
                class="block text-[#111827] transition hover:text-[#2563EB]"
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
  const profile = getFromStorage<AuthUser>(STORAGE_KEYS.profile);
  const isLoggedIn = Boolean(localStorage.getItem(STORAGE_KEYS.accessToken));

  if (isLoggedIn && profile) {
    return `
      <div class="relative flex items-center gap-3">
        ${createLoggedInDesktopNavigation(profile.name, profile.credits)}
        ${createLoggedInMobileNavigation(profile.credits)}
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
