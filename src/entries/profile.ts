import "../style.css";
import { getProfileByName } from "../api/profile/get-profile";
import { getProfileBids } from "../api/profile/get-profile-bids";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { initializeProfileSections } from "../components/profile-events";
import { alertStyles } from "../components/ui";
import { renderAuthRequiredState } from "../components/auth-required-state";
import { createProfilePage } from "../pages/profile-page";
import type { Bid, Listing, Profile } from "../types/api";
import {
  getAccessToken,
  getApiKey,
  getProfile as getStoredProfile,
} from "../utils/auth-storage";

const app = document.querySelector<HTMLDivElement>("#app");

function initializePage(): void {
  initializeMobileMenu();
  initializeProfileMenu();
  initializeProfileSections();
  initializeLogout();
}

function renderLoadingState(): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(`
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-text-main md:text-4xl">
        Loading profile...
      </h1>
    </section>
  `);

  initializePage();
}

function renderErrorState(message: string): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(`
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-text-main md:text-4xl">
        Profile unavailable
      </h1>
      <div class="${alertStyles.error}">
        ${message}
      </div>
    </section>
  `);

  initializePage();
}

function getBidListings(bids: Bid[]): Listing[] {
  const listingsMap = new Map<string, Listing>();

  bids.forEach((bid) => {
    if (!bid.listing?.id) {
      return;
    }

    const existingListing = listingsMap.get(bid.listing.id);

    if (!existingListing) {
      listingsMap.set(bid.listing.id, bid.listing);
      return;
    }

    const existingDate = new Date(existingListing.updated).getTime();
    const nextDate = new Date(bid.listing.updated).getTime();

    if (nextDate > existingDate) {
      listingsMap.set(bid.listing.id, bid.listing);
    }
  });

  return Array.from(listingsMap.values());
}

async function renderProfilePage(): Promise<void> {
  if (!app) {
    return;
  }

  const storedProfile = getStoredProfile();
  const accessToken = getAccessToken();
  const apiKey = getApiKey();

  if (!storedProfile?.name || !accessToken || !apiKey) {
    app.innerHTML = createLayout(
      renderAuthRequiredState(
        "Profile unavailable",
        "You must be logged in to view your profile.",
      ),
    );
    initializePage();
    return;
  }

  renderLoadingState();

  try {
    const [profile, bids]: [Profile, Bid[]] = await Promise.all([
      getProfileByName(storedProfile.name, accessToken, apiKey, {
        includeListings: true,
      }),
      getProfileBids(storedProfile.name, accessToken, apiKey),
    ]);

    const createdListings = profile.listings ?? [];
    const bidListings = getBidListings(bids);

    app.innerHTML = createLayout(
      createProfilePage({
        profile,
        createdListings,
        bidListings,
      }),
    );

    initializePage();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading the profile.";

    renderErrorState(errorMessage);
  }
}

void renderProfilePage();
