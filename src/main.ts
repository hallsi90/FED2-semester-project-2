import "./style.css";
import { createLayout } from "./components/layout";
import {
  initializeMobileMenu,
  initializeProfileMenu,
} from "./components/navigation-events";
import { createListingsPage } from "./pages/listings-page";
import type { Listing } from "./types/api";

const sampleListings: Listing[] = [
  {
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
  },
  {
    id: "2",
    title: "Desk lamp",
    description:
      "Modern desk lamp with adjustable arm. Works perfectly and gives a warm light for studying or reading.",
    tags: ["lamp", "desk"],
    media: [
      {
        url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
        alt: "Desk lamp on a table",
      },
    ],
    created: "2026-04-17T10:00:00.000Z",
    updated: "2026-04-17T10:00:00.000Z",
    endsAt: "2026-04-22T18:00:00.000Z",
    _count: {
      bids: 3,
    },
  },
  {
    id: "3",
    title: "Gaming chair",
    description:
      "Comfortable gaming chair with adjustable height and back support. Lightly used and still in very good condition.",
    tags: ["chair", "gaming"],
    media: [
      {
        url: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
        alt: "Gaming chair in a room",
      },
    ],
    created: "2026-04-17T10:00:00.000Z",
    updated: "2026-04-17T10:00:00.000Z",
    endsAt: "2026-04-28T18:00:00.000Z",
    _count: {
      bids: 11,
    },
  },
];

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = createLayout(createListingsPage(sampleListings));

  initializeMobileMenu();
  initializeProfileMenu();
}
