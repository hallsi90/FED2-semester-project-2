import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../../constants/api";
import type { ApiResponse, Listing } from "../../types/api";

// Fetches all listings created by a profile.
export async function getProfileListings(
  profileName: string,
  token: string,
  apiKey: string,
): Promise<Listing[]> {
  const response = await apiClient<ApiResponse<Listing[]>>(
    `${API_ENDPOINTS.profiles}/${profileName}/listings`,
    {
      token,
      apiKey,
    },
  );

  return response.data;
}
