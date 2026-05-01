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
    <section class="space-y-6">
      <div class="space-y-4">
        ${
          eyebrow
            ? `
              <p class="text-sm font-medium text-text-muted">
                ${eyebrow}
              </p>
            `
            : ""
        }

        <div class="space-y-3">
          <h1 class="text-3xl font-bold text-text-main md:text-4xl">
            ${title}
          </h1>

          ${
            message
              ? `
                <p class="max-w-2xl text-base text-text-muted">
                  ${message}
                </p>
              `
              : ""
          }
        </div>
      </div>

      <div
        class="space-y-4 rounded-xl border border-border-neutral bg-surface p-4 shadow-sm"
        aria-hidden="true"
      >
        <div class="animate-pulse space-y-4">
          <div class="h-6 w-40 rounded-lg bg-background"></div>
          <div class="h-4 w-full max-w-2xl rounded-lg bg-background"></div>
          <div class="h-4 w-3/4 rounded-lg bg-background"></div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="h-40 rounded-xl bg-background"></div>
            <div class="space-y-3">
              <div class="h-5 w-32 rounded-lg bg-background"></div>
              <div class="h-4 w-full rounded-lg bg-background"></div>
              <div class="h-4 w-5/6 rounded-lg bg-background"></div>
              <div class="h-10 w-32 rounded-xl bg-background"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
