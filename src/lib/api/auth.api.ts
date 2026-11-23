import api from "./axios";
import { saveToken } from "../utils/storage";

export const adminLogin = async (username: string, password: string) => {
  const res = await api.post("/auth/login", { username, password });
  saveToken(res.data.token);
  return res.data;
};
