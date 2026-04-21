import "./style.css";
import { createLayout } from "./components/layout";
import {
  initializeMobileMenu,
  initializeProfileMenu,
} from "./components/navigation-events";
import { createCreateListingPage } from "./pages/create-listing-page";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = createLayout(createCreateListingPage());

  initializeMobileMenu();
  initializeProfileMenu();
}
