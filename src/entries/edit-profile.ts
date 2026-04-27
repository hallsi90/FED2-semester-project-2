import "../style.css";
import { getProfileByName } from "../api/profile/get-profile";
import { updateProfile } from "../api/profile/update-profile";
import { renderAuthRequiredState } from "../components/auth-required-state";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { alertStyles } from "../components/ui";
import { createEditProfilePage } from "../pages/edit-profile-page";
import { ROUTES } from "../constants/routes";
import {
  getAccessToken,
  getApiKey,
  getProfile as getStoredProfile,
  saveProfile,
} from "../utils/auth-storage";
import { validateEditProfileForm } from "../utils/validation";
import type { Profile } from "../types/api";

const app = document.querySelector<HTMLDivElement>("#app");

function initializeNavigation(): void {
  initializeMobileMenu();
  initializeProfileMenu();
  initializeLogout();
}

function renderLoadingState(): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(`
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-text-main md:text-4xl">
        Loading profile...
      </h1>
      <p class="text-base text-text-muted">
        Please wait while the edit profile form is prepared.
      </p>
    </section>
  `);

  initializeNavigation();
}

function renderErrorState(message: string): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(`
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-text-main md:text-4xl">
        Edit profile unavailable
      </h1>
      <div class="${alertStyles.error}">
        ${message}
      </div>
    </section>
  `);

  initializeNavigation();
}

async function renderEditProfilePage(): Promise<void> {
  if (!app) {
    return;
  }

  const storedProfile = getStoredProfile();
  const accessToken = getAccessToken();
  const apiKey = getApiKey();

  if (!storedProfile?.name || !accessToken || !apiKey) {
    app.innerHTML = createLayout(
      renderAuthRequiredState(
        "Edit profile unavailable",
        "You must be logged in to edit your profile.",
      ),
    );

    initializeNavigation();
    return;
  }

  renderLoadingState();

  try {
    const profile: Profile = await getProfileByName(
      storedProfile.name,
      accessToken,
      apiKey,
    );

    app.innerHTML = createLayout(createEditProfilePage(profile));
    initializeNavigation();

    const form = document.querySelector<HTMLFormElement>("form");
    const message = document.querySelector<HTMLDivElement>(
      "#edit-profile-message",
    );
    const bioInput = document.querySelector<HTMLTextAreaElement>("#bio");
    const avatarUrlInput =
      document.querySelector<HTMLInputElement>("#avatar-url");
    const avatarAltInput =
      document.querySelector<HTMLInputElement>("#avatar-alt");
    const bannerUrlInput =
      document.querySelector<HTMLInputElement>("#banner-url");
    const bannerAltInput =
      document.querySelector<HTMLInputElement>("#banner-alt");

    if (
      !form ||
      !message ||
      !bioInput ||
      !avatarUrlInput ||
      !avatarAltInput ||
      !bannerUrlInput ||
      !bannerAltInput
    ) {
      return;
    }

    form.addEventListener("submit", async (event) => {
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

      const trimmedBio = bioInput.value.trim();
      const trimmedAvatarUrl = avatarUrlInput.value.trim();
      const trimmedAvatarAlt = avatarAltInput.value.trim();
      const trimmedBannerUrl = bannerUrlInput.value.trim();
      const trimmedBannerAlt = bannerAltInput.value.trim();

      const currentBio = profile.bio ?? "";
      const currentAvatarUrl = profile.avatar?.url ?? "";
      const currentAvatarAlt = profile.avatar?.alt ?? "";
      const currentBannerUrl = profile.banner?.url ?? "";
      const currentBannerAlt = profile.banner?.alt ?? "";

      if (!trimmedAvatarUrl && currentAvatarUrl) {
        message.textContent =
          "Clearing the avatar image is not supported in this form yet.";
        message.className = alertStyles.error;
        return;
      }

      if (!trimmedBannerUrl && currentBannerUrl) {
        message.textContent =
          "Clearing the banner image is not supported in this form yet.";
        message.className = alertStyles.error;
        return;
      }

      const profileData: {
        bio?: string;
        avatar?: { url: string; alt: string };
        banner?: { url: string; alt: string };
      } = {};

      if (trimmedBio !== currentBio) {
        profileData.bio = trimmedBio;
      }

      if (
        trimmedAvatarUrl &&
        (trimmedAvatarUrl !== currentAvatarUrl ||
          trimmedAvatarAlt !== currentAvatarAlt)
      ) {
        profileData.avatar = {
          url: trimmedAvatarUrl,
          alt: trimmedAvatarAlt,
        };
      }

      if (
        trimmedBannerUrl &&
        (trimmedBannerUrl !== currentBannerUrl ||
          trimmedBannerAlt !== currentBannerAlt)
      ) {
        profileData.banner = {
          url: trimmedBannerUrl,
          alt: trimmedBannerAlt,
        };
      }

      if (Object.keys(profileData).length === 0) {
        message.textContent = "Make at least one change before saving.";
        message.className = alertStyles.error;
        return;
      }

      try {
        message.textContent = "Saving profile changes...";
        message.className = alertStyles.info;

        const updatedProfile = await updateProfile(
          profile.name,
          profileData,
          accessToken,
          apiKey,
        );

        saveProfile(updatedProfile);

        message.textContent = "Profile updated successfully. Redirecting...";
        message.className = alertStyles.success;

        setTimeout(() => {
          window.location.href = ROUTES.profile;
        }, 1500);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Something went wrong while updating the profile.";

        message.textContent = errorMessage;
        message.className = alertStyles.error;
      }
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading the profile.";

    renderErrorState(errorMessage);
  }
}

void renderEditProfilePage();
