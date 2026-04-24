import "../style.css";
import { createApiKey } from "../api/auth/create-api-key";
import { loginUser } from "../api/auth/login";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { alertStyles } from "../components/ui";
import { createLoginPage } from "../pages/login-page";
import { getApiKey, saveApiKey, saveAuth } from "../utils/auth-storage";
import { validateLoginForm } from "../utils/validation";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = createLayout(createLoginPage());

  initializeMobileMenu();
  initializeProfileMenu();
  initializeLogout();

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
        message.className = alertStyles.error;
        return;
      }

      try {
        message.textContent = "Logging you in...";
        message.className = alertStyles.info;

        const response = await loginUser(formValues);

        saveAuth({
          accessToken: response.data.accessToken,
          profile: response.data,
        });

        const existingApiKey = getApiKey();

        if (!existingApiKey) {
          const apiKey = await createApiKey(response.data.accessToken);
          saveApiKey(apiKey);
        }

        message.textContent = "Login successful. Redirecting...";
        message.className = alertStyles.success;

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
        message.className = alertStyles.error;
      }
    });
  }
}
