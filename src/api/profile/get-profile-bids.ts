import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../../constants/api";
import type { ApiResponse, Bid } from "../../types/api";

// Fetches all bids made by a profile, including the associated listings.
export async function getProfileBids(
  profileName: string,
  token: string,
  apiKey: string,
): Promise<Bid[]> {
  const response = await apiClient<ApiResponse<Bid[]>>(
    `${API_ENDPOINTS.profiles}/${profileName}/bids?_listings=true`,
    {
      token,
      apiKey,
    },
  );

  return response.data;
}
