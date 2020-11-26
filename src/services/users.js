const MongoLib = require('../database');
const bcrypt = require('bcrypt');

const ScopesService = require('../services/scopes');
const Scopes = new ScopesService();
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
  async updateUser({ email }) {}

  async createUser({ user }) {
    const { identificationCard, name, email, password, isAdmin, team } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    let booleanIsAdmin = false;
    let scope = Scopes.isEmploye();
    if (isAdmin || isAdmin == 'Administrador') {
      booleanIsAdmin = true;
      scope = Scopes.isAdmin();
    }
    const createUserId = await this.mongoDB.create(this.collection, {
      identificationCard,
      name,
      email,
      password: hashedPassword,
      isAdmin: booleanIsAdmin,
      team,
      scopes: scope,
    });
    console.log(scope);
    return createUserId;
  }
}

module.exports = UsersService;
