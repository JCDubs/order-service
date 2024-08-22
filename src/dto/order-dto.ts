import { OrderStatus } from '../types';

export type OrderLineDTO = {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  createdDateTime?: string;
  updatedDateTime?: string;
};

export type OrderDTO = {
  id?: string;
  customerId: string;
  createdDateTime?: string;
  updatedDateTime?: string;
  createdBy: string;
  status?: OrderStatus;
  totalAmount?: number;
  branchId: string;
  comments?: string;
  orderLines?: OrderLineDTO[];
};

export type UpdatedOrderLineDTO = {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
};

export type UpdatedOrderDTO = {
  customerId: string;
  status?: OrderStatus;
  totalAmount?: number;
  branchId: string;
  comments?: string;
  orderLines?: OrderLineDTO[];
};
