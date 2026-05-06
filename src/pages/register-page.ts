import { buttonStyles, cardStyles, formStyles } from "../components/ui";
import { ROUTES } from "../constants/routes";

// Creates the registration page layout.
export function createRegisterPage(): string {
  return `
    <section class="mx-auto w-full max-w-md space-y-8 lg:max-w-xl">
      <header class="space-y-3 text-center">
        <h1 class="text-3xl font-bold text-text-main md:text-4xl">
          Register
        </h1>
        <p class="text-base leading-7 text-text-muted">
          Create an account to place bids, manage listings, and access your profile.
        </p>
      </header>

      <section class="${cardStyles.base}">
        <form class="space-y-5" novalidate>
          <div
            id="register-message"
            class="hidden"
            aria-live="polite"
            aria-atomic="true"
          ></div>

          <div class="space-y-2">
            <label for="name" class="${formStyles.label}">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              class="${formStyles.input}"
              autocomplete="username"
              autocapitalize="none"
              spellcheck="false"
              required
              aria-describedby="name-error"
            />
            <p
              id="name-error"
              class="${formStyles.errorText} hidden"
              aria-live="polite"
            ></p>
          </div>

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
              inputmode="email"
              autocapitalize="off"
              spellcheck="false"
              required
              aria-describedby="email-error"
            />
            <p
              id="email-error"
              class="${formStyles.errorText} hidden"
              aria-live="polite"
            ></p>
          </div>

          <div class="space-y-2">
            <label for="password" class="${formStyles.label}">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              class="${formStyles.input}"
              autocomplete="new-password"
              autocapitalize="off"
              spellcheck="false"
              required
              aria-describedby="password-error password-helper"
            />
            <p id="password-helper" class="${formStyles.helperText}">
              Password must be at least 8 characters long.
            </p>
            <p
              id="password-error"
              class="${formStyles.errorText} hidden"
              aria-live="polite"
            ></p>
          </div>

          <button type="submit" class="${buttonStyles.primary} w-full">
            Register
          </button>
        </form>
      </section>

      <p class="text-center text-sm text-text-muted">
        Already have an account?
        <a
          href="${ROUTES.login}"
          class="font-semibold text-primary-action transition hover:text-primary-action-hover"
        >
          Log in here
        </a>
      </p>
    </section>
  `;
}
