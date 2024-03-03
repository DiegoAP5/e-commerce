import { Product } from '../domain/product';
import { ProductPort } from '../ports/productPort';
import { Pool, RowDataPacket } from 'mysql2/promise';

export class MySQLProductAdapter implements ProductPort {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.createTable();
  }

  async createTable(): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS products (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          price FLOAT(10, 2) NOT NULL,
          categoryId VARCHAR(36) NOT NULL
        )
      `);
    } finally {
      connection.release();
    }
  }

  async getAllProducts(): Promise<Product[]> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM products');
      return rows.map(row => ({
        id: row.id,
        name: row.name,
        price: row.price,
        categoryId: row.categoryId
      })) as Product[];
    } finally {
      connection.release();
    }
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [id]);
      if (rows.length === 0) return undefined;
      const row = rows[0];
      return {
        id: row.id,
        name: row.name,
        price: row.price,
        categoryId: row.categoryId
      };
    } finally {
      connection.release();
    }
  }

  async addProduct(product: Product): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query('INSERT INTO products SET ?', [product]);
    } finally {
      connection.release();
    }
  }

  async updateProduct(product: Product): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query('UPDATE products SET name = ?, price = ?, categoryId = ? WHERE id = ?', [
        product.name,
        product.price,
        product.categoryId,
        product.id
      ]);
    } finally {
      connection.release();
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query('DELETE FROM products WHERE id = ?', [id]);
    } finally {
      connection.release();
    }
  }
}
