import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../../constants/api";
import type { LoginBody, LoginResponse } from "../../types/api";

// Sends a login request to the Noroff API.
export async function loginUser(data: LoginBody): Promise<LoginResponse> {
  return await apiClient<LoginResponse>(API_ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
