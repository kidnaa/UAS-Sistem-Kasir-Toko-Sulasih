export class Transaction {
  constructor({ invoiceNumber, cashierId, items, paidAmount, paymentMethod }) {
    this.invoiceNumber = invoiceNumber;
    this.cashierId = cashierId;
    this.items = items;
    this.paidAmount = Number(paidAmount);
    this.paymentMethod = paymentMethod;
  }

  total() {
    return this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }
}
