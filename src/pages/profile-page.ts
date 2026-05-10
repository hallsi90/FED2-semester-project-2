import { createEmptyState } from "../components/empty-state";
import { buttonStyles, cardStyles } from "../components/ui";
import { createListingCard } from "../components/listing-card";
import { ROUTES } from "../constants/routes";
import {
  formatDateTime,
  formatTimeRemaining,
  getCountdownTone,
} from "../utils/helpers";
import type { Listing, Profile } from "../types/api";

interface ProfilePageData {
  profile: Profile;
  createdListings: Listing[];
  bidListings: Listing[];
  isOwnProfile: boolean;
}

// Creates the profile page layout.
export function createProfilePage(data: ProfilePageData): string {
  const profileName = data.profile.name?.trim() || "Unknown user";
  const profileEmail = data.profile.email?.trim() || "";
  const bannerUrl = data.profile.banner?.url?.trim() || "";
  const bannerAlt = data.profile.banner?.alt?.trim() || `${profileName} banner`;

  const avatarUrl = data.profile.avatar?.url?.trim() || "";
  const avatarAlt = data.profile.avatar?.alt?.trim() || `${profileName} avatar`;
  const bio = data.profile.bio?.trim() || "No bio added yet.";
  const credits = data.profile.credits ?? 0;
  const profileInitial = profileName.charAt(0).toUpperCase();
  const wins = data.profile.wins ?? [];

  const avatarMarkup = avatarUrl
    ? `
      <img
        src="${avatarUrl}"
        alt="${avatarAlt}"
        class="h-28 w-28 shrink-0 rounded-full border-4 border-white object-cover shadow-sm md:h-20 md:w-20 lg:h-24 lg:w-24"
      />
    `
    : `
      <div
        class="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-white bg-background text-xl font-semibold text-text-main shadow-sm md:h-20 md:w-20 lg:h-24 lg:w-24"
        aria-label="${profileName} avatar placeholder"
      >
        ${profileInitial}
      </div>
    `;

  const chevronIcon = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="h-4 w-4"
    >
      <path
        fill-rule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
        clip-rule="evenodd"
      />
    </svg>
  `;

  const sortedCreatedListings = [...data.createdListings].sort((a, b) => {
    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });

  const sortedBidListings = [...data.bidListings].sort((a, b) => {
    return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
  });

  const sortedWins = [...wins].sort((a, b) => {
    return new Date(b.endsAt).getTime() - new Date(a.endsAt).getTime();
  });

  const createdListingsMarkup =
    sortedCreatedListings.length > 0
      ? sortedCreatedListings
          .map((listing) => {
            if (!data.isOwnProfile) {
              return createListingCard(listing);
            }

            const title = listing.title?.trim() || "Untitled listing";
            const mediaItems = listing.media ?? [];
            const firstImage = mediaItems[0];
            const imageUrl = firstImage?.url?.trim() || "";
            const imageAlt = firstImage?.alt?.trim() || title;

            const description =
              listing.description?.trim() || "No description available.";
            const shortDescription =
              description.length > 88
                ? `${description.slice(0, 88)}...`
                : description;

            const bidCount = listing._count?.bids ?? 0;
            const listingUrl = `${ROUTES.singleListing}?id=${listing.id}`;
            const editUrl = `${ROUTES.editListing}?id=${listing.id}`;
            const countdownTone = getCountdownTone(listing.endsAt);
            const isEnded = new Date(listing.endsAt).getTime() <= Date.now();
            const endDateLabel = isEnded ? "Ended" : "Ends";

            return `
              <article class="${cardStyles.interactive} flex h-full flex-col">
                ${
                  imageUrl
                    ? `
                      <img
                        src="${imageUrl}"
                        alt="${imageAlt}"
                        class="mb-4 h-48 w-full rounded-lg object-cover"
                      />
                    `
                    : `
                      <div class="mb-4 flex h-48 w-full items-center justify-center rounded-lg bg-background text-sm text-text-muted">
                        No image available
                      </div>
                    `
                }

                <div class="flex flex-1 flex-col space-y-4">
                  <div class="space-y-1">
                    <h3 class="text-xl font-semibold leading-tight text-text-main md:text-2xl">
                      ${title}
                    </h3>
                    <p class="text-sm font-medium text-primary-dark">
                      ${endDateLabel} ${formatDateTime(listing.endsAt)}
                    </p>
                    <p class="text-sm ${countdownTone}">
                      ${formatTimeRemaining(listing.endsAt)}
                    </p>
                  </div>

                  <p class="text-sm leading-7 text-text-muted">
                    ${shortDescription}
                  </p>

                  <div class="mt-auto space-y-3">
                    <p class="text-sm font-semibold text-text-main">
                      Bids: ${bidCount}
                    </p>

                    <div class="flex flex-col gap-3 sm:flex-row">
                      <a
                        href="${listingUrl}"
                        class="${buttonStyles.primary} flex-1"
                      >
                        View listing
                      </a>

                      <a
                        href="${editUrl}"
                        class="${buttonStyles.secondary} flex-1"
                      >
                        Edit listing
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            `;
          })
          .join("")
      : createEmptyState({
          title: "No listings yet",
          message: data.isOwnProfile
            ? "You have not created any listings yet."
            : `${profileName} has not created any listings yet.`,
          actionHref: data.isOwnProfile ? ROUTES.createListing : undefined,
          actionLabel: data.isOwnProfile ? "Create listing" : undefined,
        });

  const bidListingsMarkup =
    sortedBidListings.length > 0
      ? sortedBidListings.map((listing) => createListingCard(listing)).join("")
      : createEmptyState({
          title: "No bids yet",
          message: "You have not placed any bids yet.",
          compact: true,
        });

  const winsMarkup =
    sortedWins.length > 0
      ? sortedWins.map((listing) => createListingCard(listing)).join("")
      : createEmptyState({
          title: "No wins yet",
          message: "You have not won any listings yet.",
          compact: true,
        });

  return `
    <section class="space-y-8">
      <section class="overflow-hidden rounded-xl border border-border-neutral bg-surface shadow-sm">
        <div class="relative">
  ${
    bannerUrl
      ? `
        <div class="h-36 w-full overflow-hidden rounded-t-xl md:h-44 lg:h-48">
          <img
            src="${bannerUrl}"
            alt="${bannerAlt}"
            class="h-full w-full object-cover"
          />
        </div>
      `
      : `
        <div class="h-28 w-full rounded-t-xl bg-background md:h-36"></div>
      `
  }
          

          ${
            data.isOwnProfile
              ? `
                <div class="absolute right-3 top-3 md:right-4 md:top-4">
                  <a
                    href="${ROUTES.profileEdit}"
                    class="inline-flex items-center justify-center rounded-lg border border-border-neutral bg-white px-3 py-2 text-sm font-medium text-text-main shadow-sm transition hover:border-primary-action hover:text-primary-action"
                  >
                    Edit profile
                  </a>
                </div>
              `
              : ""
          }
        </div>

        <div class="px-5 pb-5 pt-4 md:hidden">
          <div class="flex flex-col items-center text-center gap-3">
            <div>
              ${avatarMarkup}
            </div>

            <div class="space-y-0">
              <h1 class="text-3xl font-bold text-text-main">
                ${profileName}
              </h1>

              ${
                data.isOwnProfile && profileEmail
                  ? `
                    <p class="text-sm text-text-muted">
                      ${profileEmail}
                    </p>
                  `
                  : ""
              }
            </div>

            <p class="max-w-xs whitespace-pre-line text-base leading-7 text-text-muted">
              ${bio}
            </p>

            ${
              data.isOwnProfile
                ? `
                  <div class="w-full max-w-55 rounded-xl bg-background px-4 py-4 text-center">
                    <p class="text-sm font-medium text-text-muted">
                      Credits
                    </p>
                    <p class="mt-2 text-2xl font-bold text-primary-action">
                      ${credits.toLocaleString("en-GB")}
                    </p>
                  </div>
                `
                : ""
            }
          </div>
        </div>

        <div class="hidden md:block px-6 py-5 lg:px-8 lg:py-6">
          <div class="flex items-center justify-between gap-6 lg:gap-8">
            <div class="flex min-w-0 items-center gap-4 lg:gap-5">
              <div class="shrink-0">
                ${avatarMarkup}
              </div>

              <div class="min-w-0 space-y-0">
                <h1 class="text-3xl font-bold leading-none text-text-main">
                  ${profileName}
                </h1>

                ${
                  data.isOwnProfile && profileEmail
                    ? `
                      <p class="truncate text-sm text-text-muted">
                        ${profileEmail}
                      </p>
                    `
                    : ""
                }

                <p class="mt-1 max-w-md whitespace-pre-line text-sm leading-5 text-text-muted lg:max-w-lg">
                  ${bio}
                </p>
              </div>
            </div>

            ${
              data.isOwnProfile
                ? `
                  <div class="shrink-0 rounded-xl bg-background px-5 py-4 text-center">
                    <p class="text-sm font-medium text-text-muted">
                      Credits
                    </p>
                    <p class="mt-2 text-3xl font-bold text-primary-action">
                      ${credits.toLocaleString("en-GB")}
                    </p>
                  </div>
                `
                : ""
            }
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
              ${data.isOwnProfile ? "My listings" : `${profileName}'s listings`}
            </h2>
            <p class="text-sm text-text-muted transition group-hover:text-primary-action">
              ${
                data.isOwnProfile
                  ? "Listings you have created."
                  : "Listings created by this user."
              }
            </p>
          </div>

          <div class="flex items-center gap-3">
            <p class="text-sm text-text-muted transition group-hover:text-primary-action">
              ${data.createdListings.length} listing${data.createdListings.length === 1 ? "" : "s"}
            </p>
            <span
              id="created-listings-icon"
              class="flex h-5 w-5 rotate-180 items-center justify-center text-text-muted transition duration-200 group-hover:text-primary-action"
              aria-hidden="true"
            >
              ${chevronIcon}
            </span>
          </div>
        </button>

        <div id="created-listings-content" class="grid gap-6 md:grid-cols-2">
          ${createdListingsMarkup}
        </div>
      </section>

      ${
        data.isOwnProfile
          ? `
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
                    class="flex h-5 w-5 items-center justify-center text-text-muted transition duration-200 group-hover:text-primary-action"
                    aria-hidden="true"
                  >
                    ${chevronIcon}
                  </span>
                </div>
              </button>

              <div id="bid-listings-content" class="hidden gap-6 md:grid-cols-2">
                ${bidListingsMarkup}
              </div>
            </section>

            <section class="space-y-4">
              <button
                id="wins-toggle"
                type="button"
                aria-expanded="false"
                aria-controls="wins-content"
                class="group flex w-full cursor-pointer items-end justify-between gap-4 text-left transition"
              >
                <div class="space-y-1">
                  <h2 class="text-2xl font-semibold text-text-main transition group-hover:text-primary-action">
                    Won listings
                  </h2>
                  <p class="text-sm text-text-muted transition group-hover:text-primary-action">
                    Ended listings you have won.
                  </p>
                </div>

                <div class="flex items-center gap-3">
                  <p class="text-sm text-text-muted transition group-hover:text-primary-action">
                    ${wins.length} win${wins.length === 1 ? "" : "s"}
                  </p>
                  <span
                    id="wins-icon"
                    class="flex h-5 w-5 items-center justify-center text-text-muted transition duration-200 group-hover:text-primary-action"
                    aria-hidden="true"
                  >
                    ${chevronIcon}
                  </span>
                </div>
              </button>

              <div id="wins-content" class="hidden gap-6 md:grid-cols-2">
                ${winsMarkup}
              </div>
            </section>
          `
          : ""
      }
    </section>
  `;
}
