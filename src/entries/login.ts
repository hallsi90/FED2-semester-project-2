import "../style.css";
import { createLayout } from "../components/layout";
import {
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { loginUser } from "../api/auth/login";
import { createLoginPage } from "../pages/login-page";
import { saveAuth } from "../utils/auth-storage";
import { validateLoginForm } from "../utils/validation";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = createLayout(createLoginPage());

  initializeMobileMenu();
  initializeProfileMenu();

  const form = document.querySelector<HTMLFormElement>("form");
  const message = document.querySelector<HTMLDivElement>("#login-message");
  const emailInput = document.querySelector<HTMLInputElement>("#email");
  const passwordInput = document.querySelector<HTMLInputElement>("#password");

  if (form && message && emailInput && passwordInput) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formValues = {
        email: emailInput.value.trim(),
        password: passwordInput.value,
      };

      const errors = validateLoginForm(formValues);

      if (errors.email || errors.password) {
        const errorMessages = Object.values(errors).filter(Boolean).join(" ");

        message.textContent = errorMessages;
        message.className =
          "rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error";

        return;
      }

      try {
        message.textContent = "Logging you in...";
        message.className =
          "rounded-xl border border-primary-action/20 bg-primary-action/10 px-4 py-3 text-sm text-primary-action";

        const response = await loginUser(formValues);

        saveAuth({
          accessToken: response.data.accessToken,
          profile: response.data,
        });

        message.textContent = "Login successful. Redirecting...";
        message.className =
          "rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success";

        form.reset();

        setTimeout(() => {
          window.location.href = "/profile/";
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
