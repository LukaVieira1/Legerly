import api from "@/lib/api";
import { IStoreMetrics } from "@/types/store";

export const getStoreMetrics = async (): Promise<IStoreMetrics> => {
  try {
    const response = await api.get("/store/metrics");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
