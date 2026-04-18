import "./style.css";
import { createLayout } from "./components/layout";
import {
  initializeMobileMenu,
  initializeProfileMenu,
} from "./components/navigation-events";
import { createSingleListingPage } from "./pages/single-listing-page";
import type { Listing } from "./types/api";

const sampleListing: Listing = {
  id: "1",
  title: "Vintage camera",
  description:
    "A well-kept vintage camera in good condition. Perfect for collectors or anyone interested in classic photography gear. Includes original strap and lens cap. Great as both a display item and a usable camera for enthusiasts.",
  tags: ["camera", "vintage"],
  media: [
    {
      url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
      alt: "Vintage camera on a table",
    },
  ],
  created: "2026-04-17T10:00:00.000Z",
  updated: "2026-04-17T10:00:00.000Z",
  endsAt: "2026-04-25T18:00:00.000Z",
  _count: {
    bids: 7,
  },
  seller: {
    name: "Ingelinn",
    email: "ingelinn@stud.noroff.no",
    credits: 1200,
  },
};

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = createLayout(createSingleListingPage(sampleListing));

  initializeMobileMenu();
  initializeProfileMenu();
}
