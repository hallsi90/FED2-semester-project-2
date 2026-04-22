import "./style.css";
import { createLayout } from "./components/layout";
import {
  initializeMobileMenu,
  initializeProfileMenu,
} from "./components/navigation-events";
import { createEditListingPage } from "./pages/edit-listing-page";
import type { Listing, Profile } from "./types/api";

const sampleProfile: Profile = {
  name: "Ingelinn",
  email: "ingelinn@stud.noroff.no",
  bio: "Frontend student interested in creating clean, modern, and user-friendly web interfaces.",
  credits: 1200,
};

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
  seller: sampleProfile,
};

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = createLayout(createEditListingPage(sampleListing));

  initializeMobileMenu();
  initializeProfileMenu();
}
