export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export type PaginationParams = { offset?: string; limit?: number };

export interface ListItems<T> {
  items: T[];
  offset?: string;
}
