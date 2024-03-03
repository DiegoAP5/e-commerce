import { Category } from '../domain/category';
import { CategoryPort } from '../ports/categoryPort';

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryPort) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.getAllCategories();
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categoryRepository.getCategoryById(id);
  }

  async addCategory(category: Category): Promise<void> {
    await this.categoryRepository.addCategory(category);
  }

  async updateCategory(category: Category): Promise<void> {
    await this.categoryRepository.updateCategory(category);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.categoryRepository.deleteCategory(id);
  }
}