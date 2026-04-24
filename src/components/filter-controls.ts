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

      <select
        id="category"
        name="category"
        class="${formStyles.input}"
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
    </div>
  `;
}
