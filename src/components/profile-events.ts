// Handles profile page interactions such as expanding and collapsing listing sections on the profile page.
export function initializeProfileSections(): void {
  const createdToggle = document.querySelector<HTMLButtonElement>(
    "#created-listings-toggle",
  );
  const createdContent = document.querySelector<HTMLDivElement>(
    "#created-listings-content",
  );
  const createdIcon = document.querySelector<HTMLSpanElement>(
    "#created-listings-icon",
  );

  if (createdToggle && createdContent && createdIcon) {
    createdToggle.addEventListener("click", () => {
      const isExpanded = createdToggle.getAttribute("aria-expanded") === "true";

      createdToggle.setAttribute("aria-expanded", String(!isExpanded));
      createdContent.classList.toggle("hidden");
      createdIcon.classList.toggle("rotate-180", !isExpanded);
    });
  }

  const bidToggle = document.querySelector<HTMLButtonElement>(
    "#bid-listings-toggle",
  );
  const bidContent = document.querySelector<HTMLDivElement>(
    "#bid-listings-content",
  );
  const bidIcon = document.querySelector<HTMLSpanElement>("#bid-listings-icon");

  if (bidToggle && bidContent && bidIcon) {
    bidToggle.addEventListener("click", () => {
      const isExpanded = bidToggle.getAttribute("aria-expanded") === "true";

      bidToggle.setAttribute("aria-expanded", String(!isExpanded));
      bidContent.classList.toggle("hidden");
      bidContent.classList.toggle("grid");
      bidIcon.classList.toggle("rotate-180", !isExpanded);
    });
  }

  const winsToggle = document.querySelector<HTMLButtonElement>("#wins-toggle");
  const winsContent = document.querySelector<HTMLDivElement>("#wins-content");
  const winsIcon = document.querySelector<HTMLSpanElement>("#wins-icon");

  if (winsToggle && winsContent && winsIcon) {
    winsToggle.addEventListener("click", () => {
      const isExpanded = winsToggle.getAttribute("aria-expanded") === "true";

      winsToggle.setAttribute("aria-expanded", String(!isExpanded));
      winsContent.classList.toggle("hidden");
      winsContent.classList.toggle("grid");
      winsIcon.classList.toggle("rotate-180", !isExpanded);
    });
  }
}
