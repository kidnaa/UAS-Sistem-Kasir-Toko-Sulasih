import { Product } from "../../domain/entities/Product.js";

function mapProduct(row) {
  return new Product({
    id: row.id,
    sku: row.sku,
    name: row.name,
    category: row.category,
    price: row.price,
    stock: row.stock,
    minimumStock: row.minimum_stock
  });
}

export class ProductRepository {
  constructor(database) {
    this.database = database;
  }

  async findAll(keyword = "") {
    const like = `%${keyword}%`;
    const [rows] = await this.database.query(
      `SELECT * FROM products
       WHERE name LIKE ? OR category LIKE ? OR sku LIKE ?
       ORDER BY name ASC`,
      [like, like, like]
    );

    return rows.map(mapProduct);
  }

  async findById(id, connection = this.database) {
    const [rows] = await connection.execute(
      "SELECT * FROM products WHERE id = ? LIMIT 1",
      [id]
    );

    return rows[0] ? mapProduct(rows[0]) : null;
  }

  async create(product) {
    const [result] = await this.database.query(
      `INSERT INTO products (sku, name, category, price, stock, minimum_stock)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        product.sku,
        product.name,
        product.category,
        product.price,
        product.stock,
        product.minimumStock
      ]
    );

    return this.findById(result.insertId);
  }

  async update(id, product) {
    await this.database.query(
      `UPDATE products
       SET sku = ?, name = ?, category = ?, price = ?, stock = ?, minimum_stock = ?
       WHERE id = ?`,
      [
        product.sku,
        product.name,
        product.category,
        product.price,
        product.stock,
        product.minimumStock,
        id
      ]
    );

    return this.findById(id);
  }

  async delete(id) {
    await this.database.query("DELETE FROM products WHERE id = ?", [id]);
  }

  async decrementStock(productId, quantity, connection) {
    await connection.execute(
      "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
      [quantity, productId, quantity]
    );
  }
}
