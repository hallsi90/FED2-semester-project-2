import { formStyles } from "./ui";

// Creates a reusable category filter control for the listings page.
export function createFilterControls(): string {
  return `
    <div class="space-y-2">
      <label
        for="category"
        class="${formStyles.label}"
      >
        Filter by category
      </label>

      <div class="relative">
        <select
          id="category"
          name="category"
          class="${formStyles.select}"
        >
          <option value="">All categories</option>
          <option value="camera">Camera</option>
          <option value="desk">Desk</option>
          <option value="gaming">Gaming</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="fashion">Fashion</option>
          <option value="watch">Watch</option>
          <option value="music">Music</option>
          <option value="vintage">Vintage</option>
        </select>

        <span
          aria-hidden="true"
          class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
    </div>
  `;
}
