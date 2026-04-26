import "../style.css";
import { getProfileByName } from "../api/profile/get-profile";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { initializeProfileSections } from "../components/profile-events";
import { alertStyles } from "../components/ui";
import { createProfilePage } from "../pages/profile-page";
import type { Listing, Profile } from "../types/api";
import {
  getAccessToken,
  getApiKey,
  getProfile as getStoredProfile,
} from "../utils/auth-storage";

const app = document.querySelector<HTMLDivElement>("#app");

const sampleListings: Listing[] = [
  {
    id: "1",
    title: "Vintage camera",
    description:
      "A well-kept vintage camera in good condition. Perfect for collectors or anyone interested in classic photography gear.",
    tags: ["camera", "vintage"],
    media: [
      {
        url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
        alt: "Vintage camera on a table",
      },
    ],
    created: "2026-04-17T10:00:00.000Z",
    updated: "2026-04-17T10:00:00.000Z",
    endsAt: "2026-04-25T18:00:00.000Z",
    _count: {
      bids: 7,
    },
  },
  {
    id: "2",
    title: "Desk lamp",
    description:
      "Modern desk lamp with adjustable arm. Works perfectly and gives a warm light for studying or reading.",
    tags: ["desk", "lighting"],
    media: [
      {
        url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
        alt: "Desk lamp on a table",
      },
    ],
    created: "2026-04-17T10:00:00.000Z",
    updated: "2026-04-17T10:00:00.000Z",
    endsAt: "2026-04-22T18:00:00.000Z",
    _count: {
      bids: 3,
    },
  },
];

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
      <p class="text-sm font-medium text-text-muted">Your profile</p>
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
      <p class="text-sm font-medium text-text-muted">Your profile</p>
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

async function renderProfilePage(): Promise<void> {
  if (!app) {
    return;
  }

  const storedProfile = getStoredProfile();
  const accessToken = getAccessToken();
  const apiKey = getApiKey();

  if (!storedProfile?.name || !accessToken || !apiKey) {
    renderErrorState("You must be logged in to view your profile.");
    return;
  }

  renderLoadingState();

  try {
    const profile: Profile = await getProfileByName(
      storedProfile.name,
      accessToken,
      apiKey,
    );

    app.innerHTML = createLayout(
      createProfilePage({
        profile,
        createdListings: sampleListings,
        bidListings: sampleListings,
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
