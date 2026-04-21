import "./style.css";
import { createLayout } from "./components/layout";
import {
  initializeMobileMenu,
  initializeProfileMenu,
} from "./components/navigation-events";
import { createRegisterPage } from "./pages/register-page";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = createLayout(createRegisterPage());

  initializeMobileMenu();
  initializeProfileMenu();
}