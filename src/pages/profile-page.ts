import { buttonStyles, cardStyles } from "../components/ui";
import { createListingCard } from "../components/listing-card";
import type { Listing, Profile } from "../types/api";

interface ProfilePageData {
  profile: Profile;
  createdListings: Listing[];
  bidListings: Listing[];
}

// Creates the profile page layout for preview and later profile logic.
export function createProfilePage(data: ProfilePageData): string {
  const avatarUrl =
    data.profile.avatar?.url ||
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80";

  const avatarAlt = data.profile.avatar?.alt || `${data.profile.name} avatar`;
  const bio = data.profile.bio?.trim() || "No bio added yet.";
  const credits = data.profile.credits ?? 0;

  const sortedCreatedListings = [...data.createdListings].sort((a, b) => {
    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });

  const sortedBidListings = [...data.bidListings].sort((a, b) => {
    return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
  });

  const createdListingsMarkup =
    sortedCreatedListings.length > 0
      ? sortedCreatedListings
          .map((listing) => createListingCard(listing))
          .join("")
      : `
        <div class="${cardStyles.base} md:col-span-2">
          <p class="text-sm text-text-muted">
            You have not created any listings yet.
          </p>
        </div>
      `;

  const bidListingsMarkup =
    sortedBidListings.length > 0
      ? sortedBidListings.map((listing) => createListingCard(listing)).join("")
      : `
        <div class="${cardStyles.base} md:col-span-2">
          <p class="text-sm text-text-muted">
            You have not placed any bids yet.
          </p>
        </div>
      `;

  return `
    <section class="space-y-8">
      <header>
        <h1 class="text-3xl font-bold text-text-main md:text-4xl">
          ${data.profile.name}
        </h1>
      </header>

      <section class="${cardStyles.base}">
        <div class="space-y-6">
          <div class="flex flex-col items-center gap-5 text-center md:flex-row md:items-center md:gap-6 md:text-left">
            <img
              src="${avatarUrl}"
              alt="${avatarAlt}"
              class="h-28 w-28 rounded-full object-cover md:h-30 md:w-30"
            />

            <div class="w-full max-w-xl">
              <p class="text-base leading-8 text-text-muted text-center md:text-left">
                ${bio}
              </p>
            </div>
          </div>

          <div class="rounded-xl bg-background px-5 py-4 text-left">
            <p class="text-sm font-medium text-text-muted">Credits balance</p>
            <p class="mt-2 text-3xl font-bold text-primary-action">
              ${credits}
            </p>
          </div>

          <div class="text-left">
            <a href="/profile/edit/" class="${buttonStyles.secondary}">
              Edit profile
            </a>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <button
          id="created-listings-toggle"
          type="button"
          aria-expanded="true"
          aria-controls="created-listings-content"
          class="group flex w-full cursor-pointer items-end justify-between gap-4 text-left transition"
        >
          <div class="space-y-1">
            <h2 class="text-2xl font-semibold text-text-main transition group-hover:text-primary-action">
              My listings
            </h2>
            <p class="text-sm text-text-muted transition group-hover:text-primary-action">
              Listings you have created.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <p class="text-sm text-text-muted transition group-hover:text-primary-action">
              ${data.createdListings.length} listing${data.createdListings.length === 1 ? "" : "s"}
            </p>
            <span
              id="created-listings-icon"
              class="text-lg font-semibold text-text-muted transition group-hover:text-primary-action"
              aria-hidden="true"
            >
              ▾
            </span>
          </div>
        </button>

        <div id="created-listings-content" class="grid gap-6 md:grid-cols-2">
          ${createdListingsMarkup}
        </div>
      </section>

      <section class="space-y-4">
        <button
          id="bid-listings-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="bid-listings-content"
          class="group flex w-full cursor-pointer items-end justify-between gap-4 text-left transition"
        >
          <div class="space-y-1">
            <h2 class="text-2xl font-semibold text-text-main transition group-hover:text-primary-action">
              Listings I’ve bid on
            </h2>
            <p class="text-sm text-text-muted transition group-hover:text-primary-action">
              Listings where you have placed a bid.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <p class="text-sm text-text-muted transition group-hover:text-primary-action">
              ${data.bidListings.length} listing${data.bidListings.length === 1 ? "" : "s"}
            </p>
            <span
              id="bid-listings-icon"
              class="text-lg font-semibold text-text-muted transition group-hover:text-primary-action"
              aria-hidden="true"
            >
              ▸
            </span>
          </div>
        </button>

        <div id="bid-listings-content" class="hidden gap-6 md:grid-cols-2">
          ${bidListingsMarkup}
        </div>
      </section>
    </section>
  `;
}
