// Creates the shared footer used across the application.
export function createFooter(): string {
  return `
    <footer class="border-t border-border-neutral bg-white">
      <div class="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 lg:px-8">
        <div class="grid gap-10 text-center md:grid-cols-3 md:text-left">
          <section>
            <h2 class="mb-4 text-lg font-semibold text-text-main">About</h2>
            <ul class="space-y-3 text-base text-text-muted">
              <li>
                <a href="/" class="transition hover:text-primary-action">About us</a>
              </li>
              <li>
                <a href="/" class="transition hover:text-primary-action">How it works</a>
              </li>
              <li>
                <a href="/" class="transition hover:text-primary-action">Contact</a>
              </li>
            </ul>
          </section>

          <section>
            <h2 class="mb-4 text-lg font-semibold text-text-main">Support</h2>
            <ul class="space-y-3 text-base text-text-muted">
              <li>
                <a href="/" class="transition hover:text-primary-action">Help center</a>
              </li>
              <li>
                <a href="/" class="transition hover:text-primary-action">Safety</a>
              </li>
              <li>
                <a href="/" class="transition hover:text-primary-action">Terms of service</a>
              </li>
              <li>
                <a href="/" class="transition hover:text-primary-action">Privacy policy</a>
              </li>
            </ul>
          </section>

          <section class="mx-auto w-full max-w-sm md:mx-0 md:max-w-none">
            <h2 class="mb-4 text-lg font-semibold text-text-main">Newsletter</h2>
            <p class="mb-4 text-base leading-6 text-text-muted">
              Stay updated with the latest auctions and platform news.
            </p>

            <form class="flex flex-col gap-3 sm:flex-row md:flex-col xl:flex-row">
              <input
                type="email"
                placeholder="Your email"
                class="w-full rounded-xl border border-border-neutral bg-white px-4 py-3 text-base text-text-main outline-none transition placeholder:text-text-muted focus:border-primary-action"
              />
              <button
                type="submit"
                class="rounded-xl bg-primary-dark px-5 py-3 text-base font-semibold text-white transition hover:bg-text-main"
              >
                Subscribe
              </button>
            </form>
          </section>
        </div>

        <div class="mt-10 border-t border-border-neutral pt-6 text-center">
          <p class="text-sm text-text-muted">
            &copy; 2026 Auction House. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  `;
}
