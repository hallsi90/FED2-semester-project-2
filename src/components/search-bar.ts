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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.5 3a5.5 5.5 0 1 0 3.47 9.77l3.63 3.63a.75.75 0 1 0 1.06-1.06l-3.63-3.63A5.5 5.5 0 0 0 8.5 3ZM4.5 8.5a4 4 0 1 1 8 0a4 4 0 0 1-8 0Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>

        <input
          id="search"
          name="search"
          type="search"
          placeholder="Search by title or keyword"
          class="${formStyles.input} pl-11"
          autocomplete="off"
        />
      </div>
    </div>
  `;
}
