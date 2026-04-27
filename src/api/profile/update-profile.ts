import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../../constants/api";
import type { ApiResponse, Profile } from "../../types/api";

interface UpdateProfileBody {
  bio?: string;
  avatar?: {
    url: string;
    alt: string;
  };
  banner?: {
    url: string;
    alt: string;
  };
}

// Sends an update request for a profile.
export async function updateProfile(
  profileName: string,
  profileData: UpdateProfileBody,
  token: string,
  apiKey: string,
): Promise<Profile> {
  const response = await apiClient<ApiResponse<Profile>>(
    `${API_ENDPOINTS.profiles}/${profileName}`,
    {
      method: "PUT",
      body: JSON.stringify(profileData),
      token,
      apiKey,
    },
  );

  return response.data;
}
