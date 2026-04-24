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

function getSelectedCategory(): string {
  const categorySelect = document.querySelector<HTMLSelectElement>("#category");
  return categorySelect?.value.trim().toLowerCase() || "";
}

function getSelectedSort(): string {
  const sortSelect = document.querySelector<HTMLSelectElement>("#sort");
  return sortSelect?.value || "newest";
}

function filterListings(
  listings: Listing[],
  searchTerm: string,
  selectedCategory: string,
): Listing[] {
  return listings.filter((listing) => {
    const title = listing.title.toLowerCase();
    const description = listing.description?.toLowerCase() || "";
    const tags = listing.tags.map((tag) => tag.toLowerCase());

    const matchesSearch =
      !searchTerm ||
      title.includes(searchTerm) ||
      description.includes(searchTerm) ||
      tags.some((tag) => tag.includes(searchTerm));

    const matchesCategory =
      !selectedCategory || tags.some((tag) => tag.includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });
}

function sortListings(listings: Listing[], selectedSort: string): Listing[] {
  const sortedListings = [...listings];

  if (selectedSort === "ending-soon") {
    sortedListings.sort((a, b) => {
      return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
    });
  } else if (selectedSort === "most-bids") {
    sortedListings.sort((a, b) => {
      return (b._count?.bids ?? 0) - (a._count?.bids ?? 0);
    });
  } else {
    sortedListings.sort((a, b) => {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });
  }

  return sortedListings;
}

function renderListings(listings: Listing[]): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(createListingsPage(listings));
  initializeNavigation();
  initializeSearchFilterAndSort();
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

function applyListingControls(): void {
  const searchTerm = getSearchTerm();
  const selectedCategory = getSelectedCategory();
  const selectedSort = getSelectedSort();

  const filteredListings = filterListings(
    allListings,
    searchTerm,
    selectedCategory,
  );

  const sortedListings = sortListings(filteredListings, selectedSort);

  renderListings(sortedListings);

  const nextSearchInput = document.querySelector<HTMLInputElement>("#search");
  const nextCategorySelect =
    document.querySelector<HTMLSelectElement>("#category");
  const nextSortSelect = document.querySelector<HTMLSelectElement>("#sort");

  if (nextSearchInput) {
    nextSearchInput.value = searchTerm;
  }

  if (nextCategorySelect) {
    nextCategorySelect.value = selectedCategory;
  }

  if (nextSortSelect) {
    nextSortSelect.value = selectedSort;
  }
}

function initializeSearchFilterAndSort(): void {
  const searchInput = document.querySelector<HTMLInputElement>("#search");
  const categorySelect = document.querySelector<HTMLSelectElement>("#category");
  const sortSelect = document.querySelector<HTMLSelectElement>("#sort");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const cursorPosition =
        searchInput.selectionStart ?? searchInput.value.length;
      const currentValue = searchInput.value;

      applyListingControls();

      const nextSearchInput =
        document.querySelector<HTMLInputElement>("#search");
      if (nextSearchInput) {
        nextSearchInput.focus();
        nextSearchInput.value = currentValue;
        nextSearchInput.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", () => {
      applyListingControls();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      applyListingControls();
    });
  }
}

async function renderHomePage(): Promise<void> {
  if (!app) {
    return;
  }

  renderLoadingState();

  try {
    allListings = await getListings();
    const sortedListings = sortListings(allListings, "newest");
    renderListings(sortedListings);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading listings.";

    renderErrorState(errorMessage);
  }
}

void renderHomePage();
