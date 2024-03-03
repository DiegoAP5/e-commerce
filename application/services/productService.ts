import { Product } from '../../domain/product';
import { ProductPort } from '../../domain/ports/productPort';

export class ProductService {
  constructor(private readonly productRepository: ProductPort) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.getAllProducts();
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.productRepository.getProductById(id);
  }

  async addProduct(product: Product): Promise<void> {
    await this.productRepository.addProduct(product);
  }

  async updateProduct(product: Product): Promise<void> {
    await this.productRepository.updateProduct(product);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productRepository.deleteProduct(id);
  }
}