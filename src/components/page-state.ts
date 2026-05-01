import { buttonStyles, alertStyles } from "./ui";

type PageStateTone = "error" | "info" | "warning" | "success";

interface PageStateOptions {
  title: string;
  message: string;
  eyebrow?: string;
  tone?: PageStateTone;
  actionHref?: string;
  actionLabel?: string;
}

// Creates a shared page-level state section for error and feedback messages.
export function createPageState({
  title,
  message,
  eyebrow,
  tone = "error",
  actionHref,
  actionLabel,
}: PageStateOptions): string {
  const toneClass =
    tone === "success"
      ? alertStyles.success
      : tone === "warning"
        ? alertStyles.warning
        : tone === "info"
          ? alertStyles.info
          : alertStyles.error;

  const actionMarkup =
    actionHref && actionLabel
      ? `
        <a href="${actionHref}" class="${buttonStyles.primary}">
          ${actionLabel}
        </a>
      `
      : "";

  return `
    <section class="space-y-4">
      ${
        eyebrow
          ? `
            <p class="text-sm font-medium text-text-muted">
              ${eyebrow}
            </p>
          `
          : ""
      }

      <h1 class="text-3xl font-bold text-text-main md:text-4xl">
        ${title}
      </h1>

      <div class="${toneClass}">
        ${message}
      </div>

      ${actionMarkup}
    </section>
  `;
}
