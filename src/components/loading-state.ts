interface LoadingStateOptions {
  title: string;
  message?: string;
  eyebrow?: string;
}

// Creates a shared page-level loading state.
export function createLoadingState({
  title,
  message,
  eyebrow,
}: LoadingStateOptions): string {
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

      ${
        message
          ? `
            <p class="text-base text-text-muted">
              ${message}
            </p>
          `
          : ""
      }
    </section>
  `;
}
