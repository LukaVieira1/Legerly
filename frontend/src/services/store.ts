import api from "@/lib/api";

interface GetStoreMetricsParams {
  startDate?: string;
  endDate?: string;
}

export const getStoreMetrics = async (params: GetStoreMetricsParams = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await api.get(`/store/metrics?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
