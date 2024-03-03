// src/controllers/userController.ts
import express from 'express';
import { UserService } from '../services/userService';
import { HTTPUserAdapter } from '../adapters/httpUserAdapter';

export class UserController {
  constructor(private readonly userService: UserService, private readonly httpUserAdapter: HTTPUserAdapter) {}

  registerRoutes(app: express.Application): void {
    app.get('/users', this.httpUserAdapter.getAllUsers.bind(this.httpUserAdapter));
    app.get('/users/:id', this.httpUserAdapter.getUserById.bind(this.httpUserAdapter));
    app.post('/users', this.httpUserAdapter.addUser.bind(this.httpUserAdapter));
    app.put('/users/:id', this.httpUserAdapter.updateUser.bind(this.httpUserAdapter));
    app.delete('/users/:id', this.httpUserAdapter.deleteUser.bind(this.httpUserAdapter));
  }
}
