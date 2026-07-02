export class UserRepository {
  constructor(database) {
    this.database = database;
  }

  async findByUsername(username) {
    const [rows] = await this.database.query(
      "SELECT id, name, username, password, role FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    return rows[0] || null;
  }
}
