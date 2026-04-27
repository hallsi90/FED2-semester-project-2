import { buttonStyles, cardStyles } from "../components/ui";
import { createListingCard } from "../components/listing-card";
import { ROUTES } from "../constants/routes";
import { formatDate } from "../utils/helpers";
import type { Listing, Profile } from "../types/api";

interface ProfilePageData {
  profile: Profile;
  createdListings: Listing[];
  bidListings: Listing[];
  isOwnProfile: boolean;
}

// Creates the profile page layout.
export function createProfilePage(data: ProfilePageData): string {
  const bannerUrl = data.profile.banner?.url || "";
  const bannerAlt = data.profile.banner?.alt || `${data.profile.name} banner`;

  const avatarUrl = data.profile.avatar?.url || "";
  const avatarAlt = data.profile.avatar?.alt || `${data.profile.name} avatar`;
  const bio = data.profile.bio?.trim() || "No bio added yet.";
  const credits = data.profile.credits ?? 0;
  const profileInitial = data.profile.name.charAt(0).toUpperCase();

  const avatarMarkup = avatarUrl
    ? `
      <img
        src="${avatarUrl}"
        alt="${avatarAlt}"
        class="h-28 w-28 shrink-0 rounded-full border-4 border-white object-cover shadow-sm md:h-32 md:w-32"
      />
    `
    : `
      <div
        class="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-white bg-background text-2xl font-semibold text-text-main shadow-sm md:h-32 md:w-32"
        aria-label="${data.profile.name} avatar placeholder"
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

  const createdListingsMarkup =
    sortedCreatedListings.length > 0
      ? sortedCreatedListings
          .map((listing) => {
            if (!data.isOwnProfile) {
              return createListingCard(listing);
            }

            const imageUrl = listing.media[0]?.url;
            const imageAlt =
              listing.media[0]?.alt || listing.title || "Listing image";
            const description =
              listing.description?.trim() || "No description available.";
            const shortDescription =
              description.length > 88
                ? `${description.slice(0, 88)}...`
                : description;

            const bidCount = listing._count?.bids ?? 0;
            const listingUrl = `${ROUTES.singleListing}?id=${listing.id}`;
            const editUrl = `${ROUTES.editListing}?id=${listing.id}`;

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
                    <h3 class="text-2xl font-semibold leading-tight text-text-main">
                      ${listing.title}
                    </h3>
                    <p class="text-sm font-medium text-primary-dark">
                      Ends ${formatDate(listing.endsAt)}
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
      : `
        <div class="${cardStyles.base} md:col-span-2">
          <p class="text-sm text-text-muted">
            ${
              data.isOwnProfile
                ? "You have not created any listings yet."
                : `${data.profile.name} has not created any listings yet.`
            }
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

      <section class="${cardStyles.base} overflow-hidden p-0">
        ${
          bannerUrl
            ? `
              <div class="h-48 w-full overflow-hidden rounded-t-2xl md:h-64">
                <img
                  src="${bannerUrl}"
                  alt="${bannerAlt}"
                  class="h-full w-full rounded-t-2xl object-cover"
                />
              </div>
            `
            : `
              <div class="h-24 w-full rounded-t-2xl bg-background md:h-28"></div>
            `
        }

        <div class="px-5 pb-5 pt-0 md:hidden">
          <div class="flex flex-col items-center text-center">
            <div class="-mt-9 mb-1">
              ${avatarMarkup}
            </div>

            <div class="w-full max-w-xs">
              <p class="whitespace-pre-line text-base leading-7 text-text-muted">
                ${bio}
              </p>
            </div>

            ${
              data.isOwnProfile
                ? `
                  <div class="mt-6 w-full rounded-xl bg-background px-5 py-4 text-left">
                    <p class="text-sm font-medium text-text-muted">Credits balance</p>
                    <p class="mt-2 text-3xl font-bold text-primary-action">
                      ${credits}
                    </p>
                  </div>

                  <div class="mt-5 w-full text-left">
                    <a href="/profile/edit/" class="${buttonStyles.secondary}">
                      Edit profile
                    </a>
                  </div>
                `
                : ""
            }
          </div>
        </div>

        <div class="hidden px-6 pb-6 pt-0 md:block">
          <div class="-mt-16 space-y-6">
            <div class="grid grid-cols-[8rem_minmax(0,1fr)] gap-6">
              <div>
                ${avatarMarkup}
              </div>

              <div class="pt-14">
                <p class="whitespace-pre-line text-base leading-8 text-text-muted">
                  ${bio}
                </p>
              </div>
            </div>

            ${
              data.isOwnProfile
                ? `
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
              ${data.isOwnProfile ? "My listings" : `${data.profile.name}'s listings`}
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
          `
          : ""
      }
    </section>
  `;
}
