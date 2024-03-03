import { Order } from '../domain/order';
import { OrderPort } from '../ports/orderPort';

export class OrderService {
  constructor(private readonly orderRepository: OrderPort) {}

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.getAllOrders();
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    return this.orderRepository.getOrderById(id);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.getOrdersByUserId(userId);
  }

  async createOrder(order: Order): Promise<void> {
    await this.orderRepository.createOrder(order);
  }

  async updateOrder(order: Order): Promise<void> {
    await this.orderRepository.updateOrder(order);
  }

  async deleteOrder(id: string): Promise<void> {
    await this.orderRepository.deleteOrder(id);
  }
}