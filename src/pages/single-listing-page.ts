import { buttonStyles, cardStyles, formStyles } from "../components/ui";
import { formatDate } from "../utils/helpers";
import type { Listing } from "../types/api";

// Creates the single listing page layout for preview and later reuse.
export function createSingleListingPage(listing: Listing): string {
  const imageUrl =
    listing.media[0]?.url ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

  const imageAlt = listing.media[0]?.alt || listing.title;
  const description = listing.description || "No description available.";

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
            <img
              src="${imageUrl}"
              alt="${imageAlt}"
              class="h-80 w-full rounded-lg object-cover md:h-105"
            />
          </section>

          <section class="${cardStyles.base}">
            <div class="space-y-4">
              <div class="space-y-2">
                <p class="text-sm font-medium text-primary-dark">
                  Ends ${formatDate(listing.endsAt)}
                </p>
                <h2 class="text-2xl font-semibold text-text-main">Description</h2>
              </div>

              <p class="text-base leading-8 text-text-muted">
                ${description}
              </p>

              <div class="flex flex-wrap gap-2">
                ${listing.tags
                  .map(
                    (tag) => `
                      <span class="rounded-full bg-background px-3 py-1 text-sm font-medium text-text-muted">
                        ${tag}
                      </span>
                    `,
                  )
                  .join("")}
              </div>
            </div>
          </section>
        </div>

        <aside class="space-y-6">
          <section class="${cardStyles.base}">
            <div class="space-y-3">
              <h2 class="text-xl font-semibold text-text-main">Seller</h2>
              <p class="text-base text-text-muted">
                ${listing.seller?.name || "Unknown seller"}
              </p>
            </div>
          </section>

          <section class="${cardStyles.base}">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-text-main">Place a bid</h2>
                <span class="text-sm font-medium text-text-muted">
                  ${listing._count.bids} bid${listing._count.bids === 1 ? "" : "s"}
                </span>
              </div>

              <p class="text-sm text-text-muted">
                You must be logged in to place a bid.
              </p>

              <div class="space-y-2">
                <label for="bid-amount" class="${formStyles.label}">
                  Bid amount
                </label>
                <input
                  id="bid-amount"
                  type="number"
                  placeholder="Enter your bid"
                  class="${formStyles.input}"
                  disabled
                />
              </div>

              <a href="/login/" class="${buttonStyles.primary}">
                Log in to bid
              </a>
            </div>
          </section>

          <section class="${cardStyles.base}">
            <div class="space-y-4">
              <h2 class="text-2xl font-semibold text-text-main">Bid history</h2>
              <ul class="space-y-3">
                <li class="flex items-center justify-between rounded-lg bg-background px-4 py-3">
                  <span class="text-sm text-text-main">StudentUser1</span>
                  <span class="text-sm font-semibold text-text-main">250 credits</span>
                </li>
                <li class="flex items-center justify-between rounded-lg bg-background px-4 py-3">
                  <span class="text-sm text-text-main">StudentUser2</span>
                  <span class="text-sm font-semibold text-text-main">200 credits</span>
                </li>
                <li class="flex items-center justify-between rounded-lg bg-background px-4 py-3">
                  <span class="text-sm text-text-main">StudentUser3</span>
                  <span class="text-sm font-semibold text-text-main">150 credits</span>
                </li>
              </ul>
            </div>
          </section>
        </aside>
      </section>
    </section>
  `;
}
