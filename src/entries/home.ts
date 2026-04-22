import "../style.css";
import { createLayout } from "../components/layout";
import {
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { createListingsPage } from "../pages/listings-page";
import type { Listing, Profile } from "../types/api";

const sampleProfile: Profile = {
  name: "Ingelinn",
  email: "ingelinn@stud.noroff.no",
  bio: "Frontend student interested in creating clean, modern, and user-friendly web interfaces.",
  credits: 1200,
  avatar: {
    url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    alt: "Profile avatar",
  },
};

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
    seller: sampleProfile,
  },
  {
    id: "2",
    title: "Desk lamp",
    description:
      "Modern desk lamp with adjustable arm. Works perfectly and gives a warm light for studying or reading.",
    tags: ["desk", "lighting"],
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
    seller: sampleProfile,
  },
  {
    id: "3",
    title: "Gaming chair",
    description:
      "Comfortable gaming chair with adjustable height and back support. Lightly used and still in very good condition.",
    tags: ["gaming", "chair"],
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
    seller: sampleProfile,
  },
];

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = createLayout(createListingsPage(sampleListings));

  initializeMobileMenu();
  initializeProfileMenu();
}
