import { buttonStyles, cardStyles, formStyles } from "../components/ui";
import type { Profile } from "../types/api";

// Creates the edit profile page layout for preview and later update logic.
export function createEditProfilePage(profile: Profile): string {
  return `
    <section class="mx-auto w-full max-w-2xl space-y-8">
      <header class="space-y-3">
        <p class="text-sm font-medium text-text-muted">Profile settings</p>
        <h1 class="text-3xl font-bold text-text-main md:text-4xl">
          Edit profile
        </h1>
        <p class="text-base leading-7 text-text-muted">
          Update your bio, avatar, and banner information.
        </p>
      </header>

      <section class="${cardStyles.base}">
        <form class="space-y-5" novalidate>
          <div id="edit-profile-message" class="hidden"></div>

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
            >${profile.bio || ""}</textarea>
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
              value="${profile.avatar?.url || ""}"
            />
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
              value="${profile.avatar?.alt || ""}"
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
              value="${profile.banner?.url || ""}"
            />
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
              value="${profile.banner?.alt || ""}"
            />
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <button type="submit" class="${buttonStyles.primary}">
              Save changes
            </button>

            <a href="/profile/" class="${buttonStyles.secondary}">
              Cancel
            </a>
          </div>
        </form>
      </section>
    </section>
  `;
}
