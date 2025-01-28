import { ISale, ISaleForm, ISaleFilters } from "@/types/sale";
import api from "@/lib/api";

export const getSales = async (
  params: ISaleFilters = {}
): Promise<{
  sales: ISale[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    perPage: number;
  };
}> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });

    const response = await api.get(`/sales?${queryParams.toString()}`);
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

export const getSaleById = async (id: number): Promise<ISale> => {
  try {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSale = async (id: number): Promise<void> => {
  try {
    await api.delete(`/sales/${id}`);
  } catch (error) {
    throw error;
  }
};
