import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../../constants/api";
import type { ApiResponse, Listing } from "../../types/api";

// Fetches public active auction listings from the API.
export async function getListings(): Promise<Listing[]> {
  const response = await apiClient<ApiResponse<Listing[]>>(
    `${API_ENDPOINTS.listings}?_active=true`,
  );

  return response.data;
}
