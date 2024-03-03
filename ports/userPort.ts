import { User } from '../domain/user';

export interface UserPort {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | undefined>;
  addUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
  deleteUser(id: string): Promise<void>;
}