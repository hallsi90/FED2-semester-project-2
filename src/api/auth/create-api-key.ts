import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../../constants/api";
import type { ApiKeyResponse } from "../../types/api";

// Creates an API key for authenticated requests.
export async function createApiKey(token: string): Promise<string> {
  const response = await apiClient<ApiKeyResponse>(API_ENDPOINTS.createApiKey, {
    method: "POST",
    body: JSON.stringify({
      name: "Auction House App",
    }),
    token,
  });

  return response.data.key;
}
