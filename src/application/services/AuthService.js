export class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async login(username, password) {
    const user = await this.userRepository.findByUsername(username);

    if (!user || user.password !== password) {
      const error = new Error("Username atau password salah");
      error.statusCode = 401;
      throw error;
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role
    };
  }
}
