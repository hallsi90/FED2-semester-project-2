import "../style.css";
import { getListingById } from "../api/listings/get-listing";
import { placeBid } from "../api/listings/place-bid";
import { getProfileByName } from "../api/profile/get-profile";
import { createLayout } from "../components/layout";
import { createLoadingState } from "../components/loading-state";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { createPageState } from "../components/page-state";
import { alertStyles } from "../components/ui";
import { createSingleListingPage } from "../pages/single-listing-page";
import { formatLiveTimeRemaining, getCountdownTone } from "../utils/helpers";
import {
  getAccessToken,
  getApiKey,
  getProfile as getStoredProfile,
  saveProfile,
} from "../utils/auth-storage";
import { validateBidForm } from "../utils/validation";

const app = document.querySelector<HTMLDivElement>("#app");

let countdownIntervalId: number | null = null;

function initializeNavigation(): void {
  initializeMobileMenu();
  initializeProfileMenu();
  initializeLogout();
}

function getListingIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function clearLiveCountdown(): void {
  if (countdownIntervalId !== null) {
    window.clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }
}

function initializeLiveCountdown(): void {
  clearLiveCountdown();

  const countdownElements =
    document.querySelectorAll<HTMLElement>("#listing-countdown");

  if (countdownElements.length === 0) {
    return;
  }

  function updateCountdowns(): void {
    countdownElements.forEach((element) => {
      const endsAt = element.dataset.endsAt;

      if (!endsAt) {
        return;
      }

      element.textContent = formatLiveTimeRemaining(endsAt);
      element.classList.remove(
        "text-text-main",
        "text-text-muted",
        "text-orange-600",
        "text-red-600",
        "font-medium",
      );

      const toneClasses = getCountdownTone(endsAt).split(" ");
      element.classList.add(...toneClasses);
    });
  }

  updateCountdowns();
  countdownIntervalId = window.setInterval(updateCountdowns, 1000);
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
    const storedProfile = getStoredProfile();

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

      if (storedProfile?.name) {
        const freshProfile = await getProfileByName(
          storedProfile.name,
          accessToken,
          apiKey,
        );
        saveProfile(freshProfile);
      }

      await renderListingPage();
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

function initializeImageGallery(): void {
  const mainImage = document.querySelector<HTMLImageElement>(
    "#main-listing-image",
  );
  const thumbnails =
    document.querySelectorAll<HTMLButtonElement>(".listing-thumbnail");

  if (!mainImage || thumbnails.length === 0) {
    return;
  }

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const imageUrl = thumbnail.dataset.imageUrl;
      const imageAlt = thumbnail.dataset.imageAlt;

      if (!imageUrl) {
        return;
      }

      mainImage.src = imageUrl;
      mainImage.alt = imageAlt || "Listing image";

      thumbnails.forEach((item) => {
        item.setAttribute("aria-pressed", "false");
        item.classList.remove("border-primary-action");
        item.classList.add("border-border-neutral");
      });

      thumbnail.setAttribute("aria-pressed", "true");
      thumbnail.classList.remove("border-border-neutral");
      thumbnail.classList.add("border-primary-action");
    });
  });
}

function renderLoadingState(): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(
    createLoadingState({
      eyebrow: "Listing details",
      title: "Loading listing...",
    }),
  );

  initializeNavigation();
}

function renderErrorState(message: string): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(
    createPageState({
      eyebrow: "Listing details",
      title: "Listing unavailable",
      message,
      tone: "error",
    }),
  );

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

  clearLiveCountdown();
  renderLoadingState();

  try {
    const listing = await getListingById(listingId);
    const storedProfile = getStoredProfile();
    const isLoggedIn = Boolean(getAccessToken());
    const isOwner =
      Boolean(storedProfile?.name) &&
      storedProfile?.name === listing.seller?.name;

    app.innerHTML = createLayout(
      createSingleListingPage(listing, {
        isLoggedIn,
        isOwner,
      }),
    );

    initializeNavigation();
    initializeImageGallery();
    initializeLiveCountdown();

    if (!isOwner) {
      await initializeBidForm();
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading the listing.";

    renderErrorState(errorMessage);
  }
}

void renderListingPage();
