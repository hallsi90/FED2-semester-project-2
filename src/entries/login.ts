import "../style.css";
import { createApiKey } from "../api/auth/create-api-key";
import { loginUser } from "../api/auth/login";
import { getProfileByName } from "../api/profile/get-profile";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { initializeScrollToTop } from "../components/scroll-to-top";
import { alertStyles } from "../components/ui";
import { createLoginPage } from "../pages/login-page";
import { ROUTES } from "../constants/routes";
import {
  getApiKey,
  saveApiKey,
  saveAuth,
  saveProfile,
} from "../utils/auth-storage";
import { validateLoginForm } from "../utils/validation";

const app = document.querySelector<HTMLDivElement>("#app");

document.title = "Log in | Auction House";

// Returns a safe internal redirect path after login.
function getRedirectUrl(): string {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");

  if (!redirect) {
    return ROUTES.profile;
  }

  if (!redirect.startsWith("/")) {
    return ROUTES.profile;
  }

  return redirect;
}

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
  app.innerHTML = createLayout(createLoginPage());

  initializeMobileMenu();
  initializeProfileMenu();
  initializeLogout();
  initializeScrollToTop();

  const form = document.querySelector<HTMLFormElement>("form");
  const message = document.querySelector<HTMLDivElement>("#login-message");
  const emailInput = document.querySelector<HTMLInputElement>("#email");
  const passwordInput = document.querySelector<HTMLInputElement>("#password");
  const emailError =
    document.querySelector<HTMLParagraphElement>("#email-error");
  const passwordError =
    document.querySelector<HTMLParagraphElement>("#password-error");

  if (
    form &&
    message &&
    emailInput &&
    passwordInput &&
    emailError &&
    passwordError
  ) {
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

      clearFieldError(emailInput, emailError);
      clearFieldError(passwordInput, passwordError);

      const formValues = {
        email: emailInput.value.trim(),
        password: passwordInput.value,
      };

      const errors = validateLoginForm(formValues);

      if (errors.email || errors.password) {
        if (errors.email) {
          showFieldError(emailInput, emailError, errors.email);
        }

        if (errors.password) {
          showFieldError(passwordInput, passwordError, errors.password);
        }

        message.textContent = "Please correct the highlighted fields.";
        message.className = alertStyles.error;
        message.setAttribute("role", "alert");

        if (errors.email) {
          emailInput.focus();
        } else {
          passwordInput.focus();
        }

        return;
      }

      try {
        message.textContent = "Logging you in...";
        message.className = alertStyles.info;
        message.setAttribute("role", "status");

        const response = await loginUser(formValues);

        saveAuth({
          accessToken: response.data.accessToken,
          profile: response.data,
        });

        let apiKey = getApiKey();

        if (!apiKey) {
          apiKey = await createApiKey(response.data.accessToken);
          saveApiKey(apiKey);
        }

        const profileName = response.data.name || "";

        if (!profileName) {
          throw new Error("Profile name is missing from login response.");
        }

        const freshProfile = await getProfileByName(
          profileName,
          response.data.accessToken,
          apiKey,
        );

        saveProfile(freshProfile);

        message.textContent = "Login successful. Redirecting...";
        message.className = alertStyles.success;
        message.setAttribute("role", "status");

        form.reset();

        const redirectUrl = getRedirectUrl();

        setTimeout(() => {
          window.location.href = redirectUrl;
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
