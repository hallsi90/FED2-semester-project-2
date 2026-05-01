import "../style.css";
import { getProfileByName } from "../api/profile/get-profile";
import { updateProfile } from "../api/profile/update-profile";
import { renderAuthRequiredState } from "../components/auth-required-state";
import { createLayout } from "../components/layout";
import { createLoadingState } from "../components/loading-state";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { createPageState } from "../components/page-state";
import { alertStyles } from "../components/ui";
import { ROUTES } from "../constants/routes";
import { createEditProfilePage } from "../pages/edit-profile-page";
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

  app.innerHTML = createLayout(
    createLoadingState({
      title: "Loading profile...",
      message: "Please wait while the edit profile form is prepared.",
    }),
  );

  initializeNavigation();
}

function renderErrorState(message: string): void {
  if (!app) {
    return;
  }

  app.innerHTML = createLayout(
    createPageState({
      title: "Edit profile unavailable",
      message,
      tone: "error",
    }),
  );

  initializeNavigation();
}

function clearFieldError(
  input: HTMLInputElement | HTMLTextAreaElement,
  errorElement: HTMLElement,
): void {
  input.setAttribute("aria-invalid", "false");
  errorElement.textContent = "";
  errorElement.classList.add("hidden");
}

function showFieldError(
  input: HTMLInputElement | HTMLTextAreaElement,
  errorElement: HTMLElement,
  errorMessage: string,
): void {
  input.setAttribute("aria-invalid", "true");
  errorElement.textContent = errorMessage;
  errorElement.classList.remove("hidden");
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

  const profileName = storedProfile.name;

  renderLoadingState();

  try {
    const profile: Profile = await getProfileByName(
      profileName,
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

    const bioError = document.querySelector<HTMLParagraphElement>("#bio-error");
    const avatarUrlError =
      document.querySelector<HTMLParagraphElement>("#avatar-url-error");
    const bannerUrlError =
      document.querySelector<HTMLParagraphElement>("#banner-url-error");

    if (
      !form ||
      !message ||
      !bioInput ||
      !avatarUrlInput ||
      !avatarAltInput ||
      !bannerUrlInput ||
      !bannerAltInput ||
      !bioError ||
      !avatarUrlError ||
      !bannerUrlError
    ) {
      return;
    }

    bioInput.addEventListener("input", () => {
      clearFieldError(bioInput, bioError);
    });

    avatarUrlInput.addEventListener("input", () => {
      clearFieldError(avatarUrlInput, avatarUrlError);
    });

    bannerUrlInput.addEventListener("input", () => {
      clearFieldError(bannerUrlInput, bannerUrlError);
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      message.textContent = "";
      message.className = "hidden";

      clearFieldError(bioInput, bioError);
      clearFieldError(avatarUrlInput, avatarUrlError);
      clearFieldError(bannerUrlInput, bannerUrlError);

      const validationErrors = validateEditProfileForm({
        bio: bioInput.value,
        avatarUrl: avatarUrlInput.value,
        bannerUrl: bannerUrlInput.value,
      });

      if (
        validationErrors.bio ||
        validationErrors.avatarUrl ||
        validationErrors.bannerUrl
      ) {
        if (validationErrors.bio) {
          showFieldError(bioInput, bioError, validationErrors.bio);
        }

        if (validationErrors.avatarUrl) {
          showFieldError(
            avatarUrlInput,
            avatarUrlError,
            validationErrors.avatarUrl,
          );
        }

        if (validationErrors.bannerUrl) {
          showFieldError(
            bannerUrlInput,
            bannerUrlError,
            validationErrors.bannerUrl,
          );
        }

        message.textContent = "Please correct the highlighted fields.";
        message.className = alertStyles.error;
        message.setAttribute("role", "alert");

        if (validationErrors.bio) {
          bioInput.focus();
        } else if (validationErrors.avatarUrl) {
          avatarUrlInput.focus();
        } else {
          bannerUrlInput.focus();
        }

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

      const triedToClearAvatar = !trimmedAvatarUrl && Boolean(currentAvatarUrl);
      const triedToClearBanner = !trimmedBannerUrl && Boolean(currentBannerUrl);

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
        if (triedToClearAvatar || triedToClearBanner) {
          message.textContent =
            "Removing avatar or banner images is not supported. Add a new image URL to replace the current one.";
          message.className = alertStyles.error;
          message.setAttribute("role", "alert");
          return;
        }

        message.textContent = "Make at least one change before saving.";
        message.className = alertStyles.error;
        message.setAttribute("role", "alert");
        return;
      }

      try {
        message.textContent = "Saving profile changes...";
        message.className = alertStyles.info;
        message.setAttribute("role", "status");

        const updatedProfile = await updateProfile(
          profileName,
          profileData,
          accessToken,
          apiKey,
        );

        saveProfile(updatedProfile);

        message.textContent = "Profile updated successfully. Redirecting...";
        message.className = alertStyles.success;
        message.setAttribute("role", "status");

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
        message.setAttribute("role", "alert");
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
