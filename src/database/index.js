// Loader dos Models

import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // Cria a Conexão com o DB

    models.map((model) => model.init(this.connection));
    // Mapeia os Modelos criados um a um com a conexão.
  }
}

export default new Database(); // Cria uma nova instância de Database()
