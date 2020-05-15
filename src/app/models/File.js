import Sequelize, { Model } from 'sequelize';

// Classe modelo de Usuários.
class File extends Model {
  static init(sequelize) {
    // Método Privado do File extend Model
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File; // Exporta a Classe File criada extendida do Model modelo.
