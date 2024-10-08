import axios from "axios";

const http = axios.create({
  baseURL: `${import.meta.env.VITE_BACKENDURL}/api/v1`,
  withCredentials: true,
});

export default http;
