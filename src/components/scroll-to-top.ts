const SCROLL_THRESHOLD = 300;

// Handles the shared scroll-to-top button behavior.
export function initializeScrollToTop(): void {
  const scrollButton = document.querySelector<HTMLButtonElement>(
    "#scroll-to-top-button",
  );

  if (!scrollButton) {
    return;
  }

  const button = scrollButton;

  function updateButtonVisibility(): void {
    const shouldShow = window.scrollY > SCROLL_THRESHOLD;

    button.classList.toggle("hidden", !shouldShow);
    button.classList.toggle("flex", shouldShow);
  }

  function scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  updateButtonVisibility();

  window.addEventListener("scroll", updateButtonVisibility, { passive: true });

  button.addEventListener("click", () => {
    scrollToTop();
  });
}
