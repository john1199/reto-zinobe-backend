const MongoLib = require('../database');

class teamsService {
  constructor() {
    this.collection = 'teams';
    this.mongoDB = new MongoLib();
  }
  async getTeams() {
    const seniorities = await this.mongoDB.getAll(this.collection);
    return seniorities || [];
  }
  //creo que no es necesario
  async getTeam({ teamId }) {
    const [team] = await this.mongoDB.getAll(this.collection, {
      teamId,
    });
    return team;
  }
  async createTeam({ team }) {
    const { name, description } = team;

    const createTeamId = await this.mongoDB.create(this.collection, {
      name,
      description,
    });

    return createTeamId;
  }

  async updateTeam({ teamId,  team}) {
    const updatedTeamId = await this.mongoDB.update(
      this.collection,
      teamId,
      team
    );
    return updatedTeamId;
  }

  async deleteSeniorities({ teamId }) {
    const deletedTeamId  = await this.mongoDB.delete(this.collection, teamId);
    return deletedTeamId;
  }

}

module.exports = teamsService;
