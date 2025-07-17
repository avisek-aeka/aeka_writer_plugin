export function getBearerToken() {
  return localStorage.getItem("auth-token") || "";
}

export const BASE_API_URL = "https://api.taxllm.aeka.dev";

export const AUTH_API_URL = "https://auth.aekallm.aekaadvisors.com";
