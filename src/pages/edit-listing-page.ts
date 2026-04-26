import { buttonStyles, cardStyles, formStyles } from "../components/ui";
import type { Listing } from "../types/api";

// Creates the edit listing page layout for preview and later update logic.
export function createEditListingPage(listing: Listing): string {
  const mediaItems =
    listing.media.length > 0 ? listing.media : [{ url: "", alt: "" }];

  const mediaFields = mediaItems
    .map((mediaItem, index) => {
      const imageUrl = mediaItem.url || "";
      const imageAlt = mediaItem.alt || "";

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
            ${
              imageUrl
                ? `
                  <img
                    src="${imageUrl}"
                    alt="${imageAlt || `Preview of image ${index + 1}`}"
                    class="h-48 w-full object-cover"
                  />
                `
                : `
                  <div class="flex h-48 items-center justify-center bg-surface px-4 text-center text-sm text-text-muted">
                    No image preview available.
                  </div>
                `
            }
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
              value="${imageUrl}"
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
              value="${imageAlt}"
            />
          </div>
        </section>
      `;
    })
    .join("");

  return `
    <section class="mx-auto w-full max-w-2xl space-y-8">
      <header class="space-y-3">
        <h1 class="text-3xl font-bold text-text-main md:text-4xl">
          Edit listing
        </h1>
        <p class="text-base leading-7 text-text-muted">
          Update your listing details, tags, and image information.
        </p>
      </header>

      <section class="${cardStyles.base}">
        <form class="space-y-5" novalidate>
          <div id="edit-listing-message" class="hidden"></div>

          <div class="space-y-2">
            <label for="title" class="${formStyles.label}">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter listing title"
              class="${formStyles.input}"
              value="${listing.title}"
            />
          </div>

          <div class="space-y-2">
            <label for="description" class="${formStyles.label}">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Describe the item"
              class="${formStyles.textarea}"
            >${listing.description || ""}</textarea>
          </div>

          <div class="space-y-2">
            <label for="tags" class="${formStyles.label}">
              Tags
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              placeholder="camera, vintage, electronics"
              class="${formStyles.input}"
              value="${listing.tags.join(", ")}"
            />
            <p class="${formStyles.helperText}">
              Separate tags with commas.
            </p>
          </div>

          <div class="space-y-3">
            <div class="space-y-1">
              <h2 class="text-xl font-semibold text-text-main">Media gallery</h2>
              <p class="${formStyles.helperText}">
                Manage your listing images below.
              </p>
            </div>

            <div id="media-fields" class="space-y-4">
              ${mediaFields}
            </div>

            <button
              id="add-image-button"
              type="button"
              class="${buttonStyles.secondary}"
            >
              Add another image
            </button>
          </div>

          <div class="rounded-xl bg-background px-5 py-4">
            <p class="text-sm font-medium text-text-muted">Ends at</p>
            <p class="mt-2 text-base font-semibold text-text-main">
              ${listing.endsAt}
            </p>
            <p class="mt-2 ${formStyles.helperText}">
              The auction end date cannot be changed after a listing is created.
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="submit" class="${buttonStyles.primary}">
              Save changes
            </button>

            <a href="/profile/" class="${buttonStyles.secondary}">
              Cancel
            </a>

            <button type="button" class="${buttonStyles.danger}">
              Delete listing
            </button>
          </div>
        </form>
      </section>
    </section>
  `;
}
