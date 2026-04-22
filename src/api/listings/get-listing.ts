import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../../constants/api";
import type { ApiResponse, Listing } from "../../types/api";

// Fetches a single auction listing by id, including seller and bids.
export async function getListingById(listingId: string): Promise<Listing> {
  const response = await apiClient<ApiResponse<Listing>>(
    `${API_ENDPOINTS.listings}/${listingId}?_seller=true&_bids=true`,
  );

  return response.data;
}
