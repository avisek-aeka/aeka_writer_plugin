import axios from "axios";
import { AUTH_API_URL } from "../config";

export async function getUserInfo(token) {
  const resp = await axios.get(`${AUTH_API_URL}/me`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return resp.data;
}
