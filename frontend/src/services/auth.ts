import api from "@/lib/api";
import { IAuthResponse } from "@/types/auth";
import { ERROR_MESSAGES } from "@/constants/messages";
import { AxiosError } from "axios";

export async function login(
  email: string,
  password: string
): Promise<IAuthResponse> {
  try {
    const response = await api.post<IAuthResponse>("/auth/login", {
      email,
      password,
    });

    const { token } = response.data;
    api.defaults.headers.authorization = `Bearer ${token}`;
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }
      if (error.response?.status && error.response?.status >= 500) {
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
      }
    }
    throw new Error(ERROR_MESSAGES.DEFAULT);
  }
}
