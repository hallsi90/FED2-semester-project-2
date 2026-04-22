import "../style.css";
import { createLayout } from "../components/layout";
import {
  initializeLogout,
  initializeMobileMenu,
  initializeProfileMenu,
} from "../components/navigation-events";
import { createEditProfilePage } from "../pages/edit-profile-page";
import type { Profile } from "../types/api";

const sampleProfile: Profile = {
  name: "Ingelinn",
  email: "ingelinn@stud.noroff.no",
  bio: "Frontend student interested in creating clean, modern, and user-friendly web interfaces.",
  credits: 1200,
  avatar: {
    url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    alt: "Profile avatar",
  },
  banner: {
    url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    alt: "Soft workspace banner",
  },
};

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = createLayout(createEditProfilePage(sampleProfile));

  initializeMobileMenu();
  initializeProfileMenu();
  initializeLogout();
}
