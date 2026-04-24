import { createListingCard } from "../components/listing-card";
import { createSearchBar } from "../components/search-bar";
import { createFilterControls } from "../components/filter-controls";
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
            <select
              id="sort"
              name="sort"
              class="w-full rounded-[10px] border border-border-neutral bg-surface px-4 py-3 text-base text-text-main outline-none transition focus:border-primary-action focus:ring-2 focus:ring-primary-action/20"
            >
              <option value="newest">Newest</option>
              <option value="ending-soon">Ending soon</option>
              <option value="most-bids">Most bids</option>
            </select>
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
