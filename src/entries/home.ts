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

function renderListings(listings: Listing[]): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(createListingsPage(listings));
  initializeNavigation();
  initializeSearchAndFilter();
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

function applyFilters(): void {
  const searchTerm = getSearchTerm();
  const selectedCategory = getSelectedCategory();
  const filteredListings = filterListings(
    allListings,
    searchTerm,
    selectedCategory,
  );

  renderListings(filteredListings);

  const nextSearchInput = document.querySelector<HTMLInputElement>("#search");
  const nextCategorySelect =
    document.querySelector<HTMLSelectElement>("#category");

  if (nextSearchInput) {
    nextSearchInput.value = searchTerm;
  }

  if (nextCategorySelect) {
    nextCategorySelect.value = selectedCategory;
  }
}

function initializeSearchAndFilter(): void {
  const searchInput = document.querySelector<HTMLInputElement>("#search");
  const categorySelect = document.querySelector<HTMLSelectElement>("#category");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const cursorPosition =
        searchInput.selectionStart ?? searchInput.value.length;
      const currentValue = searchInput.value;

      applyFilters();

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
      applyFilters();
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
