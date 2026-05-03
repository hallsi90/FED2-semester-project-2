import logoFull from "../assets/auction-house-logo.png";
import logoMark from "../assets/auction-house-logo-mark.png";
import { createNavigation } from "./navigation";
import { createFooter } from "./footer";

// Creates the shared page layout with header, main content area, and footer wrapper used across the application.
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
    </div>
  `;
}
