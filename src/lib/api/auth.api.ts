import api from "./axios";
import { saveToken } from "../utils/storage";

export const adminLogin = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  saveToken(res.data.token);
  return res.data;
};
