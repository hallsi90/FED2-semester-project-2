import "../style.css";
import { deleteListing } from "../api/listings/delete-listing";
import { getListingById } from "../api/listings/get-listing";
import { updateListing } from "../api/listings/update-listing";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { alertStyles, buttonStyles, formStyles } from "../components/ui";
import { renderAuthRequiredState } from "../components/auth-required-state";
import { createEditListingPage } from "../pages/edit-listing-page";
import { ROUTES } from "../constants/routes";
import {
  getAccessToken,
  getApiKey,
  getProfile as getStoredProfile,
} from "../utils/auth-storage";
import { validateUpdateListingForm } from "../utils/validation";
import type { Listing, MediaItem, UpdateListingBody } from "../types/api";

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
      alt,
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
    updateMediaPreview(mediaField);
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

function updateAddImageButtonText(): void {
  const addImageButton =
    document.querySelector<HTMLButtonElement>("#add-image-button");
  const mediaFields = document.querySelectorAll<HTMLElement>(".media-field");

  if (!addImageButton) {
    return;
  }

  addImageButton.textContent =
    mediaFields.length === 0 ? "Add image" : "Add another image";
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
  updateAddImageButtonText();

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

    updateAddImageButtonText();
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
    updateAddImageButtonText();
  });
}

function initializeDeleteListingButton(listingId: string): void {
  const accessToken = getAccessToken();
  const apiKey = getApiKey();

  const deleteButton = document.querySelector<HTMLButtonElement>(
    "#delete-listing-button",
  );
  const confirmDeleteButton = document.querySelector<HTMLButtonElement>(
    "#confirm-delete-button",
  );
  const cancelDeleteButton = document.querySelector<HTMLButtonElement>(
    "#cancel-delete-button",
  );
  const modal = document.querySelector<HTMLDivElement>("#delete-modal");
  const message = document.querySelector<HTMLDivElement>(
    "#edit-listing-message",
  );

  if (
    !deleteButton ||
    !confirmDeleteButton ||
    !cancelDeleteButton ||
    !modal ||
    !message
  ) {
    return;
  }

  const deleteModal = modal;

  function openModal(): void {
    deleteModal.classList.remove("hidden");
    deleteModal.classList.add("flex");
  }

  function closeModal(): void {
    deleteModal.classList.add("hidden");
    deleteModal.classList.remove("flex");
  }

  deleteButton.addEventListener("click", () => {
    openModal();
  });

  cancelDeleteButton.addEventListener("click", () => {
    closeModal();
  });

  deleteModal.addEventListener("click", (event) => {
    if (event.target === deleteModal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !deleteModal.classList.contains("hidden")) {
      closeModal();
    }
  });

  confirmDeleteButton.addEventListener("click", async () => {
    if (!accessToken || !apiKey) {
      closeModal();
      message.textContent = "You must be logged in to delete a listing.";
      message.className = alertStyles.error;
      return;
    }

    try {
      closeModal();

      message.textContent = "Deleting listing...";
      message.className = alertStyles.info;

      await deleteListing(listingId, accessToken, apiKey);

      message.textContent = "Listing deleted successfully. Redirecting...";
      message.className = alertStyles.success;

      setTimeout(() => {
        window.location.href = ROUTES.profile;
      }, 1500);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting the listing.";

      message.textContent = errorMessage;
      message.className = alertStyles.error;
    }
  });
}

function initializeEditListingForm(listingId: string): void {
  const accessToken = getAccessToken();
  const apiKey = getApiKey();

  const form = document.querySelector<HTMLFormElement>("form");
  const message = document.querySelector<HTMLDivElement>(
    "#edit-listing-message",
  );
  const titleInput = document.querySelector<HTMLInputElement>("#title");
  const descriptionInput =
    document.querySelector<HTMLTextAreaElement>("#description");
  const tagsInput = document.querySelector<HTMLInputElement>("#tags");

  if (!form || !message || !titleInput || !descriptionInput || !tagsInput) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!accessToken || !apiKey) {
      message.textContent = "You must be logged in to update a listing.";
      message.className = alertStyles.error;
      return;
    }

    const media = getMedia();

    const validationErrors = validateUpdateListingForm({
      title: titleInput.value,
      media: media.map((item) => ({
        url: item.url,
        alt: item.alt || "",
      })),
    });

    const errorMessages = [
      validationErrors.title,
      validationErrors.media,
    ].filter(Boolean);

    if (errorMessages.length > 0) {
      message.textContent = errorMessages.join(" ");
      message.className = alertStyles.error;
      return;
    }

    const listingData: UpdateListingBody = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim() || undefined,
      tags: getTags(tagsInput.value),
      media,
    };

    try {
      message.textContent = "Saving changes...";
      message.className = alertStyles.info;

      const updatedListing = await updateListing(
        listingId,
        listingData,
        accessToken,
        apiKey,
      );

      message.textContent = "Listing updated successfully. Redirecting...";
      message.className = alertStyles.success;

      setTimeout(() => {
        window.location.href = `${ROUTES.singleListing}?id=${updatedListing.id}`;
      }, 1500);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong while updating the listing.";

      message.textContent = errorMessage;
      message.className = alertStyles.error;
    }
  });
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

  const storedProfile = getStoredProfile();

  if (!storedProfile?.name) {
    app.innerHTML = createLayout(
      renderAuthRequiredState(
        "Edit listing unavailable",
        "You must be logged in to edit a listing.",
      ),
    );
    initializeNavigation();
    return;
  }

  renderLoadingState();

  try {
    const listing: Listing = await getListingById(listingId);

    if (!listing.seller?.name) {
      renderErrorState("This listing has no owner information.");
      return;
    }

    if (listing.seller.name !== storedProfile.name) {
      renderErrorState("You are not allowed to edit this listing.");
      return;
    }

    app.innerHTML = createLayout(createEditListingPage(listing));
    initializeNavigation();
    initializeMediaGallery();
    initializeEditListingForm(listingId);
    initializeDeleteListingButton(listingId);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading the listing.";

    renderErrorState(errorMessage);
  }
}

void renderEditListingPage();
