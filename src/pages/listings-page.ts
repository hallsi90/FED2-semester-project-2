import { createFilterControls } from "../components/filter-controls";
import { createListingCard } from "../components/listing-card";
import { createSearchBar } from "../components/search-bar";
import { formStyles } from "../components/ui";
import type { Listing } from "../types/api";

// Creates the main listings page layout with a page intro,
// search, sort, filter controls, and a listings grid.
export function createListingsPage(listings: Listing[]): string {
  return `
    <section class="space-y-8">
      <header class="space-y-3">
        <h1 class="text-3xl font-bold text-text-main md:text-4xl">
          Browse auctions
        </h1>
        <p class="max-w-2xl text-base leading-7 text-text-muted">
          Discover student listings, place bids, and explore active auctions in one place.
        </p>
      </header>

      <section
        aria-label="Listings controls"
        class="rounded-xl border border-border-neutral bg-surface p-4 shadow-sm"
      >
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          ${createSearchBar()}

          <div class="space-y-2">
            <label
              for="sort"
              class="block text-sm font-medium text-text-main"
            >
              Sort by
            </label>

            <div class="relative">
              <select
                id="sort"
                name="sort"
                class="${formStyles.select}"
              >
                <option value="newest">Newest</option>
                <option value="ending-soon">Ending soon</option>
                <option value="most-bids">Most bids</option>
              </select>

              <span
                aria-hidden="true"
                class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>

          ${createFilterControls()}
        </div>
      </section>

      <section aria-label="Listings results" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-text-main">Active listings</h2>
          <p class="text-sm text-text-muted">
            ${listings.length} listing${listings.length === 1 ? "" : "s"}
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          ${listings.map((listing) => createListingCard(listing)).join("")}
        </div>
      </section>
    </section>
  `;
}
