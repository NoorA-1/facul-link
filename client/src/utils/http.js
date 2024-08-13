import axios from "axios";

const http = axios.create({
  baseURL: `https://facul-link-api.vercel.app/api/v1`,
});

export default http;
