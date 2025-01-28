import { IShortUser } from "./user";
import { IClient } from "./client";
import { IPayment } from "./payment";

export interface ISale {
  id: number;
  value: string;
  description: string;
  isPaid: boolean;
  saleDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  storeId: number;
  clientId: number;
  userId: number;
  client: IClient;
  user: IShortUser;
  payments: IPayment[];
}

export interface ISaleForm {
  clientId: number;
  value: number;
  description: string;
  dueDate: string;
  isPaid: boolean;
}

export interface ISaleFilters {
  page?: number;
  limit?: number;
  search?: string;
  isPaid?: string;
  startDate?: string;
  endDate?: string;
}
