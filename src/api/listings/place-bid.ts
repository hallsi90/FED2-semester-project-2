import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../../constants/api";
import type { ApiResponse, Bid, BidBody } from "../../types/api";

// Sends a bid request for a specific listing.
export async function placeBid(
  listingId: string,
  bid: BidBody,
  token: string,
  apiKey: string,
): Promise<Bid> {
  const response = await apiClient<ApiResponse<Bid>>(
    `${API_ENDPOINTS.listings}/${listingId}/bids`,
    {
      method: "POST",
      body: JSON.stringify(bid),
      token,
      apiKey,
    },
  );

  return response.data;
}
