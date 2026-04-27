import { ROUTES } from "../constants/routes";
import { alertStyles } from "./ui";

// Creates a shared unauthorized state for protected pages.
export function renderAuthRequiredState(
  title: string,
  message: string,
): string {
  return `
    <section class="mx-auto w-full max-w-2xl space-y-4">
      <h1 class="text-3xl font-bold text-text-main md:text-4xl">
        ${title}
      </h1>
      <div class="${alertStyles.error}">
        ${message}
      </div>
      <a
        href="${ROUTES.login}"
        class="inline-flex items-center justify-center rounded-xl bg-primary-action px-4 py-2 text-base font-semibold text-white transition hover:bg-primary-action-hover"
      >
        Log in
      </a>
    </section>
  `;
}
