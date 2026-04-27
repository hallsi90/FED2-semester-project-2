import "../style.css";
import { renderAuthRequiredState } from "../components/auth-required-state";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { alertStyles } from "../components/ui";
import { createEditProfilePage } from "../pages/edit-profile-page";
import { getProfile as getStoredProfile } from "../utils/auth-storage";
import { validateEditProfileForm } from "../utils/validation";

const app = document.querySelector<HTMLDivElement>("#app");

function initializeNavigation(): void {
  initializeMobileMenu();
  initializeProfileMenu();
  initializeLogout();
}

if (app) {
  const storedProfile = getStoredProfile();

  if (!storedProfile) {
    app.innerHTML = createLayout(
      renderAuthRequiredState(
        "Edit profile unavailable",
        "You must be logged in to edit your profile.",
      ),
    );

    initializeNavigation();
  } else {
    app.innerHTML = createLayout(createEditProfilePage(storedProfile));
    initializeNavigation();

    const form = document.querySelector<HTMLFormElement>("form");
    const message = document.querySelector<HTMLDivElement>(
      "#edit-profile-message",
    );
    const bioInput = document.querySelector<HTMLTextAreaElement>("#bio");
    const avatarUrlInput =
      document.querySelector<HTMLInputElement>("#avatar-url");
    const bannerUrlInput =
      document.querySelector<HTMLInputElement>("#banner-url");

    if (form && message && bioInput && avatarUrlInput && bannerUrlInput) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const validationErrors = validateEditProfileForm({
          bio: bioInput.value,
          avatarUrl: avatarUrlInput.value,
          bannerUrl: bannerUrlInput.value,
        });

        const errorMessages = [
          validationErrors.bio,
          validationErrors.avatarUrl,
          validationErrors.bannerUrl,
        ].filter(Boolean);

        if (errorMessages.length > 0) {
          message.textContent = errorMessages.join(" ");
          message.className = alertStyles.error;
          return;
        }

        message.textContent =
          "Profile validation passed. API request comes next.";
        message.className = alertStyles.success;
      });
    }
  }
}
