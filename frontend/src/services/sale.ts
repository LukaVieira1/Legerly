import { ISale } from "@/types/sale";
import api from "@/lib/api";

export const getSales = async (): Promise<ISale[]> => {
  try {
    const response = await api.get("/sales");
    return response.data;
  } catch (error) {
    throw error;
  }
};
