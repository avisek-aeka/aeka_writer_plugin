import axios from "axios";
import { getBearerToken, BASE_API_URL } from "../config";

export async function bindSession(sessionId) {
  const url = `${BASE_API_URL}/session?session_id=${sessionId}`;
  try {
    const response = await axios.get(url, {
    headers: {
        Authorization: `Bearer ${getBearerToken()}`,
    },
  });
    return response.data;
  } catch (error) {
    throw new Error("Session fetch error: " + (error.response?.data?.message || error.message));
  }
}
