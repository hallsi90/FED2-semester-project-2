import "../style.css";
import { createListing } from "../api/listings/create-listing";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { alertStyles, buttonStyles, formStyles } from "../components/ui";
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
  const mediaFields = document.querySelectorAll<HTMLElement>(".media-field");
  const mediaItems: MediaItem[] = [];

  mediaFields.forEach((field) => {
    const urlInput = field.querySelector<HTMLInputElement>(
      'input[name^="image-url-"]',
    );
    const altInput = field.querySelector<HTMLInputElement>(
      'input[name^="image-alt-"]',
    );

    const url = urlInput?.value.trim() || "";
    const alt = altInput?.value.trim() || "";

    if (!url) {
      return;
    }

    mediaItems.push({
      url,
      alt: alt || undefined,
    });
  });

  return mediaItems;
}

function renderEmptyPreview(previewContainer: HTMLElement): void {
  previewContainer.innerHTML = `
    <div class="flex h-48 items-center justify-center bg-surface px-4 text-center text-sm text-text-muted">
      No image preview available.
    </div>
  `;
}

function updateMediaPreview(mediaField: HTMLElement): void {
  const urlInput = mediaField.querySelector<HTMLInputElement>(
    'input[name^="image-url-"]',
  );
  const altInput = mediaField.querySelector<HTMLInputElement>(
    'input[name^="image-alt-"]',
  );
  const previewContainer =
    mediaField.querySelector<HTMLElement>(".media-preview");

  if (!urlInput || !altInput || !previewContainer) {
    return;
  }

  const imageUrl = urlInput.value.trim();
  const imageAlt = altInput.value.trim() || "Listing image preview";

  if (!imageUrl) {
    renderEmptyPreview(previewContainer);
    return;
  }

  previewContainer.innerHTML = `
    <img
      src="${imageUrl}"
      alt="${imageAlt}"
      class="h-48 w-full object-cover"
    />
  `;

  const previewImage = previewContainer.querySelector<HTMLImageElement>("img");

  if (!previewImage) {
    renderEmptyPreview(previewContainer);
    return;
  }

  previewImage.addEventListener("error", () => {
    renderEmptyPreview(previewContainer);
  });
}

function initializeMediaPreview(mediaField: HTMLElement): void {
  const urlInput = mediaField.querySelector<HTMLInputElement>(
    'input[name^="image-url-"]',
  );
  const altInput = mediaField.querySelector<HTMLInputElement>(
    'input[name^="image-alt-"]',
  );

  if (!urlInput || !altInput) {
    return;
  }

  urlInput.addEventListener("input", () => {
    updateMediaPreview(mediaField);
  });

  altInput.addEventListener("input", () => {
    updateMediaPreview(mediaField);
  });
}

function initializeAllMediaPreviews(): void {
  const mediaFields = document.querySelectorAll<HTMLElement>(".media-field");

  mediaFields.forEach((mediaField) => {
    initializeMediaPreview(mediaField);
  });
}

function renumberMediaFields(): void {
  const mediaFields = document.querySelectorAll<HTMLElement>(".media-field");

  mediaFields.forEach((field, index) => {
    field.dataset.index = String(index);

    const heading = field.querySelector<HTMLHeadingElement>("h3");
    const urlLabel = field.querySelector<HTMLLabelElement>(
      'label[for^="image-url-"]',
    );
    const urlInput = field.querySelector<HTMLInputElement>(
      'input[name^="image-url-"]',
    );
    const altLabel = field.querySelector<HTMLLabelElement>(
      'label[for^="image-alt-"]',
    );
    const altInput = field.querySelector<HTMLInputElement>(
      'input[name^="image-alt-"]',
    );

    if (heading) {
      heading.textContent = `Image ${index + 1}`;
    }

    if (urlLabel) {
      urlLabel.htmlFor = `image-url-${index}`;
    }

    if (urlInput) {
      urlInput.id = `image-url-${index}`;
      urlInput.name = `image-url-${index}`;
    }

    if (altLabel) {
      altLabel.htmlFor = `image-alt-${index}`;
    }

    if (altInput) {
      altInput.id = `image-alt-${index}`;
      altInput.name = `image-alt-${index}`;
    }
  });
}

function createMediaField(index: number): string {
  return `
    <section
      class="media-field space-y-4 rounded-xl border border-border-neutral bg-background px-4 py-4"
      data-index="${index}"
    >
      <div class="flex items-center justify-between gap-4">
        <h3 class="text-lg font-semibold text-text-main">
          Image ${index + 1}
        </h3>

        <button
          type="button"
          class="${buttonStyles.remove} remove-image-button"
        >
          Remove
        </button>
      </div>

      <div class="media-preview overflow-hidden rounded-xl border border-border-neutral bg-surface">
        <div class="flex h-48 items-center justify-center bg-surface px-4 text-center text-sm text-text-muted">
          No image preview available.
        </div>
      </div>

      <div class="space-y-2">
        <label for="image-url-${index}" class="${formStyles.label}">
          Image URL
        </label>
        <input
          id="image-url-${index}"
          name="image-url-${index}"
          type="url"
          placeholder="https://example.com/image.jpg"
          class="${formStyles.input}"
        />
      </div>

      <div class="space-y-2">
        <label for="image-alt-${index}" class="${formStyles.label}">
          Image alt text
        </label>
        <input
          id="image-alt-${index}"
          name="image-alt-${index}"
          type="text"
          placeholder="Describe the listing image"
          class="${formStyles.input}"
        />
      </div>
    </section>
  `;
}

function initializeMediaGallery(): void {
  const addImageButton =
    document.querySelector<HTMLButtonElement>("#add-image-button");
  const mediaFieldsContainer =
    document.querySelector<HTMLDivElement>("#media-fields");

  if (!addImageButton || !mediaFieldsContainer) {
    return;
  }

  initializeAllMediaPreviews();

  addImageButton.addEventListener("click", () => {
    const mediaFields =
      mediaFieldsContainer.querySelectorAll<HTMLElement>(".media-field");
    const nextIndex = mediaFields.length;

    mediaFieldsContainer.insertAdjacentHTML(
      "beforeend",
      createMediaField(nextIndex),
    );

    const newMediaFields =
      mediaFieldsContainer.querySelectorAll<HTMLElement>(".media-field");
    const newestMediaField = newMediaFields[newMediaFields.length - 1];

    if (newestMediaField) {
      initializeMediaPreview(newestMediaField);
    }
  });

  mediaFieldsContainer.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const removeButton = target.closest<HTMLButtonElement>(
      ".remove-image-button",
    );

    if (!removeButton) {
      return;
    }

    const mediaField = removeButton.closest<HTMLElement>(".media-field");

    if (!mediaField) {
      return;
    }

    mediaField.remove();
    renumberMediaFields();
  });
}

if (app) {
  const accessToken = getAccessToken();
  const apiKey = getApiKey();

  if (!accessToken || !apiKey) {
    renderUnauthorizedState();
  } else {
    app.innerHTML = createLayout(createCreateListingPage());

    initializeNavigation();
    initializeMediaGallery();

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

          const createdListing = await createListing(
            listingData,
            accessToken,
            apiKey,
          );

          message.textContent = "Listing created successfully. Redirecting...";
          message.className = alertStyles.success;

          form.reset();

          setTimeout(() => {
            window.location.href = `${ROUTES.singleListing}?id=${createdListing.id}`;
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
