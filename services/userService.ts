import { User } from '../domain/user';
import { UserPort } from '../ports/userPort';

export class UserService {
  constructor(private readonly userRepository: UserPort) {}

  async getAllUsers(): Promise<User[]> { // Asegúrate de que el método sea async para trabajar con promesas
    return this.userRepository.getAllUsers(); // Devuelve la promesa directamente
  }

  async getUserById(id: string): Promise<User | undefined> { // Asegúrate de que el método sea async para trabajar con promesas
    return this.userRepository.getUserById(id); // Devuelve la promesa directamente
  }

  async addUser(user: User): Promise<void> { // Asegúrate de que el método sea async para trabajar con promesas
    await this.userRepository.addUser(user); // Espera a que se resuelva la promesa
  }

  async updateUser(user: User): Promise<void> { // Asegúrate de que el método sea async para trabajar con promesas
    await this.userRepository.updateUser(user); // Espera a que se resuelva la promesa
  }

  async deleteUser(id: string): Promise<void> { // Asegúrate de que el método sea async para trabajar con promesas
    await this.userRepository.deleteUser(id); // Espera a que se resuelva la promesa
  }
}