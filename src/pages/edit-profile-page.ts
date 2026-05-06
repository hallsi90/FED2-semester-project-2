import { buttonStyles, cardStyles, formStyles } from "../components/ui";
import { ROUTES } from "../constants/routes";
import type { Profile } from "../types/api";

// Creates the edit profile page layout.
export function createEditProfilePage(profile: Profile): string {
  const bio = profile.bio?.trim() || "";
  const avatarUrl = profile.avatar?.url?.trim() || "";
  const avatarAlt = profile.avatar?.alt?.trim() || "";
  const bannerUrl = profile.banner?.url?.trim() || "";
  const bannerAlt = profile.banner?.alt?.trim() || "";

  return `
    <section class="mx-auto w-full max-w-2xl space-y-8 lg:max-w-3xl">
      <header class="space-y-3">
        <h1 class="text-3xl font-bold text-text-main md:text-4xl">
          Edit profile
        </h1>
        <p class="text-base leading-7 text-text-muted">
          Update your bio, avatar, and banner information.
        </p>
      </header>

      <section class="${cardStyles.base}">
        <form class="space-y-5" novalidate>
          <div
            id="edit-profile-message"
            class="hidden"
            aria-live="polite"
            aria-atomic="true"
          ></div>

          <div class="space-y-2">
            <label for="bio" class="${formStyles.label}">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="4"
              placeholder="Write a short bio"
              class="${formStyles.textarea}"
              aria-describedby="bio-helper bio-error"
            >${bio}</textarea>
            <p id="bio-helper" class="${formStyles.helperText}">
              Keep your bio short and clear. Maximum 160 characters.
            </p>
            <p
              id="bio-error"
              class="${formStyles.errorText} hidden"
              aria-live="polite"
            ></p>
          </div>

          <div class="space-y-2">
            <label for="avatar-url" class="${formStyles.label}">
              Avatar image URL
            </label>
            <input
              id="avatar-url"
              name="avatar-url"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              class="${formStyles.input}"
              value="${avatarUrl}"
              inputmode="url"
              autocapitalize="off"
              spellcheck="false"
              aria-describedby="avatar-url-error"
            />
            <p
              id="avatar-url-error"
              class="${formStyles.errorText} hidden"
              aria-live="polite"
            ></p>
          </div>

          <div class="space-y-2">
            <label for="avatar-alt" class="${formStyles.label}">
              Avatar alt text
            </label>
            <input
              id="avatar-alt"
              name="avatar-alt"
              type="text"
              placeholder="Describe the avatar image"
              class="${formStyles.input}"
              value="${avatarAlt}"
            />
          </div>

          <div class="space-y-2">
            <label for="banner-url" class="${formStyles.label}">
              Banner image URL
            </label>
            <input
              id="banner-url"
              name="banner-url"
              type="url"
              placeholder="https://example.com/banner.jpg"
              class="${formStyles.input}"
              value="${bannerUrl}"
              inputmode="url"
              autocapitalize="off"
              spellcheck="false"
              aria-describedby="banner-url-error"
            />
            <p
              id="banner-url-error"
              class="${formStyles.errorText} hidden"
              aria-live="polite"
            ></p>
          </div>

          <div class="space-y-2">
            <label for="banner-alt" class="${formStyles.label}">
              Banner alt text
            </label>
            <input
              id="banner-alt"
              name="banner-alt"
              type="text"
              placeholder="Describe the banner image"
              class="${formStyles.input}"
              value="${bannerAlt}"
            />
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <button type="submit" class="${buttonStyles.primary}">
              Save changes
            </button>

            <a href="${ROUTES.profile}" class="${buttonStyles.secondary}">
              Cancel
            </a>
          </div>
        </form>
      </section>
    </section>
  `;
}
