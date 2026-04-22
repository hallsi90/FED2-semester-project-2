import "../style.css";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { registerUser } from "../api/auth/register";
import { createRegisterPage } from "../pages/register-page";
import { validateRegisterForm } from "../utils/validation";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = createLayout(createRegisterPage());

  initializeMobileMenu();
  initializeProfileMenu();
  initializeLogout();

  const form = document.querySelector<HTMLFormElement>("form");
  const message = document.querySelector<HTMLDivElement>("#register-message");
  const nameInput = document.querySelector<HTMLInputElement>("#name");
  const emailInput = document.querySelector<HTMLInputElement>("#email");
  const passwordInput = document.querySelector<HTMLInputElement>("#password");

  if (form && message && nameInput && emailInput && passwordInput) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formValues = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
      };

      const errors = validateRegisterForm(formValues);

      if (errors.name || errors.email || errors.password) {
        const errorMessages = Object.values(errors).filter(Boolean).join(" ");

        message.textContent = errorMessages;
        message.className =
          "rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error";

        return;
      }

      try {
        message.textContent = "Creating your account...";
        message.className =
          "rounded-xl border border-primary-action/20 bg-primary-action/10 px-4 py-3 text-sm text-primary-action";

        await registerUser(formValues);

        message.textContent =
          "Registration successful. Redirecting to login...";
        message.className =
          "rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success";

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
        message.className =
          "rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error";
      }
    });
  }
}
