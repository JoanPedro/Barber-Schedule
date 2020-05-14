import Sequelize, { Model } from 'sequelize';

// Classe modelo de Usuários.
class User extends Model {
  static init(sequelize) {
    // Método Privado do User extend Model
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
  }
}

export default User; // Exporta a Classe User criada extendida do Model modelo.
