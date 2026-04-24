import { API_BASE_URL } from "../constants/api";

interface ApiClientOptions extends RequestInit {
  token?: string;
  apiKey?: string;
}

interface ApiErrorResponse {
  errors?: Array<{
    message?: string;
  }>;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { token, apiKey, headers, ...fetchOptions } = options;

  const requestHeaders = new Headers(headers);

  requestHeaders.set("Content-Type", "application/json");

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (apiKey) {
    requestHeaders.set("X-Noroff-API-Key", apiKey);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  if (!response.ok) {
    let errorMessage = "Something went wrong. Please try again.";

    try {
      const errorData = (await response.json()) as ApiErrorResponse;
      errorMessage = errorData.errors?.[0]?.message || errorMessage;
    } catch {
      errorMessage = `${response.status} ${response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
