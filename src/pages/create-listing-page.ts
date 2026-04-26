import { buttonStyles, cardStyles, formStyles } from "../components/ui";

// Creates the create listing page layout for preview and later listing logic.
export function createCreateListingPage(): string {
  return `
    <section class="mx-auto w-full max-w-2xl space-y-8">
      <header class="space-y-3">
        <h1 class="text-3xl font-bold text-text-main md:text-4xl">
          Create listing
        </h1>
        <p class="text-base leading-7 text-text-muted">
          Add a new auction listing with details, tags, image information, and an end date.
        </p>
      </header>

      <section class="${cardStyles.base}">
        <form class="space-y-5" novalidate>
          <div id="create-listing-message" class="hidden"></div>

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
            ></textarea>
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
            />
            <p class="${formStyles.helperText}">
              Separate tags with commas.
            </p>
          </div>

          <div class="space-y-3">
            <div class="space-y-1">
              <h2 class="text-xl font-semibold text-text-main">Media gallery</h2>
              <p class="${formStyles.helperText}">
                Add one or more images for your listing.
              </p>
            </div>

            <div id="media-fields" class="space-y-4">
              <section
                class="media-field space-y-4 rounded-xl border border-border-neutral bg-background px-4 py-4"
                data-index="0"
              >
                <div class="flex items-center justify-between gap-4">
                  <h3 class="text-lg font-semibold text-text-main">
                    Image 1
                  </h3>
                </div>

                <div class="media-preview overflow-hidden rounded-xl border border-border-neutral bg-surface">
                  <div class="flex h-48 items-center justify-center bg-surface px-4 text-center text-sm text-text-muted">
                    No image preview available.
                  </div>
                </div>

                <div class="space-y-2">
                  <label for="image-url-0" class="${formStyles.label}">
                    Image URL
                  </label>
                  <input
                    id="image-url-0"
                    name="image-url-0"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    class="${formStyles.input}"
                  />
                </div>

                <div class="space-y-2">
                  <label for="image-alt-0" class="${formStyles.label}">
                    Image alt text
                  </label>
                  <input
                    id="image-alt-0"
                    name="image-alt-0"
                    type="text"
                    placeholder="Describe the listing image"
                    class="${formStyles.input}"
                  />
                </div>
              </section>
            </div>

            <button
              id="add-image-button"
              type="button"
              class="${buttonStyles.secondary}"
            >
              Add another image
            </button>
          </div>

          <div class="space-y-2">
            <label for="ends-at" class="${formStyles.label}">
              End date
            </label>
            <input
              id="ends-at"
              name="ends-at"
              type="datetime-local"
              class="${formStyles.input}"
            />
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <button type="submit" class="${buttonStyles.primary}">
              Publish listing
            </button>

            <a href="/" class="${buttonStyles.secondary}">
              Cancel
            </a>
          </div>
        </form>
      </section>
    </section>
  `;
}
