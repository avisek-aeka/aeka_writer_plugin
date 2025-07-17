import { BASE_API_URL, getBearerToken } from "../config";

export async function renameSession(sessionId, newName = "") {
  const response = await fetch(`${BASE_API_URL}/session`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getBearerToken()}`
    },
    body: JSON.stringify({ session_id: sessionId, new_name: newName })
  });
  if (!response.ok) {
    throw new Error("Failed to rename session");
  }
  return await response.json();
}
