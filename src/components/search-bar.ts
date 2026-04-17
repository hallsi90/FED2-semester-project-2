import { formStyles } from "./ui";

// Creates a reusable search bar component.
export function createSearchBar(): string {
  return `
    <div class="space-y-2">
      <label
        for="search"
        class="${formStyles.label}"
      >
        Search listings
      </label>

      <div class="relative">
        <span
          aria-hidden="true"
          class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
        >
          🔍
        </span>

        <input
          id="search"
          type="search"
          placeholder="Search by title or keyword"
          class="${formStyles.input} pl-11"
        />
      </div>
    </div>
  `;
}
