import { buttonStyles, cardStyles } from "./ui";
import { ROUTES } from "../constants/routes";
import {
  formatDateTime,
  formatTimeRemaining,
  getCountdownTone,
} from "../utils/helpers";
import type { Listing } from "../types/api";

// Creates a reusable listing card.
export function createListingCard(listing: Listing): string {
  const title = listing.title?.trim() || "Untitled listing";
  const mediaItems = listing.media ?? [];
  const firstImage = mediaItems[0];
  const imageUrl = firstImage?.url?.trim() || "";
  const imageAlt = firstImage?.alt?.trim() || title;

  const description =
    listing.description?.trim() || "No description available.";

  const shortDescription =
    description.length > 88 ? `${description.slice(0, 88)}...` : description;

  const bidCount = listing._count?.bids ?? 0;
  const listingUrl = `${ROUTES.singleListing}?id=${listing.id}`;
  const countdownTone = getCountdownTone(listing.endsAt);
  const isEnded = new Date(listing.endsAt).getTime() <= Date.now();
  const endDateLabel = isEnded ? "Ended" : "Ends";

  return `
    <article class="h-full">
      <a
        href="${listingUrl}"
        class="${cardStyles.interactive} group flex h-full flex-col focus:outline-none focus:ring-2 focus:ring-primary-action focus:ring-offset-2"
        aria-label="View listing: ${title}"
      >
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
            <h2 class="text-xl font-semibold leading-tight text-text-main transition group-hover:text-primary-action">
              ${title}
            </h2>
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
