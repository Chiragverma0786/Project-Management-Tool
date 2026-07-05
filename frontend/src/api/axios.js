import axios from "axios";

console.log("backend",import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Redirect to login only if not already on login page
          const currentPath = window.location.pathname;
          if (currentPath !== "/" && currentPath !== "/login" && currentPath !== "/register") {
            localStorage.removeItem("token");
            window.location.href = "/";
          }
          break;

        case 403:
          console.error("Access Denied");
          break;

        case 404:
          console.error("Resource Not Found");
          break;

        case 500:
          console.error("Server Error");
          break;

        default:
          if (error.response.data?.message) {
            console.error(error.response.data.message);
          }
      }

    } else if (error.request) {
      console.error("No response from server:", error.message);
    } else {
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }

);

export default api;