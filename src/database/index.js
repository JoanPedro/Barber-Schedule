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

    models
      // Mapeia os Modelos criados um a um com a conexão.
      .map((model) => model.init(this.connection))
      .map(
        // Somente associa os models que possuem associate.
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database(); // Cria uma nova instância de Database()
