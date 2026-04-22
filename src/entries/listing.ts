import "../style.css";
import { getListingById } from "../api/listings/get-listing";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { createSingleListingPage } from "../pages/single-listing-page";
import { alertStyles } from "../components/ui";

const app = document.querySelector<HTMLDivElement>("#app");

function initializeNavigation(): void {
  initializeMobileMenu();
  initializeProfileMenu();
  initializeLogout();
}

function renderLoadingState(): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(`
    <section class="space-y-4">
      <p class="text-sm font-medium text-text-muted">Listing details</p>
      <h1 class="text-3xl font-bold text-text-main md:text-4xl">
        Loading listing...
      </h1>
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
      <p class="text-sm font-medium text-text-muted">Listing details</p>
      <h1 class="text-3xl font-bold text-text-main md:text-4xl">
        Listing unavailable
      </h1>
      <div class="${alertStyles.error}">
        ${message}
      </div>
    </section>
  `);

  initializeNavigation();
}

function getListingIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function renderListingPage(): Promise<void> {
  if (!app) {
    return;
  }

  const listingId = getListingIdFromUrl();

  if (!listingId) {
    renderErrorState("No listing id was provided.");
    return;
  }

  renderLoadingState();

  try {
    const listing = await getListingById(listingId);

    app.innerHTML = createLayout(createSingleListingPage(listing));
    initializeNavigation();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading the listing.";

    renderErrorState(errorMessage);
  }
}

void renderListingPage();
