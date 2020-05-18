import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

// Classe modelo de Usuários.
class Appointment extends Model {
  static init(sequelize) {
    // Método Privado do Appointment extend Model
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          // Verifica se a data do lançamento é anterior à data atual.
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          // Retorna a resposta se um agendamento é cancelável ou não.
          /* Existe uma regra de negócio que um agendamento só poderá ser
          cancelado pelo menos duas horas antes do agendado. */
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
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
