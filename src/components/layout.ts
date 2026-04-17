export function createLayout(content: string): string {
  return `
    <div class="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col">
      <header class="border-b border-[#D1D5DB] bg-white">
        <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <a href="/" class="text-xl font-bold text-[#1F2937]">
            Auction House
          </a>

          <nav aria-label="Main navigation">
            <ul class="flex items-center gap-4 text-sm font-medium">
              <li><a href="/" class="text-[#111827] hover:text-[#2563EB]">Listings</a></li>
              <li><a href="/login/" class="text-[#111827] hover:text-[#2563EB]">Log in</a></li>
              <li><a href="/register/" class="text-[#111827] hover:text-[#2563EB]">Register</a></li>
            </ul>
          </nav>
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
