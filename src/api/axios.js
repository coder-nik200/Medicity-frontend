import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://medicity-backend.vercel.app/api",
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // Add auth token if available
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (!error.response) {
//       // Network error
//       error.message = "Network error. Please check your connection.";
//     }  else if (error.response.status === 401) {
//   localStorage.removeItem("authToken");

//   // Don't redirect here. Let the app handle it.
//   return Promise.reject(error);
//     } else if (error.response.status === 403) {
//       // Forbidden
//       error.message = "You don't have permission to perform this action.";
//     } else if (error.response.status === 404) {
//       // Not found
//       error.message = error.response.data?.message || "Resource not found.";
//     } else if (error.response.status === 500) {
//       // Server error
//       error.message = "Server error. Please try again later.";
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
