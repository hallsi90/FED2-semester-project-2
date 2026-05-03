import "../style.css";
import { registerUser } from "../api/auth/register";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { initializeScrollToTop } from "../components/scroll-to-top";
import { alertStyles } from "../components/ui";
import { createRegisterPage } from "../pages/register-page";
import { validateRegisterForm } from "../utils/validation";

const app = document.querySelector<HTMLDivElement>("#app");

function clearFieldError(
  input: HTMLInputElement,
  errorElement: HTMLElement,
): void {
  input.setAttribute("aria-invalid", "false");
  errorElement.textContent = "";
  errorElement.classList.add("hidden");
}

function showFieldError(
  input: HTMLInputElement,
  errorElement: HTMLElement,
  message: string,
): void {
  input.setAttribute("aria-invalid", "true");
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
}

if (app) {
  app.innerHTML = createLayout(createRegisterPage());

  initializeMobileMenu();
  initializeProfileMenu();
  initializeLogout();
  initializeScrollToTop();

  const form = document.querySelector<HTMLFormElement>("form");
  const message = document.querySelector<HTMLDivElement>("#register-message");
  const nameInput = document.querySelector<HTMLInputElement>("#name");
  const emailInput = document.querySelector<HTMLInputElement>("#email");
  const passwordInput = document.querySelector<HTMLInputElement>("#password");
  const nameError = document.querySelector<HTMLParagraphElement>("#name-error");
  const emailError =
    document.querySelector<HTMLParagraphElement>("#email-error");
  const passwordError =
    document.querySelector<HTMLParagraphElement>("#password-error");

  if (
    form &&
    message &&
    nameInput &&
    emailInput &&
    passwordInput &&
    nameError &&
    emailError &&
    passwordError
  ) {
    nameInput.addEventListener("input", () => {
      clearFieldError(nameInput, nameError);
    });

    emailInput.addEventListener("input", () => {
      clearFieldError(emailInput, emailError);
    });

    passwordInput.addEventListener("input", () => {
      clearFieldError(passwordInput, passwordError);
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      message.textContent = "";
      message.className = "hidden";

      clearFieldError(nameInput, nameError);
      clearFieldError(emailInput, emailError);
      clearFieldError(passwordInput, passwordError);

      const formValues = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
      };

      const errors = validateRegisterForm(formValues);

      if (errors.name || errors.email || errors.password) {
        if (errors.name) {
          showFieldError(nameInput, nameError, errors.name);
        }

        if (errors.email) {
          showFieldError(emailInput, emailError, errors.email);
        }

        if (errors.password) {
          showFieldError(passwordInput, passwordError, errors.password);
        }

        message.textContent = "Please correct the highlighted fields.";
        message.className = alertStyles.error;
        message.setAttribute("role", "alert");

        if (errors.name) {
          nameInput.focus();
        } else if (errors.email) {
          emailInput.focus();
        } else {
          passwordInput.focus();
        }

        return;
      }

      try {
        message.textContent = "Creating your account...";
        message.className = alertStyles.info;
        message.setAttribute("role", "status");

        await registerUser(formValues);

        message.textContent =
          "Registration successful. Redirecting to login...";
        message.className = alertStyles.success;
        message.setAttribute("role", "status");

        form.reset();

        setTimeout(() => {
          window.location.href = "/login/";
        }, 1500);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.";

        message.textContent = errorMessage;
        message.className = alertStyles.error;
        message.setAttribute("role", "alert");
      }
    });
  }
}
