import { ISale, ISaleForm } from "@/types/sale";
import api from "@/lib/api";

export const getSales = async (): Promise<ISale[]> => {
  try {
    const response = await api.get("/sales");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSale = async (sale: ISaleForm): Promise<ISale> => {
  try {
    const response = await api.post("/sales", sale);
    return response.data;
  } catch (error) {
    throw error;
  }
};
