import Sequelize, { Model } from 'sequelize';

// Classe modelo de Usuários.
class Appointment extends Model {
  static init(sequelize) {
    // Método Privado do Appointment extend Model
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    // Mais de 1 relacionamento na mesma tabela, o 'as'/'apelido' é obrigatório.
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment; // Exporta a Classe Appointment criada extendida do Model modelo.
