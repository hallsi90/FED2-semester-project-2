import "../style.css";
import { getListingById } from "../api/listings/get-listing";
import { placeBid } from "../api/listings/place-bid";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { alertStyles } from "../components/ui";
import { createSingleListingPage } from "../pages/single-listing-page";
import { getAccessToken, getApiKey } from "../utils/auth-storage";
import { validateBidForm } from "../utils/validation";

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

function initializeImageGallery(): void {
  const mainImage = document.querySelector<HTMLImageElement>(
    "#main-listing-image",
  );
  const thumbnailButtons =
    document.querySelectorAll<HTMLButtonElement>(".listing-thumbnail");

  if (!mainImage || !thumbnailButtons.length) {
    return;
  }

  thumbnailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const imageUrl = button.dataset.imageUrl;
      const imageAlt = button.dataset.imageAlt;

      if (!imageUrl) {
        return;
      }

      mainImage.src = imageUrl;
      mainImage.alt = imageAlt || "Listing image";

      thumbnailButtons.forEach((thumbnailButton) => {
        thumbnailButton.classList.remove("border-primary-action");
        thumbnailButton.classList.add("border-border-neutral");
        thumbnailButton.setAttribute("aria-pressed", "false");
      });

      button.classList.remove("border-border-neutral");
      button.classList.add("border-primary-action");
      button.setAttribute("aria-pressed", "true");
    });
  });
}

async function initializeBidForm(): Promise<void> {
  const form = document.querySelector<HTMLFormElement>("#bid-form");
  const message = document.querySelector<HTMLDivElement>("#bid-message");
  const amountInput = document.querySelector<HTMLInputElement>("#bid-amount");

  if (!form || !message || !amountInput) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const listingId = getListingIdFromUrl();
    const accessToken = getAccessToken();
    const apiKey = getApiKey();

    const errors = validateBidForm({
      amount: amountInput.value,
    });

    if (errors.amount) {
      message.textContent = errors.amount;
      message.className = alertStyles.error;
      return;
    }

    if (!listingId) {
      message.textContent = "Listing id is missing.";
      message.className = alertStyles.error;
      return;
    }

    if (!accessToken) {
      message.textContent = "You must be logged in to place a bid.";
      message.className = alertStyles.error;
      return;
    }

    if (!apiKey) {
      message.textContent = "API key is missing. Please log in again.";
      message.className = alertStyles.error;
      return;
    }

    try {
      message.textContent = "Submitting bid...";
      message.className = alertStyles.info;

      await placeBid(
        listingId,
        { amount: Number(amountInput.value) },
        accessToken,
        apiKey,
      );

      message.textContent = "Bid placed successfully.";
      message.className = alertStyles.success;

      form.reset();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong while placing the bid.";

      message.textContent = errorMessage;
      message.className = alertStyles.error;
    }
  });
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
    const isLoggedIn = Boolean(getAccessToken());

    app.innerHTML = createLayout(
      createSingleListingPage(listing, { isLoggedIn }),
    );
    initializeNavigation();
    initializeImageGallery();
    await initializeBidForm();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading the listing.";

    renderErrorState(errorMessage);
  }
}

void renderListingPage();
