// Creates the shared footer used across the application.
export function createFooter(): string {
  return `
    <footer class="border-t border-[#D1D5DB] bg-white">
      <div class="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 lg:px-8">
        <div class="grid gap-10 text-center md:grid-cols-3 md:text-left">
          <section>
            <h2 class="mb-4 text-lg font-semibold text-[#111827]">About</h2>
            <ul class="space-y-3 text-base text-[#4B5563]">
              <li>
                <a href="/" class="transition hover:text-[#2563EB]">About us</a>
              </li>
              <li>
                <a href="/" class="transition hover:text-[#2563EB]">How it works</a>
              </li>
              <li>
                <a href="/" class="transition hover:text-[#2563EB]">Contact</a>
              </li>
            </ul>
          </section>

          <section>
            <h2 class="mb-4 text-lg font-semibold text-[#111827]">Support</h2>
            <ul class="space-y-3 text-base text-[#4B5563]">
              <li>
                <a href="/" class="transition hover:text-[#2563EB]">Help center</a>
              </li>
              <li>
                <a href="/" class="transition hover:text-[#2563EB]">Safety</a>
              </li>
              <li>
                <a href="/" class="transition hover:text-[#2563EB]">Terms of service</a>
              </li>
              <li>
                <a href="/" class="transition hover:text-[#2563EB]">Privacy policy</a>
              </li>
            </ul>
          </section>

          <section class="mx-auto w-full max-w-sm md:mx-0 md:max-w-none">
            <h2 class="mb-4 text-lg font-semibold text-[#111827]">Newsletter</h2>
            <p class="mb-4 text-base leading-6 text-[#4B5563]">
              Stay updated with the latest auctions and platform news.
            </p>

            <form class="flex flex-col gap-3 sm:flex-row md:flex-col xl:flex-row">
              <input
                type="email"
                placeholder="Your email"
                class="w-full rounded-xl border border-[#D1D5DB] bg-white px-4 py-3 text-base text-[#111827] outline-none transition placeholder:text-[#4B5563] focus:border-[#2563EB]"
              />
              <button
                type="submit"
                class="rounded-xl bg-[#1F2937] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#111827]"
              >
                Subscribe
              </button>
            </form>
          </section>
        </div>

        <div class="mt-10 border-t border-[#D1D5DB] pt-6 text-center">
          <p class="text-sm text-[#4B5563]">
            &copy; 2026 Auction House. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  `;
}
