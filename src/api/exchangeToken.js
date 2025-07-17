import axios from "axios";
import { AUTH_API_URL } from "../config";
export async function exchangeToken(msAccessToken) {
//   const apiUrl = `https://e87720534a6b.ngrok-free.app/exchange-token?ms_token=${encodeURIComponent(msAccessToken)}`;

  const apiUrl = `${AUTH_API_URL}/exchange-token?ms_token=${encodeURIComponent(msAccessToken)}`;
  const response = await axios.get(apiUrl, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  });
  return response.data;
}