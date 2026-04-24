import { buttonStyles, cardStyles, formStyles } from "../components/ui";
import { formatDate } from "../utils/helpers";
import type { Listing } from "../types/api";

interface SingleListingPageOptions {
  isLoggedIn: boolean;
}

// Creates the single listing page layout for preview and later reuse.
export function createSingleListingPage(
  listing: Listing,
  options: SingleListingPageOptions,
): string {
  const mediaItems =
    listing.media.length > 0
      ? listing.media
      : [
          {
            url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
            alt: listing.title,
          },
        ];

  const mainImage = mediaItems[0];
  const description =
    listing.description?.trim() || "No description available.";
  const bidCount = listing._count?.bids ?? 0;

  const sellerName = listing.seller?.name || "Unknown seller";
  const sellerAvatarUrl = listing.seller?.avatar?.url || "";
  const sellerAvatarAlt = listing.seller?.avatar?.alt || `${sellerName} avatar`;

  const visibleTags = listing.tags.filter((tag) => tag.trim().length > 0);

  const thumbnailGallery =
    mediaItems.length > 1
      ? `
        <div
          id="thumbnail-gallery"
          class="grid grid-cols-3 gap-3 sm:grid-cols-4"
          aria-label="Listing image gallery"
        >
          ${mediaItems
            .map(
              (mediaItem, index) => `
                <button
                  type="button"
                  class="listing-thumbnail overflow-hidden rounded-lg border ${
                    index === 0
                      ? "border-primary-action"
                      : "border-border-neutral"
                  } bg-surface transition hover:border-primary-action focus:outline-none focus:ring-2 focus:ring-primary-action focus:ring-offset-2"
                  data-image-url="${mediaItem.url}"
                  data-image-alt="${mediaItem.alt || `Listing image ${index + 1}`}"
                  aria-label="Show image ${index + 1}"
                  aria-pressed="${index === 0 ? "true" : "false"}"
                >
                  <img
                    src="${mediaItem.url}"
                    alt="${mediaItem.alt || `Listing image ${index + 1}`}"
                    class="h-20 w-full object-cover sm:h-24"
                  />
                </button>
              `,
            )
            .join("")}
        </div>
      `
      : "";

  const bidHistoryMarkup =
    listing.bids && listing.bids.length > 0
      ? `
        <ul class="space-y-3">
          ${listing.bids
            .slice()
            .sort((a, b) => b.amount - a.amount)
            .map(
              (bid) => `
                <li class="flex items-center justify-between rounded-lg bg-background px-4 py-3">
                  <span class="text-sm text-text-main">
                    ${bid.bidder?.name || "Unknown bidder"}
                  </span>
                  <span class="text-sm font-semibold text-text-main">
                    ${bid.amount} credits
                  </span>
                </li>
              `,
            )
            .join("")}
        </ul>
      `
      : `
        <p class="text-sm text-text-muted">
          No bids have been placed yet.
        </p>
      `;

  const tagsMarkup =
    visibleTags.length > 0
      ? `
        <div class="flex flex-wrap gap-2">
          ${visibleTags
            .map(
              (tag) => `
                <span class="rounded-full bg-background px-3 py-1 text-sm font-medium text-text-muted">
                  ${tag}
                </span>
              `,
            )
            .join("")}
        </div>
      `
      : "";

  const bidSectionMarkup = options.isLoggedIn
    ? `
      <form id="bid-form" class="space-y-4" novalidate>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-text-main">Place a bid</h2>
          <span class="text-sm font-medium text-text-muted">
            ${bidCount} bid${bidCount === 1 ? "" : "s"}
          </span>
        </div>

        <div id="bid-message" class="hidden"></div>

        <p class="text-sm text-text-muted">
          Enter your bid amount below.
        </p>

        <div class="space-y-2">
          <label for="bid-amount" class="${formStyles.label}">
            Bid amount
          </label>
          <input
            id="bid-amount"
            name="bid-amount"
            type="number"
            min="1"
            step="1"
            placeholder="Enter your bid"
            class="${formStyles.input}"
          />
        </div>

        <button type="submit" class="${buttonStyles.primary}">
          Place bid
        </button>
      </form>
    `
    : `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-text-main">Place a bid</h2>
          <span class="text-sm font-medium text-text-muted">
            ${bidCount} bid${bidCount === 1 ? "" : "s"}
          </span>
        </div>

        <p class="text-sm text-text-muted">
          You must be logged in to place a bid on this listing.
        </p>

        <a href="/login/" class="${buttonStyles.primary}">
          Log in to bid
        </a>
      </div>
    `;

  return `
    <section class="space-y-8">
      <header class="space-y-3">
        <p class="text-sm font-medium text-text-muted">Listing details</p>
        <h1 class="text-3xl font-bold text-text-main md:text-4xl">
          ${listing.title}
        </h1>
      </header>

      <section class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div class="space-y-8">
          <section class="${cardStyles.base}">
            <div class="space-y-4">
              <img
                id="main-listing-image"
                src="${mainImage.url}"
                alt="${mainImage.alt || listing.title}"
                class="h-80 w-full rounded-lg object-cover md:h-105"
              />

              ${thumbnailGallery}
            </div>
          </section>

          <section class="${cardStyles.base}">
            <div class="space-y-4">
              <div class="space-y-2">
                <p class="text-sm font-medium text-primary-dark">
                  Ends ${formatDate(listing.endsAt)}
                </p>
                <h2 class="text-2xl font-semibold text-text-main">
                  Description
                </h2>
              </div>

              <p class="text-base leading-8 text-text-muted">
                ${description}
              </p>

              ${tagsMarkup}
            </div>
          </section>
        </div>

        <aside class="space-y-6">
          <section class="${cardStyles.base}">
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-text-main">Seller</h2>

              <a
                href="/profile/"
                class="group flex items-center gap-4 rounded-xl transition hover:bg-background/60"
              >
                ${
                  sellerAvatarUrl
                    ? `
                      <img
                        src="${sellerAvatarUrl}"
                        alt="${sellerAvatarAlt}"
                        class="h-14 w-14 rounded-full object-cover"
                      />
                    `
                    : `
                      <div class="flex h-14 w-14 items-center justify-center rounded-full bg-background text-sm font-semibold text-text-muted">
                        ${sellerName.charAt(0).toUpperCase()}
                      </div>
                    `
                }

                <div class="space-y-1">
                  <p class="text-base font-medium text-text-main transition group-hover:text-primary-action">
                    ${sellerName}
                  </p>
                </div>
              </a>
            </div>
          </section>

          <section class="${cardStyles.base}">
            ${bidSectionMarkup}
          </section>

          <section class="${cardStyles.base}">
            <div class="space-y-4">
              <h2 class="text-2xl font-semibold text-text-main">Bid history</h2>
              ${bidHistoryMarkup}
            </div>
          </section>
        </aside>
      </section>
    </section>
  `;
}
