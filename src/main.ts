import "./style.css";
import { createLayout } from "./components/layout";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = createLayout(`
    <section class="space-y-4">
      <h1 class="text-3xl font-bold text-[#1F2937]">Auction House</h1>
      <p class="text-base text-[#4B5563]">
        Base app layout is ready.
      </p>
    </section>
  `);
}
