import axios from "axios";
import { getBearerToken, BASE_API_URL } from "../config";

export async function sendInstruction(message, sessionId) {
  if (!message || !sessionId) throw new Error("Message and sessionId are required");
  try {
    const response = await axios.post(
      `${BASE_API_URL}/session/doc`,
      {
        session_id: sessionId,
        user_instruction: message,
        draft_type: "doc",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getBearerToken()}`,
        },
        timeout: 600000
      }
    );
    return typeof response.data === "string" ? response.data : JSON.stringify(response.data);
  } catch (error) {
    throw new Error("API error: " + (error.response?.data?.message || error.message));
  }
}
