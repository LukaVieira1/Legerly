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

export const deletePayment = async (id: number): Promise<void> => {
  try {
    await api.delete(`/payments/${id}`);
  } catch (error) {
    throw error;
  }
};
