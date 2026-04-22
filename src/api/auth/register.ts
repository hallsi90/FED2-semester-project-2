import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../../constants/api";
import type { RegisterBody } from "../../types/api";

// Sends a register request to the Noroff API.
export async function registerUser(data: RegisterBody): Promise<void> {
  await apiClient(API_ENDPOINTS.register, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
