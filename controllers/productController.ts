import express, { Request, Response } from 'express';
import { ProductService } from '../services/productService';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  registerRoutes(app: express.Application): void {
    app.get('/products', this.getAllProducts.bind(this));
    app.get('/products/:id', this.getProductById.bind(this));
    app.post('/products', this.addProduct.bind(this));
    app.put('/products/:id', this.updateProduct.bind(this));
    app.delete('/products/:id', this.deleteProduct.bind(this));
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    const products = await this.productService.getAllProducts();
    res.json(products);
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await this.productService.getProductById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  }

  async addProduct(req: Request, res: Response): Promise<void> {
    const productData = req.body;
    await this.productService.addProduct(productData);
    res.status(201).json({ message: 'Product added successfully' });
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const productData = req.body;
    await this.productService.updateProduct({ ...productData, id });
    res.json({ message: 'Product updated successfully' });
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.productService.deleteProduct(id);
    res.json({ message: 'Product deleted successfully' });
  }
}