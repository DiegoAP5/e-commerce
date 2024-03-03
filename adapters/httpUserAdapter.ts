// src/adapters/httpUserAdapter.ts
import express, { Request, Response } from 'express';
import { User } from '../domain/user';
import { UserService } from '../services/userService';

export class HTTPUserAdapter {
  constructor(private readonly userService: UserService) {}

  getAllUsers(req: Request, res: Response): void {
    const users = this.userService.getAllUsers();
    res.json(users);
  }

  getUserById(req: Request, res: Response): void {
    const { id } = req.params;
    const user = this.userService.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }

  addUser(req: Request, res: Response): void {
    const userData: User = req.body;
    this.userService.addUser(userData);
    res.status(201).json({ message: 'User added successfully' });
  }

  updateUser(req: Request, res: Response): void {
    const { id } = req.params;
    const userData: User = req.body;
    userData.id = id; // Ensure the ID in the body matches the ID in the URL
    this.userService.updateUser(userData);
    res.json({ message: 'User updated successfully' });
  }

  deleteUser(req: Request, res: Response): void {
    const { id } = req.params;
    this.userService.deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  }
}
