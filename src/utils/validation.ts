// Shared validation helpers for authentication and forms.

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  amount?: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface BidFormValues {
  amount: string;
}

export interface BidValidationOptions {
  minAmount?: number;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validates the register form fields and returns field-specific errors.
export function validateRegisterForm(
  values: RegisterFormValues,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password.trim()) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  return errors;
}

// Validates the login form fields and returns field-specific errors.
export function validateLoginForm(values: LoginFormValues): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password.trim()) {
    errors.password = "Password is required.";
  }

  return errors;
}

// Validates the bid form field and returns field-specific errors.
export function validateBidForm(
  values: BidFormValues,

  options: BidValidationOptions = {},
): ValidationErrors {
  const errors: ValidationErrors = {};

  const amount = Number(values.amount);

  const minimumBid = options.minAmount ?? 1;

  if (!values.amount.trim()) {
    errors.amount = "Bid amount is required.";
  } else if (Number.isNaN(amount)) {
    errors.amount = "Enter a valid bid amount.";
  } else if (amount < minimumBid) {
    errors.amount = `Bid must be at least ${minimumBid} credits.`;
  }

  return errors;
}
