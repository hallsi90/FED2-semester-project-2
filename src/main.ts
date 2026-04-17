import "./style.css";
import { createLayout } from "./components/layout";
import {
  initializeMobileMenu,
  initializeProfileMenu,
} from "./components/navigation-events";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = createLayout(`
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-primary-dark">Auction House</h1>
      <p class="text-base text-text-muted">
        Shared navigation is ready.
      </p>
    </section>
  `);

  initializeMobileMenu();
  initializeProfileMenu();
}
