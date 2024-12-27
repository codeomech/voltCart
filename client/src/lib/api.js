import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
});

// Use POST to send the auth code in the request body
export const googleAuth = (code) => api.post("/google-login", { code });
