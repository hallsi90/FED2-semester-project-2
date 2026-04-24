import "../style.css";
import { getListings } from "../api/listings/get-listings";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { alertStyles } from "../components/ui";
import { createListingsPage } from "../pages/listings-page";
import type { Listing } from "../types/api";

const app = document.querySelector<HTMLDivElement>("#app");

let allListings: Listing[] = [];

function initializeNavigation(): void {
  initializeMobileMenu();
  initializeProfileMenu();
  initializeLogout();
}

function getSearchTerm(): string {
  const searchInput = document.querySelector<HTMLInputElement>("#search");
  return searchInput?.value.trim().toLowerCase() || "";
}

function filterListingsBySearch(
  listings: Listing[],
  searchTerm: string,
): Listing[] {
  if (!searchTerm) {
    return listings;
  }

  return listings.filter((listing) => {
    const title = listing.title.toLowerCase();
    const description = listing.description?.toLowerCase() || "";
    const tags = listing.tags.join(" ").toLowerCase();

    return (
      title.includes(searchTerm) ||
      description.includes(searchTerm) ||
      tags.includes(searchTerm)
    );
  });
}

function renderListings(listings: Listing[]): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(createListingsPage(listings));
  initializeNavigation();
  initializeSearch();
}

function renderLoadingState(): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(`
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-text-main md:text-4xl">
        Browse auctions
      </h1>
      <p class="text-base text-text-muted">
        Loading listings...
      </p>
    </section>
  `);

  initializeNavigation();
}

function renderErrorState(message: string): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(`
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-text-main md:text-4xl">
        Browse auctions
      </h1>
      <div class="${alertStyles.error}">
        ${message}
      </div>
    </section>
  `);

  initializeNavigation();
}

function initializeSearch(): void {
  const searchInput = document.querySelector<HTMLInputElement>("#search");

  if (!searchInput) {
    return;
  }

  searchInput.addEventListener("input", () => {
    const searchTerm = getSearchTerm();
    const filteredListings = filterListingsBySearch(allListings, searchTerm);

    renderListings(filteredListings);

    const nextSearchInput = document.querySelector<HTMLInputElement>("#search");
    if (nextSearchInput) {
      nextSearchInput.value = searchTerm;
      nextSearchInput.focus();
      nextSearchInput.setSelectionRange(searchTerm.length, searchTerm.length);
    }
  });
}

async function renderHomePage(): Promise<void> {
  if (!app) {
    return;
  }

  renderLoadingState();

  try {
    allListings = await getListings();
    renderListings(allListings);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading listings.";

    renderErrorState(errorMessage);
  }
}

void renderHomePage();
