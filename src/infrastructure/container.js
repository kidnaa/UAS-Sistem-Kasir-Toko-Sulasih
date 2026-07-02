import { AuthService } from "../application/services/AuthService.js";
import { ProductService } from "../application/services/ProductService.js";
import { ReportService } from "../application/services/ReportService.js";
import { TransactionService } from "../application/services/TransactionService.js";
import { MySqlDatabase } from "./database/MySqlDatabase.js";
import { ProductRepository } from "./repositories/ProductRepository.js";
import { TransactionRepository } from "./repositories/TransactionRepository.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { PaymentStrategyFactory } from "./patterns/PaymentStrategyFactory.js";

export function buildContainer() {
  const database = MySqlDatabase.getInstance();
  const userRepository = new UserRepository(database);
  const productRepository = new ProductRepository(database);
  const transactionRepository = new TransactionRepository(database);
  const paymentStrategyFactory = new PaymentStrategyFactory();

  return {
    authService: new AuthService(userRepository),
    productService: new ProductService(productRepository),
    reportService: new ReportService(transactionRepository),
    transactionService: new TransactionService({
      productRepository,
      transactionRepository,
      paymentStrategyFactory
    })
  };
}
