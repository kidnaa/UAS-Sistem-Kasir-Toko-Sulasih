export class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async list(keyword) {
    const products = await this.productRepository.findAll(keyword);

    return products.map((product) => ({
      ...product,
      lowStock: product.isLowStock()
    }));
  }

  create(payload) {
    this.validate(payload);
    return this.productRepository.create(this.normalize(payload));
  }

  update(id, payload) {
    this.validate(payload);
    return this.productRepository.update(id, this.normalize(payload));
  }

  delete(id) {
    return this.productRepository.delete(id);
  }

  validate(payload) {
    const requiredFields = ["sku", "name", "category", "price", "stock"];
    const missingField = requiredFields.find((field) => payload[field] === undefined || payload[field] === "");

    if (missingField) {
      const error = new Error(`Field ${missingField} wajib diisi`);
      error.statusCode = 400;
      throw error;
    }

    if (Number(payload.price) <= 0 || Number(payload.stock) < 0) {
      const error = new Error("Harga harus lebih dari 0 dan stok tidak boleh negatif");
      error.statusCode = 400;
      throw error;
    }
  }

  normalize(payload) {
    return {
      sku: payload.sku,
      name: payload.name,
      category: payload.category,
      price: Number(payload.price),
      stock: Number(payload.stock),
      minimumStock: Number(payload.minimumStock || payload.minimum_stock || 5)
    };
  }
}
