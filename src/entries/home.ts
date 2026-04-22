import "../style.css";
import { getListings } from "../api/listings/get-listings";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { createListingsPage } from "../pages/listings-page";
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

async function renderHomePage(): Promise<void> {
  if (!app) {
    return;
  }

  renderLoadingState();

  try {
    const listings = await getListings();

    app.innerHTML = createLayout(createListingsPage(listings));
    initializeNavigation();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading listings.";

    renderErrorState(errorMessage);
  }
}

void renderHomePage();
