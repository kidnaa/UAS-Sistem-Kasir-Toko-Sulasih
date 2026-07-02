// Strategy Pattern: setiap strategi punya aturan berbeda untuk menghitung kembalian
class CashPaymentStrategy {
  calculateChange(total, paidAmount) {
    if (paidAmount < total) {
      const error = new Error("Uang pembayaran kurang dari total belanja");
      error.statusCode = 400;
      throw error;
    }

    return paidAmount - total;
  }
}

class ExactPaymentStrategy {
  calculateChange(total, paidAmount) {
    if (paidAmount !== total) {
      const error = new Error("Pembayaran pas harus sama dengan total belanja");
      error.statusCode = 400;
      throw error;
    }

    return 0;
  }
}

// Factory Pattern: menentukan strategi pembayaran mana yang dipakai
// berdasarkan metode pembayaran yang dikirim dari transaksi
export class PaymentStrategyFactory {
  create(method) {
    if (method === "exact") {
      return new ExactPaymentStrategy();
    }

    return new CashPaymentStrategy();
  }
}