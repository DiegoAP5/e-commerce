import { Order } from '../domain/order';
import { OrderPort } from '../ports/orderPort';
import { Pool, RowDataPacket } from 'mysql2/promise';

export class MySQLOrderAdapter implements OrderPort {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.createTable();
  }

  async createTable(): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(36) PRIMARY KEY,
          userId VARCHAR(36) NOT NULL,
          productId VARCHAR(36) NOT NULL,
          quantity INT NOT NULL,
          totalPrice DECIMAL(10, 2) NOT NULL,
          status ENUM('pending', 'completed') NOT NULL
        )
      `);
    } finally {
      connection.release();
    }
  }

  async getAllOrders(): Promise<Order[]> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM orders');
      return rows.map(row => ({
        id: row.id,
        userId: row.userId,
        productId: row.productId,
        quantity: row.quantity,
        totalPrice: row.totalPrice,
        status: row.status
      })) as Order[];
    } finally {
      connection.release();
    }
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM orders WHERE id = ?', [id]);
      if (rows.length === 0) return undefined;
      const row = rows[0];
      return {
        id: row.id,
        userId: row.userId,
        productId: row.productId,
        quantity: row.quantity,
        totalPrice: row.totalPrice,
        status: row.status
      } as Order;
    } finally {
      connection.release();
    }
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM orders WHERE userId = ?', [userId]);
      return rows.map(row => ({
        id: row.id,
        userId: row.userId,
        productId: row.productId,
        quantity: row.quantity,
        totalPrice: row.totalPrice,
        status: row.status
      })) as Order[];
    } finally {
      connection.release();
    }
  }

  async createOrder(order: Order): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query('INSERT INTO orders (id, userId, productId, quantity, totalPrice, status) VALUES (?, ?, ?, ?, ?, ?)', [
        order.id,
        order.userId,
        order.productId,
        order.quantity,
        order.totalPrice,
        order.status
      ]);
    } finally {
      connection.release();
    }
  }

  async updateOrder(order: Order): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query('UPDATE orders SET userId = ?, productId = ?, quantity = ?, totalPrice = ?, status = ? WHERE id = ?', [
        order.userId,
        order.productId,
        order.quantity,
        order.totalPrice,
        order.status,
        order.id
      ]);
    } finally {
      connection.release();
    }
  }

  async deleteOrder(id: string): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query('DELETE FROM orders WHERE id = ?', [id]);
    } finally {
      connection.release();
    }
  }
}
