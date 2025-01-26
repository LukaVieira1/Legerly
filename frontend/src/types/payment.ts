import { IClient } from "./client";
import { ISale } from "./sale";

export interface IPaymentForm {
  value: number;
  saleId: number;
}
export interface IPayment {
  id: number;
  value: string;
  payDate: string;
  createdAt: string;
  updatedAt: string;
  saleId: number;
  sale: ISale;
  storeId: number;
  clientId: number;
  userId: number;
  client: IClient;
}
