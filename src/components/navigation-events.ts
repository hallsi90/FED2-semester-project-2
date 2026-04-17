// navigation-events.ts
// Handles navigation interactions such as opening and closing the mobile menu and desktop profile dropdown.

export function initializeMobileMenu(): void {
  const menuButton = document.querySelector<HTMLButtonElement>(
    "#mobile-menu-button",
  );
  const mobileMenu = document.querySelector<HTMLDivElement>("#mobile-menu");

  if (!menuButton || !mobileMenu) {
    return;
  }

  const mobileMenuButton = menuButton;
  const mobileMenuElement = mobileMenu;

  function closeMobileMenu(): void {
    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuElement.classList.add("hidden");
  }

  function toggleMobileMenu(): void {
    const isExpanded =
      mobileMenuButton.getAttribute("aria-expanded") === "true";

    mobileMenuButton.setAttribute("aria-expanded", String(!isExpanded));
    mobileMenuElement.classList.toggle("hidden");
  }

  mobileMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMobileMenu();
  });

  mobileMenuElement.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target.closest("a, button")) {
      closeMobileMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target as Node;

    if (
      !mobileMenuElement.contains(target) &&
      !mobileMenuButton.contains(target)
    ) {
      closeMobileMenu();
    }
  });
}

// Sets up the desktop profile dropdown menu behavior.
export function initializeProfileMenu(): void {
  const profileButton = document.querySelector<HTMLButtonElement>(
    "#profile-menu-button",
  );
  const profileMenu = document.querySelector<HTMLDivElement>("#profile-menu");

  if (!profileButton || !profileMenu) {
    return;
  }

  const profileMenuButton = profileButton;
  const profileMenuElement = profileMenu;

  function closeProfileMenu(): void {
    profileMenuButton.setAttribute("aria-expanded", "false");
    profileMenuElement.classList.add("hidden");
  }

  function toggleProfileMenu(): void {
    const isExpanded =
      profileMenuButton.getAttribute("aria-expanded") === "true";

    profileMenuButton.setAttribute("aria-expanded", String(!isExpanded));
    profileMenuElement.classList.toggle("hidden");
  }

  profileMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleProfileMenu();
  });

  profileMenuElement.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target.closest("a, button")) {
      closeProfileMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target as Node;

    if (
      !profileMenuElement.contains(target) &&
      !profileMenuButton.contains(target)
    ) {
      closeProfileMenu();
    }
  });
}
