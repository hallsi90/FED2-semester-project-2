import "../style.css";
import { getListingById } from "../api/listings/get-listing";
import { getProfileBids } from "../api/profile/get-profile-bids";
import { getProfileByName } from "../api/profile/get-profile";
import { getProfileListings } from "../api/profile/get-profile-listings";
import { renderAuthRequiredState } from "../components/auth-required-state";
import { createLayout } from "../components/layout";
import { createLoadingState } from "../components/loading-state";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { createPageState } from "../components/page-state";
import { initializeProfileSections } from "../components/profile-events";
import { createProfilePage } from "../pages/profile-page";
import type { Bid, Listing, Profile } from "../types/api";
import {
  getAccessToken,
  getApiKey,
  getProfile as getStoredProfile,
  saveProfile,
} from "../utils/auth-storage";

const app = document.querySelector<HTMLDivElement>("#app");

function initializePage(): void {
  initializeMobileMenu();
  initializeProfileMenu();
  initializeProfileSections();
  initializeLogout();
}

function getProfileNameFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("name");
}

function renderLoadingState(): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(
    createLoadingState({
      title: "Loading profile...",
    }),
  );

  initializePage();
}

function renderErrorState(message: string): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(
    createPageState({
      title: "Profile unavailable",
      message,
      tone: "error",
    }),
  );

  initializePage();
}

function getUniqueBidListingIds(bids: Bid[]): string[] {
  const uniqueIds = new Set<string>();

  bids.forEach((bid) => {
    if (bid.listing?.id) {
      uniqueIds.add(bid.listing.id);
    }
  });

  return Array.from(uniqueIds);
}

async function getBidListingsWithCounts(
  listingIds: string[],
): Promise<Listing[]> {
  const listings = await Promise.all(
    listingIds.map((listingId) => getListingById(listingId)),
  );

  return listings.sort((a, b) => {
    return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
  });
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
        "You must be logged in to view profiles.",
      ),
    );
    initializePage();
    return;
  }

  const requestedProfileName = getProfileNameFromUrl();
  const targetProfileName = requestedProfileName || storedProfile.name;
  const isOwnProfile = targetProfileName === storedProfile.name;

  renderLoadingState();

  try {
    const profilePromise = getProfileByName(
      targetProfileName,
      accessToken,
      apiKey,
      {
        includeWins: isOwnProfile,
      },
    );

    const listingsPromise = getProfileListings(
      targetProfileName,
      accessToken,
      apiKey,
    );

    const bidsPromise = isOwnProfile
      ? getProfileBids(storedProfile.name, accessToken, apiKey)
      : Promise.resolve([]);

    const [profile, createdListings, bids]: [Profile, Listing[], Bid[]] =
      await Promise.all([profilePromise, listingsPromise, bidsPromise]);

    const bidListingIds = isOwnProfile ? getUniqueBidListingIds(bids) : [];
    const bidListings = isOwnProfile
      ? await getBidListingsWithCounts(bidListingIds)
      : [];

    if (isOwnProfile) {
      saveProfile(profile);
    }

    app.innerHTML = createLayout(
      createProfilePage({
        profile,
        createdListings,
        bidListings,
        isOwnProfile,
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
