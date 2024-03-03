import { Order } from '../domain/order';

export interface OrderPort {
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  createOrder(order: Order): Promise<void>;
  updateOrder(order: Order): Promise<void>;
  deleteOrder(id: string): Promise<void>;
}