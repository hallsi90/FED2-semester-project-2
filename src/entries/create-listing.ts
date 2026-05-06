import "../style.css";
import { createListing } from "../api/listings/create-listing";
import { renderAuthRequiredState } from "../components/auth-required-state";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { initializeScrollToTop } from "../components/scroll-to-top";
import { alertStyles, buttonStyles, formStyles } from "../components/ui";
import { ROUTES } from "../constants/routes";
import { createCreateListingPage } from "../pages/create-listing-page";
import { getAccessToken, getApiKey } from "../utils/auth-storage";
import { validateCreateListingForm } from "../utils/validation";
import type { CreateListingBody, MediaItem } from "../types/api";

const app = document.querySelector<HTMLDivElement>("#app");

document.title = "Create listing | Auction House";

function initializeNavigation(): void {
  initializeMobileMenu();
  initializeProfileMenu();
  initializeLogout();
  initializeScrollToTop();
}

function renderUnauthorizedState(): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(
    renderAuthRequiredState(
      "Create listing",
      "You must be logged in to create a listing.",
    ),
  );

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
      urlInput.setAttribute("aria-describedby", "media-helper media-error");
    }

    if (altLabel) {
      altLabel.htmlFor = `image-alt-${index}`;
    }

    if (altInput) {
      altInput.id = `image-alt-${index}`;
      altInput.name = `image-alt-${index}`;
      altInput.setAttribute("aria-describedby", "media-helper media-error");
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
          inputmode="url"
          autocapitalize="off"
          spellcheck="false"
          aria-describedby="media-helper media-error"
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
          aria-describedby="media-helper media-error"
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

function clearFieldError(
  input: HTMLInputElement | HTMLTextAreaElement,
  errorElement: HTMLElement,
): void {
  input.setAttribute("aria-invalid", "false");
  errorElement.textContent = "";
  errorElement.classList.add("hidden");
}

function showFieldError(
  input: HTMLInputElement | HTMLTextAreaElement,
  errorElement: HTMLElement,
  errorMessage: string,
): void {
  input.setAttribute("aria-invalid", "true");
  errorElement.textContent = errorMessage;
  errorElement.classList.remove("hidden");
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

    const titleError =
      document.querySelector<HTMLParagraphElement>("#title-error");
    const endsAtError =
      document.querySelector<HTMLParagraphElement>("#ends-at-error");
    const mediaError =
      document.querySelector<HTMLParagraphElement>("#media-error");

    if (
      form &&
      message &&
      titleInput &&
      descriptionInput &&
      tagsInput &&
      endsAtInput &&
      titleError &&
      endsAtError &&
      mediaError
    ) {
      titleInput.addEventListener("input", () => {
        clearFieldError(titleInput, titleError);
      });

      endsAtInput.addEventListener("input", () => {
        clearFieldError(endsAtInput, endsAtError);
      });

      const now = new Date();
      // Formats the current local date and time for the datetime-local input.
      const localDateTime = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .slice(0, 16);

      endsAtInput.min = localDateTime;

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        message.textContent = "";
        message.className = "hidden";

        clearFieldError(titleInput, titleError);
        clearFieldError(endsAtInput, endsAtError);
        mediaError.textContent = "";
        mediaError.classList.add("hidden");

        const media = getMedia();

        const validationErrors = validateCreateListingForm({
          title: titleInput.value,
          endsAt: endsAtInput.value,
          media: media.map((item) => ({
            url: item.url || "",
            alt: item.alt || "",
          })),
        });

        if (
          validationErrors.title ||
          validationErrors.endsAt ||
          validationErrors.media
        ) {
          if (validationErrors.title) {
            showFieldError(titleInput, titleError, validationErrors.title);
          }

          if (validationErrors.endsAt) {
            showFieldError(endsAtInput, endsAtError, validationErrors.endsAt);
          }

          if (validationErrors.media) {
            mediaError.textContent = validationErrors.media;
            mediaError.classList.remove("hidden");
          }

          message.textContent = "Please correct the highlighted fields.";
          message.className = alertStyles.error;
          message.setAttribute("role", "alert");

          if (validationErrors.title) {
            titleInput.focus();
          } else if (validationErrors.endsAt) {
            endsAtInput.focus();
          }

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
          message.setAttribute("role", "status");

          const createdListing = await createListing(
            listingData,
            accessToken,
            apiKey,
          );

          message.textContent = "Listing created successfully. Redirecting...";
          message.className = alertStyles.success;
          message.setAttribute("role", "status");

          form.reset();

          setTimeout(() => {
            window.location.href = `${ROUTES.singleListing}?id=${createdListing.id}`;
          }, 1500);
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Something went wrong while creating the listing.";

          const firstImageUrlInput = document.querySelector<HTMLInputElement>(
            'input[name^="image-url-"]',
          );

          if (errorMessage.toLowerCase().includes("image")) {
            mediaError.textContent = errorMessage;
            mediaError.classList.remove("hidden");

            message.textContent = "Please correct the highlighted fields.";
            message.className = alertStyles.error;
            message.setAttribute("role", "alert");

            firstImageUrlInput?.focus();
            return;
          }

          message.textContent = errorMessage;
          message.className = alertStyles.error;
          message.setAttribute("role", "alert");
        }
      });
    }
  }
}
