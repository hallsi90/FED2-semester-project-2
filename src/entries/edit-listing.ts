import "../style.css";
import { getListingById } from "../api/listings/get-listing";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { alertStyles } from "../components/ui";
import { createEditListingPage } from "../pages/edit-listing-page";

const app = document.querySelector<HTMLDivElement>("#app");

function initializeNavigation(): void {
  initializeMobileMenu();
  initializeProfileMenu();
  initializeLogout();
}

function getListingIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderLoadingState(): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(`
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-text-main md:text-4xl">
        Loading listing...
      </h1>
      <p class="text-base text-text-muted">
        Please wait while the edit form is prepared.
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
        Edit listing unavailable
      </h1>
      <div class="${alertStyles.error}">
        ${message}
      </div>
    </section>
  `);

  initializeNavigation();
}

async function renderEditListingPage(): Promise<void> {
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

    app.innerHTML = createLayout(createEditListingPage(listing));
    initializeNavigation();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading the listing.";

    renderErrorState(errorMessage);
  }
}

void renderEditListingPage();
