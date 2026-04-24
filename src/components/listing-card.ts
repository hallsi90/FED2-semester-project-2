import { buttonStyles, cardStyles } from "./ui";
import { ROUTES } from "../constants/routes";
import { formatDate } from "../utils/helpers";
import type { Listing } from "../types/api";

// Creates a reusable listing card for auction previews.
export function createListingCard(listing: Listing): string {
  const imageUrl =
    listing.media[0]?.url ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";

  const imageAlt = listing.media[0]?.alt || listing.title || "Listing image";

  const description =
    listing.description?.trim() || "No description available.";

  const shortDescription =
    description.length > 88 ? `${description.slice(0, 88)}...` : description;

  const bidCount = listing._count?.bids ?? 0;
  const listingUrl = `${ROUTES.singleListing}?id=${listing.id}`;

  return `
    <article class="h-full">
      <a
        href="${listingUrl}"
        class="${cardStyles.interactive} group flex h-full flex-col focus:outline-none focus:ring-2 focus:ring-primary-action focus:ring-offset-2"
        aria-label="View listing: ${listing.title}"
      >
        <img
          src="${imageUrl}"
          alt="${imageAlt}"
          class="mb-4 h-48 w-full rounded-lg object-cover"
        />

        <div class="flex flex-1 flex-col space-y-4">
          <div class="space-y-1">
            <h2 class="text-2xl font-semibold leading-tight text-text-main transition group-hover:text-primary-action">
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
              Bids: ${bidCount}
            </p>

            <span class="${buttonStyles.primary}">
              View listing
            </span>
          </div>
        </div>
      </a>
    </article>
  `;
}
