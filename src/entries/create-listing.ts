import "../style.css";
import { createListing } from "../api/listings/create-listing";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { alertStyles } from "../components/ui";
import { createCreateListingPage } from "../pages/create-listing-page";
import { ROUTES } from "../constants/routes";
import { getAccessToken, getApiKey } from "../utils/auth-storage";
import { validateCreateListingForm } from "../utils/validation";
import type { CreateListingBody, MediaItem } from "../types/api";

const app = document.querySelector<HTMLDivElement>("#app");

function initializeNavigation(): void {
  initializeMobileMenu();
  initializeProfileMenu();
  initializeLogout();
}

function renderUnauthorizedState(): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(`
    <section class="mx-auto w-full max-w-2xl space-y-4">
      <h1 class="text-3xl font-bold text-text-main md:text-4xl">
        Create listing
      </h1>
      <div class="${alertStyles.error}">
        You must be logged in to create a listing.
      </div>
      <a href="${ROUTES.login}" class="inline-flex items-center justify-center rounded-xl bg-primary-action px-4 py-2 text-base font-semibold text-white transition hover:bg-primary-action-hover">
        Log in
      </a>
    </section>
  `);

  initializeNavigation();
}

function getTags(tagsValue: string): string[] {
  return tagsValue
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

function getMedia(): MediaItem[] {
  const imageUrlInput =
    document.querySelector<HTMLInputElement>("#image-url-0");
  const imageAltInput =
    document.querySelector<HTMLInputElement>("#image-alt-0");

  const url = imageUrlInput?.value.trim() || "";
  const alt = imageAltInput?.value.trim() || "";

  if (!url) {
    return [];
  }

  return [{ url, alt }];
}

if (app) {
  const accessToken = getAccessToken();
  const apiKey = getApiKey();

  if (!accessToken || !apiKey) {
    renderUnauthorizedState();
  } else {
    app.innerHTML = createLayout(createCreateListingPage());

    initializeNavigation();

    const form = document.querySelector<HTMLFormElement>("form");
    const message = document.querySelector<HTMLDivElement>(
      "#create-listing-message",
    );
    const titleInput = document.querySelector<HTMLInputElement>("#title");
    const descriptionInput =
      document.querySelector<HTMLTextAreaElement>("#description");
    const tagsInput = document.querySelector<HTMLInputElement>("#tags");
    const endsAtInput = document.querySelector<HTMLInputElement>("#ends-at");

    if (
      form &&
      message &&
      titleInput &&
      descriptionInput &&
      tagsInput &&
      endsAtInput
    ) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const media = getMedia();

        const validationErrors = validateCreateListingForm({
          title: titleInput.value,
          endsAt: endsAtInput.value,
          media: media.map((item) => ({
            url: item.url,
            alt: item.alt || "",
          })),
        });

        const errorMessages = [
          validationErrors.title,
          validationErrors.endsAt,
          validationErrors.media,
        ].filter(Boolean);

        if (errorMessages.length > 0) {
          message.textContent = errorMessages.join(" ");
          message.className = alertStyles.error;
          return;
        }

        const listingData: CreateListingBody = {
          title: titleInput.value.trim(),
          description: descriptionInput.value.trim() || undefined,
          tags: getTags(tagsInput.value),
          media: media.length > 0 ? media : undefined,
          endsAt: new Date(endsAtInput.value).toISOString(),
        };

        try {
          message.textContent = "Creating listing...";
          message.className = alertStyles.info;

          await createListing(listingData, accessToken, apiKey);

          message.textContent = "Listing created successfully.";
          message.className = alertStyles.success;

          form.reset();

          setTimeout(() => {
            window.location.href = ROUTES.profile;
          }, 1500);
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Something went wrong while creating the listing.";

          message.textContent = errorMessage;
          message.className = alertStyles.error;
        }
      });
    }
  }
}
