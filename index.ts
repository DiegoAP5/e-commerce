import express from 'express';
import { createPool, Pool } from 'mysql2/promise';
import { MySQLUserAdapter } from './adapters/userAdapter';
import { UserService } from './services/userService';
import { UserController } from './controllers/userController';
import { HTTPUserAdapter } from './adapters/httpUserAdapter';
import { MySQLCategoryAdapter } from './adapters/categoryAdapter';
import { CategoryController } from './controllers/categoryController';
import { CategoryService } from './services/categoryService';
import { MySQLOrderAdapter } from './adapters/orderAdapter';
import { OrderController } from './controllers/orderController';
import { OrderService } from './services/orderService';
import { MySQLProductAdapter } from './adapters/productAdapter';
import { ProductController } from './controllers/productController';
import { ProductService } from './services/productService';

const app = express();
const port = 3000;

app.use(express.json());

async function initializeApp(): Promise<void> {
  try {
    const pool: Pool = createPool({
      host: 'localhost',
      user: 'diego',
      password: 'alberto05',
      database: 'prueba',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const userAdapter = new MySQLUserAdapter(pool);
    await userAdapter.initialize();

    const categoryAdapter = new MySQLCategoryAdapter(pool);
    await categoryAdapter.createTable();

    const orderAdapter = new MySQLOrderAdapter(pool);
    await orderAdapter.createTable();

    const productAdapter = new MySQLProductAdapter(pool);
    productAdapter.createTable();

    const categoryService = new CategoryService(categoryAdapter);
    const categoryController = new CategoryController(categoryService);
    const userService = new UserService(userAdapter);
    const httpUserAdapter = new HTTPUserAdapter(userService);
    const userController = new UserController(userService, httpUserAdapter);
    const orderService = new OrderService(orderAdapter);
    const orderController = new OrderController(orderService);
    const productService = new ProductService(productAdapter);
    const productController = new ProductController(productService);

    userController.registerRoutes(app);
    categoryController.registerRoutes(app);
    orderController.registerRoutes(app);
    productController.registerRoutes(app);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error initializing the app:', error);
    process.exit(1);
  }
}

initializeApp();
