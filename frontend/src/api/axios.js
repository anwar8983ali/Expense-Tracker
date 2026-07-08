import axios from 'axios';

// In dev, create a frontend/.env with: VITE_API_URL=http://localhost:8080
// In production (Vercel), set VITE_API_URL to your Render backend URL,
// e.g. https://your-backend.onrender.com
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true, // send the session cookie on every request
});

export default api;
