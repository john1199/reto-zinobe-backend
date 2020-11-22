const MongoLib = require('../database');
const bcrypt = require('bcrypt');

class UsersService {
  constructor() {
    this.collection = 'users';
    this.mongoDB = new MongoLib();
  }

  async getUser({ email }) {
    const [user] = await this.mongoDB.getAll(this.collection, { email });
    return user;
  }

  async createUser({ user }) {
    const { identificationCard, name, email, password, isAdmin, team } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserId = await this.mongoDB.create(this.collection, {
      identificationCard,
      name,
      email,
      password: hashedPassword,
      isAdmin,
      team,
    });

    return createUserId;
  }
}

module.exports = UsersService;
