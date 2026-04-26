import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../../constants/api";

// Sends a delete request for a specific listing.
export async function deleteListing(
  listingId: string,
  token: string,
  apiKey: string,
): Promise<void> {
  await apiClient<void>(`${API_ENDPOINTS.listings}/${listingId}`, {
    method: "DELETE",
    token,
    apiKey,
  });
}
