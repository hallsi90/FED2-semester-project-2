import { apiClient } from "../api-client";
import type { ApiKeyResponse } from "../../types/api";

// Creates an API key for authenticated requests.
export async function createApiKey(token: string): Promise<string> {
  const response = await apiClient<ApiKeyResponse>("/auth/create-api-key", {
    method: "POST",
    body: JSON.stringify({
      name: "Auction House App",
    }),
    token,
  });

  return response.data.key;
}
