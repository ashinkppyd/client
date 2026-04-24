import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});


API.interceptors.request.use(
  (config) => {
    console.log("API REQUEST:", config.url);
    return config;
  },
  (error) => Promise.reject(error)
);


API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log("API ERROR:", error.response.data);

      if (error.response.status === 401) {
        console.warn("Unauthorized - cookie missing or expired ");
      }
    } else {
      console.log("NETWORK ERROR:", error);
    }
    return Promise.reject(error);
  }
);

export default API;