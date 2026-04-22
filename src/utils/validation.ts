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
