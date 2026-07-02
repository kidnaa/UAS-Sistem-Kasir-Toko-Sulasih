export class Transaction {
  constructor({ invoiceNumber, cashierId, items, paidAmount, paymentMethod }) {
    this.invoiceNumber = invoiceNumber;
    this.cashierId = cashierId;
    this.items = items;
    this.paidAmount = Number(paidAmount);
    this.paymentMethod = paymentMethod;
  }

  // Menjumlahkan subtotal semua item menjadi total belanja
  total() {
    return this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }
}