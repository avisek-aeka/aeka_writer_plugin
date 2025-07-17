import axios from "axios";
import { getBearerToken, BASE_API_URL } from "../config";

export async function createSession() {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/session`,
      {
        session_type: "agentic_draft",
        llm_name: "gpt",
      },
      {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getBearerToken()}`,
    },
      }
    );
    const data = response.data;
  return data?.session?.session_id;
  } catch (error) {
    throw new Error("Session creation failed: " + (error.response?.data?.message || error.message));
  }
}
