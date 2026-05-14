import axios from "axios";

const BASE_URL =import.meta.env.VITE_API_URL + "/api/v1";

if (!import.meta.env.VITE_API_URL) {
  console.error("❌ VITE_API_URL is not set! Check your Vercel env variables.");
}

const api = axios.create({
    baseURL:BASE_URL, 
    withCredentials: true,
});

export default api;