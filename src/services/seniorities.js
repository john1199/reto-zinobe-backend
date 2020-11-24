const MongoLib = require('../database');
const bcrypt = require('bcrypt');

class SenioritiesService {
  constructor() {
    this.collection = 'seniorities';
    this.mongoDB = new MongoLib();
  }
  async getSeniorities() {
    const seniorities = await this.mongoDB.getAll(this.collection);
    return seniorities || [];
  }
  //creo que no es necesario
  async getSenioritie({ senioritiesId }) {
    const [senioritie] = await this.mongoDB.getAll(this.collection, {
      senioritiesId,
    });
    return senioritie;
  }
  async createSenioritie({ senioritie }) {
    const { name, description } = senioritie;

    const createSenioritiesId = await this.mongoDB.create(this.collection, {
      name,
      description,
    });

    return createSenioritiesId;
  }

  async updateSeniorities({ senioritieId,  senioritie}) {
    const updatedSenioritieId = await this.mongoDB.update(
      this.collection,
      senioritieId,
      senioritie
    );
    return updatedSenioritieId;
  }

  async deleteSeniorities({ senioritiesId }) {
    const deletedSenioritieId  = await this.mongoDB.delete(this.collection, senioritiesId);
    return deletedSenioritieId;
  }

}

module.exports = SenioritiesService;
