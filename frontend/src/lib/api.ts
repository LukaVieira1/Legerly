import axios from "axios";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({ baseURL: apiURL });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("@Legerly:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
