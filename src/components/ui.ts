// Shared reusable UI class names used across the application.

export const buttonStyles = {
  primary:
    "inline-flex items-center justify-center rounded-xl bg-primary-action px-4 py-2 text-base font-semibold text-white transition hover:bg-primary-action-hover focus:outline-none focus:ring-2 focus:ring-primary-action focus:ring-offset-2",
  secondary:
    "inline-flex items-center justify-center rounded-xl border border-border-neutral bg-white px-4 py-2 text-base font-semibold text-primary-dark transition hover:border-primary-action hover:bg-background hover:text-primary-action focus:outline-none focus:ring-2 focus:ring-primary-action focus:ring-offset-2",
  danger:
    "inline-flex items-center justify-center rounded-xl bg-error px-4 py-2 text-base font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2",
  ghost:
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-base font-semibold text-primary-action transition hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary-action focus:ring-offset-2",
  remove:
    "inline-flex items-center justify-center rounded-lg border border-error bg-surface px-3 py-2 text-sm font-semibold text-error transition hover:bg-error/10 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2",
} as const;

export const formStyles = {
  label: "mb-2 block text-sm font-medium text-text-main",
  input:
    "w-full rounded-[10px] border border-border-neutral bg-surface px-4 py-3 text-base text-text-main outline-none transition placeholder:text-text-muted focus:border-primary-action focus:ring-2 focus:ring-primary-action/20",
  textarea:
    "w-full rounded-[10px] border border-border-neutral bg-surface px-4 py-3 text-base text-text-main outline-none transition placeholder:text-text-muted focus:border-primary-action focus:ring-2 focus:ring-primary-action/20",
  select:
    "w-full appearance-none rounded-[10px] border border-border-neutral bg-surface px-4 py-3 pr-12 text-base text-text-main outline-none transition focus:border-primary-action focus:ring-2 focus:ring-primary-action/20",
  helperText: "mt-2 text-sm text-text-muted",
  errorText: "mt-2 text-sm text-error",
} as const;

export const cardStyles = {
  base: "rounded-xl border border-border-neutral bg-surface p-4 shadow-sm transition",
  interactive:
    "rounded-xl border border-border-neutral bg-surface p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md",
} as const;

export const alertStyles = {
  success:
    "rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success",
  error:
    "rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error",
  warning:
    "rounded-xl border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-warning",
  info: "rounded-xl border border-primary-action/20 bg-primary-action/10 px-4 py-3 text-sm text-primary-action",
} as const;
