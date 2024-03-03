import express, { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  registerRoutes(app: express.Application): void {
    app.get('/orders', this.getAllOrders.bind(this));
    app.get('/orders/:id', this.getOrderById.bind(this));
    app.get('/orders/user/:userId', this.getOrdersByUserId.bind(this));
    app.post('/orders', this.createOrder.bind(this));
    app.put('/orders/:id', this.updateOrder.bind(this));
    app.delete('/orders/:id', this.deleteOrder.bind(this));
  }

  async getAllOrders(req: Request, res: Response): Promise<void> {
    const orders = await this.orderService.getAllOrders();
    res.json(orders);
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const order = await this.orderService.getOrderById(id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  }

  async getOrdersByUserId(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const orders = await this.orderService.getOrdersByUserId(userId);
    res.json(orders);
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    const orderData = req.body;
    await this.orderService.createOrder(orderData);
    res.status(201).json({ message: 'Order created successfully' });
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const orderData = req.body;
    await this.orderService.updateOrder({ ...orderData, id });
    res.json({ message: 'Order updated successfully' });
  }

  async deleteOrder(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.orderService.deleteOrder(id);
    res.json({ message: 'Order deleted successfully' });
  }
}