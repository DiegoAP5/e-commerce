// src/adapters/mysqlUserAdapter.ts
import { User } from '../domain/user';
import { UserPort } from '../ports/userPort';
import mysql, { Pool } from 'mysql2/promise';

export class MySQLUserAdapter implements UserPort {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async initialize(): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query<any[]>('SHOW TABLES LIKE \'users\'');
      if (rows.length === 0) {
        await connection.query(`
          CREATE TABLE users (
            id VARCHAR(36) PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL
          )
        `);
      }
    } catch (error) {
      console.error('Error during database initialization:', error);
    } finally {
      connection.release();
    }
  }

  async getAllUsers(): Promise<User[]> {
    const connection = await this.pool.getConnection();
    console.log("entro a get")
    try {
      const [rows] = await connection.query<any[]>('SELECT * FROM users');
      console.log("entro 2",rows)
      return rows.map((row: any) => this.mapRowToUser(row));
    } finally {
      connection.release();
    }
  }

  async getUserById(id: string): Promise<User | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query<any[]>('SELECT * FROM users WHERE id = ?', [id]);
      if (rows.length === 0) {
        return undefined;
      }
      const row = rows[0];
      return {
        id: row.id,
        username: row.username,
        email: row.email
      };
    } finally {
      connection.release();
    }
  }

  async addUser(user: User): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query('INSERT INTO users SET ?', [user]);
    } finally {
      connection.release();
    }
  }

  async updateUser(user: User): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [user.username, user.email, user.id]);
    } finally {
      connection.release();
    }
  }

  async deleteUser(id: string): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query('DELETE FROM users WHERE id = ?', [id]);
    } finally {
      connection.release();
    }
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      username: row.username,
      email: row.email
    };
  }
}
