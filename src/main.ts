import "./style.css";
import { createLayout } from "./components/layout";
import {
  initializeMobileMenu,
  initializeProfileMenu,
} from "./components/navigation-events";
import { createListingCard } from "./components/listing-card";
import type { Listing } from "./types/api";

// Temporary sample data used to preview the reusable listing card component.
const sampleListing: Listing = {
  id: "1",
  title: "Vintage camera",
  description:
    "A well-kept vintage camera in good condition. Perfect for collectors or anyone interested in classic photography gear.",
  tags: ["camera", "vintage"],
  media: [
    {
      url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
      alt: "Vintage camera on a table",
    },
  ],
  created: "2026-04-17T10:00:00.000Z",
  updated: "2026-04-17T10:00:00.000Z",
  endsAt: "2026-04-25T18:00:00.000Z",
  _count: {
    bids: 7,
  },
};

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = createLayout(`
    <section class="space-y-6">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-text-main">Auction House</h1>
        <p class="text-base text-text-muted">
          Preview of the reusable listing card component.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        ${createListingCard(sampleListing)}
      </div>
    </section>
  `);

  initializeMobileMenu();
  initializeProfileMenu();
}
