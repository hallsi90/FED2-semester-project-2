import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../../constants/api";
import type { ApiResponse, Profile } from "../../types/api";

interface GetProfileOptions {
  includeListings?: boolean;
}

// Fetches a single profile by name.
export async function getProfileByName(
  profileName: string,
  token: string,
  apiKey: string,
  options: GetProfileOptions = {},
): Promise<Profile> {
  const queryParams = new URLSearchParams();

  if (options.includeListings) {
    queryParams.set("_listings", "true");
  }

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `${API_ENDPOINTS.profiles}/${profileName}?${queryString}`
    : `${API_ENDPOINTS.profiles}/${profileName}`;

  const response = await apiClient<ApiResponse<Profile>>(endpoint, {
    token,
    apiKey,
  });

  return response.data;
}
