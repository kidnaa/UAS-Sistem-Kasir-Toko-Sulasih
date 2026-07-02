export class TransactionRepository {
  constructor(database) {
    this.database = database;
  }

  async findById(id) {
  const [rows] = await this.database.query(
    `SELECT t.id, t.invoice_number, u.name AS cashier_name,
            t.total, t.paid_amount, t.change_amount,
            t.payment_method, t.created_at
     FROM transactions t
     JOIN users u ON u.id = t.cashier_id
     WHERE t.id = ?`,
    [id]
  );

  if (!rows.length) return null;

  const transaction = rows[0];

  const [items] = await this.database.query(
    `SELECT ti.product_id, p.name, ti.quantity, ti.price, ti.subtotal
     FROM transaction_items ti
     JOIN products p ON p.id = ti.product_id
     WHERE ti.transaction_id = ?`,
    [id]
  );

  return {
    ...transaction,
    items
  };
}

  async create(transaction, connection) {
    const [transactionResult] = await connection.execute(
      `INSERT INTO transactions
       (invoice_number, cashier_id, total, paid_amount, change_amount, payment_method)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        transaction.invoiceNumber,
        transaction.cashierId,
        transaction.total,
        transaction.paidAmount,
        transaction.changeAmount,
        transaction.paymentMethod
      ]
    );

    for (const item of transaction.items) {
      await connection.execute(
        `INSERT INTO transaction_items
         (transaction_id, product_id, quantity, price, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [
          transactionResult.insertId,
          item.productId,
          item.quantity,
          item.price,
          item.subtotal
        ]
      );
    }

    return {
      id: transactionResult.insertId,
      ...transaction
    };
  }

  async findRecent() {
    const [rows] = await this.database.query(
      `SELECT t.id, t.invoice_number, u.name AS cashier_name, t.total,
              t.paid_amount, t.change_amount, t.payment_method, t.created_at
       FROM transactions t
       JOIN users u ON u.id = t.cashier_id
       ORDER BY t.created_at DESC
       LIMIT 20`
    );

    return rows;
  }

  async summary(startDate, endDate) {
    const [summaryRows] = await this.database.query(
      `SELECT COUNT(*) AS transaction_count, COALESCE(SUM(total), 0) AS revenue
       FROM transactions
       WHERE DATE(created_at) BETWEEN ? AND ?`,
      [startDate, endDate]
    );

    const [bestSellerRows] = await this.database.query(
      `SELECT p.name, SUM(ti.quantity) AS sold_quantity
       FROM transaction_items ti
       JOIN products p ON p.id = ti.product_id
       JOIN transactions t ON t.id = ti.transaction_id
       WHERE DATE(t.created_at) BETWEEN ? AND ?
       GROUP BY p.id, p.name
       ORDER BY sold_quantity DESC
       LIMIT 5`,
      [startDate, endDate]
    );

    return {
      transactionCount: Number(summaryRows[0].transaction_count),
      revenue: Number(summaryRows[0].revenue),
      bestSellers: bestSellerRows
    };
  }
}
