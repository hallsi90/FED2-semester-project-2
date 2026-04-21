import { buttonStyles, cardStyles, formStyles } from "../components/ui";

// Creates the login page layout for preview and later authentication logic.
export function createLoginPage(): string {
  return `
    <section class="mx-auto w-full max-w-md space-y-8">
      <header class="space-y-3 text-center">
        <h1 class="text-3xl font-bold text-text-main md:text-4xl">
          Log in
        </h1>
        <p class="text-base leading-7 text-text-muted">
          Log in to place bids, manage your listings, and view your profile.
        </p>
      </header>

      <section class="${cardStyles.base}">
        <form class="space-y-5" novalidate>
          <div id="login-message" class="hidden"></div>

          <div class="space-y-2">
            <label for="email" class="${formStyles.label}">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@stud.noroff.no"
              class="${formStyles.input}"
              autocomplete="email"
            />
          </div>

          <div class="space-y-2">
            <label for="password" class="${formStyles.label}">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              class="${formStyles.input}"
              autocomplete="current-password"
            />
          </div>

          <button type="submit" class="${buttonStyles.primary} w-full">
            Log in
          </button>
        </form>
      </section>

      <p class="text-center text-sm text-text-muted">
        Don’t have an account?
        <a
          href="/register/"
          class="font-semibold text-primary-action transition hover:text-primary-action-hover"
        >
          Register here
        </a>
      </p>
    </section>
  `;
}