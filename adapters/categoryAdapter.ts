import { Category } from '../domain/category';
import { CategoryPort } from '../ports/categoryPort';
import { Pool, RowDataPacket } from 'mysql2/promise';

export class MySQLCategoryAdapter implements CategoryPort {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.createTable();
  }

  async createTable(): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS categories (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        )
      `);
    } finally {
      connection.release();
    }
  }

  async getAllCategories(): Promise<Category[]> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM categories');
      return rows.map(row => ({
        id: row.id,
        name: row.name
      })) as Category[];
    } finally {
      connection.release();
    }
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM categories WHERE id = ?', [id]);
      if (rows.length === 0) return undefined;
      const row = rows[0];
      return {
        id: row.id,
        name: row.name
      };
    } finally {
      connection.release();
    }
  }

  async addCategory(category: Category): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query('INSERT INTO categories SET ?', [category]);
    } finally {
      connection.release();
    }
  }

  async updateCategory(category: Category): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query('UPDATE categories SET name = ? WHERE id = ?', [
        category.name,
        category.id
      ]);
    } finally {
      connection.release();
    }
  }

  async deleteCategory(id: string): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query('DELETE FROM categories WHERE id = ?', [id]);
    } finally {
      connection.release();
    }
  }
}
