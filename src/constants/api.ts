export const API_BASE_URL = "https://v2.api.noroff.dev";

export const API_ENDPOINTS = {
  register: "/auth/register",
  login: "/auth/login",
  listings: "/auction/listings",
  profiles: "/auction/profiles",
} as const;
