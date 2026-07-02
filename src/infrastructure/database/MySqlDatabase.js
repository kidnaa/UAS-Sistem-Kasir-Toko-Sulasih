import mysql from "mysql2/promise";

export class MySqlDatabase {
  static instance = null;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "kasir_toko_sulasih",
      waitForConnections: true,
      connectionLimit: 10
    });
  }

  static getInstance() {
    if (!MySqlDatabase.instance) {
      MySqlDatabase.instance = new MySqlDatabase();
    }

    return MySqlDatabase.instance;
  }

  query(sql, params = []) {
    return this.pool.execute(sql, params);
  }

  execute(sql, params = []) {
    return this.query(sql, params);
  }

  async transaction(callback) {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
