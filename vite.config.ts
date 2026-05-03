import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        login: resolve(root, "login/index.html"),
        register: resolve(root, "register/index.html"),
        profile: resolve(root, "profile/index.html"),
        editProfile: resolve(root, "profile/edit/index.html"),
        listing: resolve(root, "listing/index.html"),
        createListing: resolve(root, "listing/create/index.html"),
        editListing: resolve(root, "listing/edit/index.html"),
      },
    },
  },
});
