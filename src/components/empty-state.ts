import { buttonStyles, cardStyles } from "./ui";

interface EmptyStateOptions {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
  compact?: boolean;
}

// Creates a reusable empty-state section for pages and content areas.
export function createEmptyState({
  title,
  message,
  actionHref,
  actionLabel,
  compact = false,
}: EmptyStateOptions): string {
  return `
    <div class="${cardStyles.base} ${compact ? "" : "py-8"} text-center">
      <div class="mx-auto flex max-w-md flex-col items-center gap-3">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-background text-text-muted"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3 4.75A1.75 1.75 0 0 1 4.75 3h10.5A1.75 1.75 0 0 1 17 4.75v8.5A1.75 1.75 0 0 1 15.25 15H4.75A1.75 1.75 0 0 1 3 13.25v-8.5ZM4.5 6.5a.75.75 0 0 0 0 1.5h11a.75.75 0 0 0 0-1.5h-11Zm0 3a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z" />
          </svg>
        </div>

        <div class="space-y-2">
          <h3 class="text-xl font-semibold text-text-main">
            ${title}
          </h3>
          <p class="text-sm leading-7 text-text-muted">
            ${message}
          </p>
        </div>

        ${
          actionHref && actionLabel
            ? `
              <a href="${actionHref}" class="${buttonStyles.primary}">
                ${actionLabel}
              </a>
            `
            : ""
        }
      </div>
    </div>
  `;
}
