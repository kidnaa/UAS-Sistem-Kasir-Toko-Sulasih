import { Transaction } from "../../domain/entities/Transaction.js";

export class TransactionService {
  constructor({ productRepository, transactionRepository, paymentStrategyFactory }) {
    this.productRepository = productRepository;
    this.transactionRepository = transactionRepository;
    this.paymentStrategyFactory = paymentStrategyFactory;
  }
  async getById(id) {
  const transaction = await this.transactionRepository.findById(id);

  if (!transaction) {
    const error = new Error("Transaksi tidak ditemukan");
    error.statusCode = 404;
    throw error;
  }

  return transaction;
}

  async checkout(payload) {
    const cashierId = Number(payload.cashierId);
    const items = payload.items || [];

    if (!cashierId || items.length === 0) {
      const error = new Error("Kasir dan item transaksi wajib diisi");
      error.statusCode = 400;
      throw error;
    }

    return this.productRepository.database.transaction(async (connection) => {
      const checkedItems = [];

      for (const item of items) {
        const product = await this.productRepository.findById(item.productId, connection);
        const quantity = Number(item.quantity);

        if (!product) {
          const error = new Error("Produk tidak ditemukan");
          error.statusCode = 404;
          throw error;
        }

        if (quantity <= 0 || product.stock < quantity) {
          const error = new Error(`Stok ${product.name} tidak mencukupi`);
          error.statusCode = 400;
          throw error;
        }

        checkedItems.push({
          productId: product.id,
          name: product.name,
          quantity,
          price: product.price,
          subtotal: product.price * quantity
        });
      }

      const transaction = new Transaction({
        invoiceNumber: this.generateInvoiceNumber(),
        cashierId,
        items: checkedItems,
        paidAmount: Number(payload.paidAmount),
        paymentMethod: payload.paymentMethod || "cash"
      });

      const total = transaction.total();
      const strategy = this.paymentStrategyFactory.create(transaction.paymentMethod);
      const changeAmount = strategy.calculateChange(total, transaction.paidAmount);

      for (const item of checkedItems) {
        await this.productRepository.decrementStock(item.productId, item.quantity, connection);
      }

      return this.transactionRepository.create(
        {
          invoiceNumber: transaction.invoiceNumber,
          cashierId: transaction.cashierId,
          total,
          paidAmount: transaction.paidAmount,
          changeAmount,
          paymentMethod: transaction.paymentMethod,
          items: checkedItems
        },
        connection
      );
    });
  }

  listRecent() {
    return this.transactionRepository.findRecent();
  }

  generateInvoiceNumber() {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
    return `INV-${timestamp}-${Math.floor(Math.random() * 900 + 100)}`;
  }
}
