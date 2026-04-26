import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../../constants/api";
import type { ApiResponse, Profile } from "../../types/api";

// Fetches a single profile by name.
export async function getProfileByName(
  profileName: string,
  token: string,
  apiKey: string,
): Promise<Profile> {
  const response = await apiClient<ApiResponse<Profile>>(
    `${API_ENDPOINTS.profiles}/${profileName}`,
    {
      token,
      apiKey,
    },
  );

  return response.data;
}
