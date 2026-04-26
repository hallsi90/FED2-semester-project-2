import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../../constants/api";
import type { ApiResponse, CreateListingBody, Listing } from "../../types/api";

// Sends a create listing request to the API.
export async function createListing(
  listing: CreateListingBody,
  token: string,
  apiKey: string,
): Promise<Listing> {
  const response = await apiClient<ApiResponse<Listing>>(
    API_ENDPOINTS.listings,
    {
      method: "POST",
      body: JSON.stringify(listing),
      token,
      apiKey,
    },
  );

  return response.data;
}
