import "../style.css";
import { createLayout } from "../components/layout";
import {
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { createLoginPage } from "../pages/login-page";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = createLayout(createLoginPage());

  initializeMobileMenu();
  initializeProfileMenu();
}
