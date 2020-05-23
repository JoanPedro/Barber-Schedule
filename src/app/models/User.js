import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

// Classe modelo de Usuários.
class User extends Model {
  static init(sequelize) {
    // Método Privado do User extend Model.
    /* Os dados dentro do super.init() devem ser aqueles que sofrerão
    modificações dentro da base de dados. Se o dado existir na base de dados mas
    não estar contido dentro do super.init(), não sofrerá modificações por
    manipulações com o sequelize. */

    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // Nunca existirá na Base de dados.
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    /* Antes de qualquer usuário ser salvo (Criado ou editado) a função criada
      Será executada de forma automática. */
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  /* Pertence à User, transforma-o em uma coluna avatar_id. Cria um relacionamento
  com o model File. */
  static associate(models) {
    // 'as' = Codinome. Substitui "File" que é o nome do model pelo nome: "avatar".
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
    /* password: Digitado e this.password_hash é a senha
      já criptografada pelo cadastro. */
  }
}

export default User; // Exporta a Classe User criada extendida do Model modelo.
