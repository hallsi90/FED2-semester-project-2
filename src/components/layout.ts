import logoFull from "../assets/auction-house-logo.png";
import logoMark from "../assets/auction-house-logo-mark.png";
import { createNavigation } from "./navigation";
import { createFooter } from "./footer";

// Creates the shared page layout with header, main content area, footer, and a reusable scroll-to-top button shown across the application.
export function createLayout(content: string): string {
  return `
    <div class="flex min-h-screen flex-col bg-background text-text-main">
      <header class="border-b border-border-neutral bg-white">
        <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <a href="/" class="flex items-center">
            <img
              src="${logoMark}"
              alt="Auction House"
              class="h-10 w-auto object-contain md:hidden"
            />
            <img
              src="${logoFull}"
              alt="Auction House"
              class="hidden h-12 w-auto object-contain md:block lg:h-14"
            />
          </a>

          ${createNavigation()}
        </div>
      </header>

      <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8 lg:px-8">
        ${content}
      </main>

      ${createFooter()}

      <button
        id="scroll-to-top-button"
        type="button"
        aria-label="Scroll back to top"
        class="fixed bottom-5 right-4 z-50 hidden h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-accent/40 bg-white text-accent shadow-2xl ring-1 ring-black/10 transition hover:border-accent hover:bg-accent/10 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 md:bottom-6 md:right-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </button>
    </div>
  `;
}
