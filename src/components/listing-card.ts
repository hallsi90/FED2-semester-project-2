import { cardStyles, buttonStyles } from "./ui";
import { formatDate } from "../utils/helpers";
import type { Listing } from "../types/api";

// Creates a reusable listing card for auction previews.
export function createListingCard(listing: Listing): string {
  const imageUrl =
    listing.media[0]?.url ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";

  const imageAlt = listing.media[0]?.alt || listing.title;
  const description = listing.description || "No description available.";
  const shortDescription =
    description.length > 88 ? `${description.slice(0, 88)}...` : description;

  return `
    <article class="${cardStyles.interactive} flex h-full flex-col">
      <img
        src="${imageUrl}"
        alt="${imageAlt}"
        class="mb-4 h-48 w-full rounded-lg object-cover"
      />

      <div class="flex flex-1 flex-col space-y-4">
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold leading-tight text-text-main">
            ${listing.title}
          </h2>
          <p class="text-sm font-medium text-primary-dark">
            Ends ${formatDate(listing.endsAt)}
          </p>
        </div>

        <p class="text-sm leading-7 text-text-muted">
          ${shortDescription}
        </p>

        <div class="mt-auto flex items-center justify-between gap-4">
          <p class="text-sm font-semibold text-text-main">
            Bids: ${listing._count.bids}
          </p>

          <a href="/listing/" class="${buttonStyles.primary}">
            View listing
          </a>
        </div>
      </div>
    </article>
  `;
}
