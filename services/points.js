const MongoLib = require('../database');

class PointsService {
  constructor() {
    this.collection = 'points';
    this.mongoDB = new MongoLib();
  }
  async getPoints() {
    const points = await this.mongoDB.getAll(this.collection);
    return points || [];
  }
  //creo que no es necesario
  async getPoint({ pointsId }) {
    const [points] = await this.mongoDB.getAll(this.collection, {
      pointsId,
    });
    return points;
  }
  async createPoints({ points }) {
    const {
      selfDevelopmentPoints,
      assistancePoints,
      directPoints,
      challengePoints,
      exhibitionPoints,
      teamPoints,
    } = points;

    const createPointsId = await this.mongoDB.create(this.collection, {
      selfDevelopmentPoints,
      assistancePoints,
      directPoints,
      challengePoints,
      exhibitionPoints,
      teamPoints,
    });

    return createPointsId;
  }

  async updatePoints({ pointsId, points }) {
    const updatePointsId = await this.mongoDB.update(
      this.collection,
      pointsId,
      points
    );
    return updatePointsId;
  }

  async deletePoints({ pointsId }) {
    const deletePointsId = await this.mongoDB.delete(this.collection, pointsId);
    return deletePointsId;
  }
}

module.exports = PointsService;
