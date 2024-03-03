import express, { Request, Response } from 'express';
import { CategoryService } from '../../application/services/categoryService';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  registerRoutes(app: express.Application): void {
    app.get('/categories', this.getAllCategories.bind(this));
    app.get('/categories/:id', this.getCategoryById.bind(this));
    app.post('/categories', this.addCategory.bind(this));
    app.put('/categories/:id', this.updateCategory.bind(this));
    app.delete('/categories/:id', this.deleteCategory.bind(this));
  }

  async getAllCategories(req: Request, res: Response): Promise<void> {
    const categories = await this.categoryService.getAllCategories();
    res.json(categories);
  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const category = await this.categoryService.getCategoryById(id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  }

  async addCategory(req: Request, res: Response): Promise<void> {
    const categoryData = req.body;
    await this.categoryService.addCategory(categoryData);
    res.status(201).json({ message: 'Category added successfully' });
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const categoryData = req.body;
    await this.categoryService.updateCategory({ ...categoryData, id });
    res.json({ message: 'Category updated successfully' });
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.categoryService.deleteCategory(id);
    res.json({ message: 'Category deleted successfully' });
  }
}