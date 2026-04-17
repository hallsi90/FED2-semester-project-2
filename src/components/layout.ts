// layout.ts
// Creates the shared page layout with header, main content area, and footer wrapper used across the application.

import { createNavigation } from "./navigation";

export function createLayout(content: string): string {
  return `
    <div class="flex min-h-screen flex-col bg-[#F9FAFB] text-[#111827]">
      <header class="border-b border-[#D1D5DB] bg-white">
        <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <a href="/" class="flex items-center gap-3">
            <span class="text-xl font-bold text-[#1F2937]">
              Auction House
            </span>
          </a>

          ${createNavigation()}
        </div>
      </header>

      <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8 lg:px-8">
        ${content}
      </main>

      <footer class="border-t border-[#D1D5DB] bg-white">
        <div class="mx-auto w-full max-w-6xl px-4 py-4 text-sm text-[#4B5563] md:px-6 lg:px-8">
          <p>&copy; 2026 Auction House</p>
        </div>
      </footer>
    </div>
  `;
}
