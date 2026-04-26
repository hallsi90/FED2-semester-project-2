import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../../constants/api";
import type { ApiResponse, Listing, UpdateListingBody } from "../../types/api";

// Sends an update request for a specific listing.
export async function updateListing(
  listingId: string,
  listing: UpdateListingBody,
  token: string,
  apiKey: string,
): Promise<Listing> {
  const response = await apiClient<ApiResponse<Listing>>(
    `${API_ENDPOINTS.listings}/${listingId}`,
    {
      method: "PUT",
      body: JSON.stringify(listing),
      token,
      apiKey,
    },
  );

  return response.data;
}
