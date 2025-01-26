import { IPayment, IPaymentForm } from "@/types/payment";
import api from "@/lib/api";

export const createPayment = async (
  payment: IPaymentForm
): Promise<IPayment> => {
  try {
    const response = await api.post("/payments", payment);
    return response.data;
  } catch (error) {
    throw error;
  }
};
