const MongoLib = require('../database');
const bcrypt = require('bcrypt');

class UsersService {
  constructor() {
    this.collection = 'users';
    this.mongoDB = new MongoLib();
  }
  async getUsers() {
    const user = await this.mongoDB.getAll(this.collection);
    return user || [];
  }
  async getUser({ email }) {
    const [user] = await this.mongoDB.getAll(this.collection, { email });
    return user;
  }
  async get({ userId }) {
    const user = await this.mongoDB.get(this.collection, userId);
    return user || {};
  }
  async updateUser({ email }) {}

  async createUser({ user }) {
    const { identificationCard, name, email, password, isAdmin, team } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    let booleanIsAdmin = false;
    if (isAdmin || isAdmin == 'Administrador') {
      booleanIsAdmin = true;
    }
    const createUserId = await this.mongoDB.create(this.collection, {
      identificationCard,
      name,
      email,
      password: hashedPassword,
      isAdmin: booleanIsAdmin,
      team,
    });
    return createUserId;
  }

  async updateUser({ userId, user }) {
    const updateUserId = await this.mongoDB.update(
      this.collection,
      userId,
      user
    );
    return updateUserId;
  }

  async deletedUser({ userId }) {
    const deletedUserId = await this.mongoDB.delete(this.collection, userId);
    return deletedUserId;
  }
}

module.exports = UsersService;
