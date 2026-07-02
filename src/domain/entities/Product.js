export class Product {
  constructor({ id, sku, name, category, price, stock, minimumStock }) {
    this.id = id;
    this.sku = sku;
    this.name = name;
    this.category = category;
    this.price = Number(price);
    this.stock = Number(stock);
    this.minimumStock = Number(minimumStock);
  }

  isLowStock() {
    return this.stock <= this.minimumStock;
  }
}
