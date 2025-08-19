import axios from "axios";

// Create an axios instance without forcing Content-Type
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Spring Boot base URL
});

export default api;
